param(
  [string]$VersionName = "1.0",
  [int]$VersionCode = 1
)

$ErrorActionPreference = "Stop"

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$AndroidProject = Join-Path $Root "android-webview"
$AppMain = Join-Path $AndroidProject "app\src\main"
$BuildDir = Join-Path $AndroidProject "build"
$AssetsWww = Join-Path $AppMain "assets\www"

function Assert-UnderRoot {
  param(
    [string]$Path,
    [string]$RootPath
  )

  $rootFull = [System.IO.Path]::GetFullPath($RootPath).TrimEnd("\")
  $pathFull = [System.IO.Path]::GetFullPath($Path)
  $underRoot = $pathFull.Equals($rootFull, [System.StringComparison]::OrdinalIgnoreCase) -or
    $pathFull.StartsWith($rootFull + "\", [System.StringComparison]::OrdinalIgnoreCase)

  if (-not $underRoot) {
    throw "Refusing to modify path outside project root: $pathFull"
  }
}

function Reset-Directory {
  param([string]$Path)

  Assert-UnderRoot -Path $Path -RootPath $Root
  if (Test-Path $Path) {
    Remove-Item -LiteralPath $Path -Recurse -Force
  }
  New-Item -ItemType Directory -Force -Path $Path | Out-Null
}

function Find-JavaTool {
  param([string]$ToolName)

  $command = Get-Command $ToolName -ErrorAction SilentlyContinue
  if ($command) {
    return $command.Source
  }

  $candidates = @()
  if ($env:JAVA_HOME) {
    $candidates += Join-Path $env:JAVA_HOME "bin\$ToolName"
  }
  
  # Integrate Unity's self-contained certified OpenJDK
  $candidates += "d:\Program Files\Unity\2022.3.62f3\Editor\Data\PlaybackEngines\AndroidPlayer\OpenJDK\bin\$ToolName"
  
  $candidates += Get-ChildItem "C:\Program Files\Java" -Recurse -Filter $ToolName -ErrorAction SilentlyContinue |
    ForEach-Object { $_.FullName }
  $candidates += Get-ChildItem "C:\Program Files\Android\Android Studio\jbr\bin" -Filter $ToolName -ErrorAction SilentlyContinue |
    ForEach-Object { $_.FullName }

  $found = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
  if (-not $found) {
    throw "$ToolName was not found. Install a JDK or set JAVA_HOME."
  }

  return $found
}

function Convert-ToAndroidToolPath {
  param([string]$Path)
  return [System.IO.Path]::GetFullPath($Path).Replace("\", "/")
}

# Resolve Android SDK Root
$SdkRoot = $env:ANDROID_HOME
if (-not $SdkRoot) {
  $SdkRoot = $env:ANDROID_SDK_ROOT
}
# Fallback to Unity's self-contained SDK
if (-not $SdkRoot -or -not (Test-Path $SdkRoot)) {
  $SdkRoot = "d:\Program Files\Unity\2022.3.62f3\Editor\Data\PlaybackEngines\AndroidPlayer\SDK"
}
if (-not $SdkRoot -or -not (Test-Path $SdkRoot)) {
  $SdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk"
}
if (-not (Test-Path $SdkRoot)) {
  throw "Android SDK not found. Set ANDROID_HOME or install Android Studio SDK."
}

Write-Host "Using Android SDK: $SdkRoot" -ForegroundColor Cyan

$platform = Get-ChildItem (Join-Path $SdkRoot "platforms") -Directory |
  Where-Object { Test-Path (Join-Path $_.FullName "android.jar") } |
  Sort-Object { [version](($_.Name -replace "^android-", "") + ".0") } -Descending |
  Select-Object -First 1
if (-not $platform) {
  throw "No Android platform with android.jar was found in $SdkRoot\platforms."
}

$buildTools = Get-ChildItem (Join-Path $SdkRoot "build-tools") -Directory |
  Where-Object {
    (Test-Path (Join-Path $_.FullName "aapt2.exe")) -and
    (Test-Path (Join-Path $_.FullName "d8.bat")) -and
    (Test-Path (Join-Path $_.FullName "apksigner.bat")) -and
    (Test-Path (Join-Path $_.FullName "zipalign.exe"))
  } |
  Sort-Object { [version]$_.Name } -Descending |
  Select-Object -First 1
if (-not $buildTools) {
  throw "No complete Android build-tools folder was found in $SdkRoot\build-tools."
}

Write-Host "Using Android Platform: $($platform.Name)" -ForegroundColor Cyan
Write-Host "Using Android Build Tools: $($buildTools.Name)" -ForegroundColor Cyan

$androidJar = Join-Path $platform.FullName "android.jar"
$aapt2 = Join-Path $buildTools.FullName "aapt2.exe"
$d8 = Join-Path $buildTools.FullName "d8.bat"
$apksigner = Join-Path $buildTools.FullName "apksigner.bat"
$zipalign = Join-Path $buildTools.FullName "zipalign.exe"
$targetSdk = [int]([regex]::Match($platform.Name, "\d+").Value)

$javac = Find-JavaTool -ToolName "javac.exe"
$jar = Find-JavaTool -ToolName "jar.exe"
$keytool = Find-JavaTool -ToolName "keytool.exe"

# Automatically resolve and inject process-level JAVA_HOME and PATH for Android tools (d8, apksigner)
$javaBin = Split-Path $javac -Parent
$javaHome = Split-Path $javaBin -Parent
$env:JAVA_HOME = $javaHome
$env:PATH = "$javaBin;" + $env:PATH

Write-Host "Set process-level JAVA_HOME to: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "Added Java bin to process-level PATH: $javaBin" -ForegroundColor Cyan

Reset-Directory -Path $BuildDir
Reset-Directory -Path $AssetsWww

# Copy our Flat Web App Files to the native www assets folder
Copy-Item -LiteralPath (Join-Path $Root "index.html") -Destination $AssetsWww -Force
Copy-Item -LiteralPath (Join-Path $Root "style.css") -Destination $AssetsWww -Force
Copy-Item -LiteralPath (Join-Path $Root "app.js") -Destination $AssetsWww -Force

$generatedDir = Join-Path $BuildDir "generated"
$classesDir = Join-Path $BuildDir "classes"
$dexDir = Join-Path $BuildDir "dex"
$distDir = Join-Path $BuildDir "outputs"
New-Item -ItemType Directory -Force -Path $generatedDir, $classesDir, $dexDir, $distDir | Out-Null

$localAndroidJar = Join-Path $BuildDir "android.jar"
Copy-Item -LiteralPath $androidJar -Destination $localAndroidJar -Force

$compiledRes = Join-Path $BuildDir "compiled-res.zip"
$unsignedApk = Join-Path $BuildDir "game-unsigned.apk"
$unalignedApk = Join-Path $BuildDir "game-unaligned.apk"
$alignedApk = Join-Path $BuildDir "game-aligned.apk"
$debugApk = Join-Path $distDir "MasaClock-debug.apk"
$manifest = Join-Path $AppMain "AndroidManifest.xml"
$resDir = Join-Path $AppMain "res"

Write-Host "Compiling Android resources..." -ForegroundColor Yellow
& $aapt2 compile --dir (Convert-ToAndroidToolPath $resDir) -o (Convert-ToAndroidToolPath $compiledRes)
if ($LASTEXITCODE -ne 0) { throw "aapt2 compile failed." }

Write-Host "Linking Android resources..." -ForegroundColor Yellow
& $aapt2 link `
  -o (Convert-ToAndroidToolPath $unsignedApk) `
  -I (Convert-ToAndroidToolPath $localAndroidJar) `
  --manifest (Convert-ToAndroidToolPath $manifest) `
  -R (Convert-ToAndroidToolPath $compiledRes) `
  --java (Convert-ToAndroidToolPath $generatedDir) `
  --min-sdk-version 23 `
  --target-sdk-version $targetSdk `
  --version-code $VersionCode `
  --version-name $VersionName `
  --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "aapt2 link failed." }

$javaSources = @(
  Get-ChildItem (Join-Path $AppMain "java") -Recurse -Filter "*.java"
  Get-ChildItem $generatedDir -Recurse -Filter "*.java"
) | ForEach-Object { $_.FullName }

Write-Host "Compiling Java source files..." -ForegroundColor Yellow
& $javac -encoding UTF-8 -Xlint:-options -source 11 -target 11 -classpath $localAndroidJar -d $classesDir $javaSources
if ($LASTEXITCODE -ne 0) { throw "javac failed." }

$classListFile = Join-Path $BuildDir "classes.txt"
Get-ChildItem $classesDir -Recurse -Filter "*.class" | ForEach-Object { $_.FullName } | Set-Content -Encoding ASCII $classListFile

Write-Host "Translating Java classes to Dalvik executable (.dex)..." -ForegroundColor Yellow
& $d8 --min-api 23 --lib $localAndroidJar --output $dexDir "@$classListFile"
if ($LASTEXITCODE -ne 0) { throw "d8 failed." }

Copy-Item -LiteralPath $unsignedApk -Destination $unalignedApk -Force

Write-Host "Bundling dex classes..." -ForegroundColor Yellow
& $jar uf $unalignedApk -C $dexDir classes.dex
if ($LASTEXITCODE -ne 0) { throw "Could not add classes.dex to APK." }

$zipAssetsRoot = Join-Path $BuildDir "zip-assets"
$zipAssetsAssets = Join-Path $zipAssetsRoot "assets"
New-Item -ItemType Directory -Force -Path $zipAssetsAssets | Out-Null
Copy-Item -LiteralPath $AssetsWww -Destination $zipAssetsAssets -Recurse -Force

Write-Host "Bundling web assets..." -ForegroundColor Yellow
& $jar uf $unalignedApk -C $zipAssetsRoot assets
if ($LASTEXITCODE -ne 0) { throw "Could not add web assets to APK." }

Write-Host "Running zipalign..." -ForegroundColor Yellow
& $zipalign -f -p 4 $unalignedApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "zipalign failed." }

$keystore = Join-Path $AndroidProject "debug.keystore"
if (-not (Test-Path $keystore)) {
  Write-Host "Generating debug keystore..." -ForegroundColor Yellow
  & $keytool -genkeypair `
    -v `
    -keystore $keystore `
    -storepass android `
    -alias androiddebugkey `
    -keypass android `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -dname "CN=Android Debug,O=Azrin Belajar Masa,C=MY"
  if ($LASTEXITCODE -ne 0) { throw "Debug keystore creation failed." }
}

Write-Host "Signing Android APK package..." -ForegroundColor Yellow
& $apksigner sign `
  --ks $keystore `
  --ks-pass pass:android `
  --key-pass pass:android `
  --out $debugApk `
  $alignedApk
if ($LASTEXITCODE -ne 0) { throw "APK signing failed." }

Write-Host "Verifying APK signature..." -ForegroundColor Yellow
& $apksigner verify --verbose $debugApk
if ($LASTEXITCODE -ne 0) { throw "APK verification failed." }

Write-Host ""
Write-Host "APK SUCCESS!" -ForegroundColor Green
Write-Host "Android package successfully created at:" -ForegroundColor Green
Write-Host $debugApk -ForegroundColor White
