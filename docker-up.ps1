param(
    [switch]$Foreground,
    [switch]$PrintOnly,
    [switch]$NoOpen,
    [int]$TimeoutSeconds = 90
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

    throw "Docker Compose not found. Install/run Docker Desktop and make sure `docker compose` works."
}

function Invoke-Compose {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$ComposeArgs
    )

    $cmd = Get-ComposeCommand
    if ($cmd.Length -eq 1) {
        & $cmd[0] @ComposeArgs | Out-Host
        return $LASTEXITCODE
    }

    & $cmd[0] $cmd[1] @ComposeArgs | Out-Host
    return $LASTEXITCODE
}

$backendUrl = "http://localhost:8000"
$docsUrl = "http://localhost:8000/docs"
$healthUrl = "http://localhost:8000/health"
$frontendUrl = "http://localhost:8081"

Add-Type -AssemblyName System.Net.Http
$httpClient = New-Object System.Net.Http.HttpClient
$httpClient.Timeout = [TimeSpan]::FromSeconds(5)

$urls = @"
Backend:  $backendUrl
Docs:     $docsUrl
Health:   $healthUrl
Frontend: $frontendUrl
"@

function Test-Url {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url
    )

    try {
        $request = New-Object System.Net.Http.HttpRequestMessage ([System.Net.Http.HttpMethod]::Get), $Url
        $response = $httpClient.SendAsync($request).GetAwaiter().GetResult()
        $status = [int]$response.StatusCode
        $response.Dispose()
        $request.Dispose()
        return ($status -ge 200 -and $status -lt 400)
    } catch {
        return $false
    }
}

function Wait-ForUrl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Url,
        [int]$TimeoutSeconds = 60
    )

    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $deadline) {
        if (Test-Url -Url $Url) {
            return $true
        }
        Start-Sleep -Seconds 1
    }
    return $false
}

function Open-Urls {
    if ($NoOpen) {
        return
    }

    try { Start-Process $frontendUrl } catch { }
    try { Start-Process $docsUrl } catch { }
}

if ($PrintOnly) {
    Write-Host $urls
    if ($Foreground) {
        Write-Host "Command: docker compose up --build  (or docker-compose up --build)"
    } else {
        Write-Host "Command: docker compose up --build -d  (or docker-compose up --build -d)"
    }
    Write-Host "Open:    auto (use -NoOpen to disable)"
    Write-Host "Stop:    docker compose down  (or docker-compose down)"
    Write-Host "Logs:    docker compose logs -f  (or docker-compose logs -f)"
    exit 0
}

if ($Foreground) {
    Write-Host $urls
    Open-Urls
    $code = Invoke-Compose -ComposeArgs @("up", "--build")
    exit $code
}

Write-Host $urls
$code = Invoke-Compose -ComposeArgs @("up", "--build", "-d")
if ($code -ne 0) {
    exit $code
}

Wait-ForUrl -Url $healthUrl -TimeoutSeconds $TimeoutSeconds | Out-Null
Wait-ForUrl -Url $frontendUrl -TimeoutSeconds $TimeoutSeconds | Out-Null
Open-Urls

Write-Host $urls
Write-Host "Stop:    docker compose down  (or docker-compose down)"
Write-Host "Logs:    docker compose logs -f  (or docker-compose logs -f)"
