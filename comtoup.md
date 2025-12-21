<div dir="rtl">

# راهنمای راه‌اندازی و آپدیت پروژه SDO (سرور + Docker)

این فایل یک «چیت‌شیت» و راهنمای مرحله‌به‌مرحله برای راه‌اندازی/آپدیت پروژه روی سرور است.

> نکته: نمایش فونت در Markdown به برنامه‌ی نمایش‌دهنده بستگی دارد؛ اگر خوانایی کم است، فونت‌هایی مثل `Vazirmatn` / `IRANSansX` / `Tahoma` بهترند.

---

## مشخصات این پروژه

- **Repo:** `https://github.com/kingzoner/SDO-backend.git`
- **Branch:** `main_mohammad`
- **Server IP:** `194.34.239.118`
- **Ports:**
  - Backend: `8000`
  - Frontend: `8081`
  - Postgres (فقط لوکال سرور): `127.0.0.1:5050`

---

## 1) اتصال به سرور (از ویندوز)

در PowerShell ویندوز:

```powershell
ssh root@194.34.239.118
```

اگر پرامپت شبیه این شد یعنی داخل سرور هستی و **دستورهای لینوکسی** را باید همین‌جا بزنی:

```text
root@...:~#
```

خروج از سرور:

```bash
exit
```

---

## 2) نصب پیش‌نیازها روی سرور

داخل SSH (روی سرور):

```bash
apt update
apt install -y git nano docker.io docker-compose-v2
systemctl enable --now docker

docker --version
docker compose version || docker-compose version
```

اگر `docker-compose-v2` پیدا نشد، این را امتحان کن:

```bash
apt install -y docker-compose
```

---

## 3) گرفتن پروژه و رفتن روی برنچ

### اگر اولین بار است:

```bash
cd /root
git clone https://github.com/kingzoner/SDO-backend.git
cd SDO-backend
git checkout main_mohammad
git pull --ff-only origin main_mohammad
```

### اگر قبلاً کلون شده:

```bash
cd /root/SDO-backend
git checkout main_mohammad
git pull --ff-only origin main_mohammad
```

---

## 4) تنظیم فایل `.env` روی سرور

فایل `.env` را از نمونه بساز و ویرایش کن:

```bash
cd /root/SDO-backend
cp -f .env.example .env
nano .env
```

### 4.1) دو خط مهم برای سرور (حتماً با پورت)

این‌ها باید **دقیقاً** با IP سرور تنظیم شوند:

```env
SDO_APP__CORS_ORIGINS=http://194.34.239.118:8081
VITE_API_URL=http://194.34.239.118:8000
```

چرا؟ چون اگر `localhost` باشد، مرورگر کاربر فکر می‌کند API روی کامپیوتر خودش است.

### 4.2) ساخت کلید JWT (خیلی مهم)

این خط را از `change_me` عوض کن:

```env
SDO_JWT__SECRET_KEY=...
```

ساخت کلید روی سرور:

```bash
openssl rand -hex 32
```

اگر OpenSSL نبود:

```bash
apt install -y openssl
```

یا ساخت کلید روی ویندوز (PowerShell):

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
($bytes | ForEach-Object { $_.ToString('x2') }) -join ''
```

### 4.3) ذخیره/خروج در `nano`

- ذخیره: `Ctrl+O` سپس `Enter`
- خروج: `Ctrl+X`

---

## 5) اجرای پروژه با Docker Compose

داخل `/root/SDO-backend`:

```bash
docker compose up --build -d
```

چک وضعیت:

```bash
docker compose ps
```

تست سلامت بک‌اند:

```bash
curl -4 http://127.0.0.1:8000/health
```

آدرس‌ها برای مرورگر (روی کامپیوتر خودت):

- Frontend: `http://194.34.239.118:8081`
- Backend docs: `http://194.34.239.118:8000/docs`

اگر صفحه فرانت تغییرات را نشان نداد: `Ctrl+F5`.

---

## 6) آپدیت کردن پروژه (وقتی کد جدید Push شد)

روی سرور:

```bash
cd /root/SDO-backend
git checkout main_mohammad
git pull --ff-only origin main_mohammad

docker compose up --build -d
```

اگر فقط فرانت تغییر کرده بود:

```bash
docker compose up --build -d frontend
```

---

## 7) لاگ‌ها و عیب‌یابی سریع

لاگ کل سرویس‌ها:

```bash
docker compose logs -f
```

لاگ بک‌اند:

```bash
docker compose logs --tail=200 app
```

ریستارت بک‌اند:

```bash
docker compose restart app
```

بررسی پورت‌ها:

```bash
ss -lntp | grep -E ':8000|:8081|:5050'
```

اگر از بیرون باز نمی‌شود:

```bash
ufw status
```

---

## 8) دیتابیس: دیدن یوزرها/نقش‌ها

ورود به Postgres داخل کانتینر:

```bash
docker exec -it db_postgres_sdo psql -U root -d postgres
```

داخل `psql`:

- نقش‌های PostgreSQL:

```sql
\du
```

- جدول‌ها:

```sql
\dt
```

- کاربران برنامه:

```sql
SELECT id, username, "roleType", "studyGroup" FROM "User" ORDER BY id;
```

- roleType های موجود:

```sql
SELECT DISTINCT "roleType" FROM "User";
```

خروج:

```sql
\q
```

### اتصال از ویندوز با pgAdmin (با SSH Tunnel)

چون DB روی سرور فقط به `127.0.0.1:5050` بسته شده، باید تونل بزنی:

```powershell
ssh -L 5050:localhost:5050 root@194.34.239.118
```

بعد در pgAdmin وصل شو به:

- Host: `localhost`
- Port: `5050`
- User: `root`
- Password: همان مقدار `.env`
- DB: `postgres`

---

## 9) بالا آمدن خودکار بعد از ریستارت سرور

Docker در بوت فعال باشد و کانتینرها policy داشته باشند:

```bash
systemctl enable --now docker

docker update --restart unless-stopped app_container db_postgres_sdo frontend_container

docker inspect -f '{{.Name}} -> {{.HostConfig.RestartPolicy.Name}}' \
  app_container db_postgres_sdo frontend_container
```

---

## 10) دستورهای سریع (Cheat Sheet)

```bash
# شروع/ساخت
cd /root/SDO-backend
docker compose up --build -d

# توقف
docker compose down

# وضعیت
docker compose ps

# لاگ
docker compose logs -f

# آپدیت از گیت
git pull --ff-only origin main_mohammad

docker compose up --build -d
```

</div>
