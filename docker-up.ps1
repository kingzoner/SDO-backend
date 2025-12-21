param(
    [switch]$Foreground,
    [switch]$PrintOnly
)

$ErrorActionPreference = "Stop"

function Get-ComposeCommand {
    try {
        docker compose version *> $null
        if ($LASTEXITCODE -eq 0) {
            return @("docker", "compose")
        }
    } catch {
    }

    try {
        docker-compose version *> $null
        if ($LASTEXITCODE -eq 0) {
            return @("docker-compose")
        }
    } catch {
    }

    throw "Docker Compose پیدا نشد. Docker Desktop را نصب/اجرا کنید و مطمئن شوید `docker compose` کار می‌کند."
}

function Invoke-Compose {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Args
    )

    $cmd = Get-ComposeCommand
    if ($cmd.Length -eq 1) {
        & $cmd[0] @Args
        return $LASTEXITCODE
    }

    & $cmd[0] $cmd[1] @Args
    return $LASTEXITCODE
}

$urls = @"
Backend:  http://localhost:8000
Docs:     http://localhost:8000/docs
Health:   http://localhost:8000/health
Frontend: http://localhost:8081
"@

if ($PrintOnly) {
    Write-Host $urls
    if ($Foreground) {
        Write-Host "Command: docker compose up --build  (or docker-compose up --build)"
    } else {
        Write-Host "Command: docker compose up --build -d  (or docker-compose up --build -d)"
    }
    Write-Host "Stop:    docker compose down  (or docker-compose down)"
    Write-Host "Logs:    docker compose logs -f  (or docker-compose logs -f)"
    exit 0
}

if ($Foreground) {
    Write-Host $urls
    $code = Invoke-Compose -Args @("up", "--build")
    exit $code
}

$code = Invoke-Compose -Args @("up", "--build", "-d")
if ($code -ne 0) {
    exit $code
}

Write-Host $urls
Write-Host "Stop:    docker compose down  (or docker-compose down)"
Write-Host "Logs:    docker compose logs -f  (or docker-compose logs -f)"
