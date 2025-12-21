Prisma Studio (browse DB)
-------------------------
1) اطمینان بده کانتینرهای `docker-compose` بالا هستند (Postgres روی پورت 5050 روی میزبان مپ شده است).
2) یک کپی از `.env.prisma.example` بساز:
   ```
   cp prisma/.env.prisma.example prisma/.env.prisma
   ```
   اگر یوزر/پسورد/پورت عوض شده، مقدار `DATABASE_URL` را در `.env.prisma` به‌روزرسانی کن.
3) از ریشه پروژه این دستورها را اجرا کن تا شِما را از دیتابیس بکشی و Prisma Studio را باز کنی:
   ```
   npx prisma db pull --schema prisma/schema.prisma --dotenv prisma/.env.prisma
   npx prisma studio --schema prisma/schema.prisma --dotenv prisma/.env.prisma
   ```
   (نیازی به نصب دائمی نیست؛ `npx` خودش Prisma را دانلود می‌کند.)

نکته: اگر خارج از Docker DB را اجرا می‌کنی و پورت دیگری داری، همان پورت/هاست را در `DATABASE_URL` بگذار. مسیر schema ثابت است: `prisma/schema.prisma`.
