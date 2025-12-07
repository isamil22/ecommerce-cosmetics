# Test Script: Verify Local Storage (NOT AWS)
# Run this script to verify your project uses local storage

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "LOCAL STORAGE VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check Backend Services Use LocalFileService
Write-Host "TEST 1: Checking Backend Services..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$services = @("ProductService", "CategoryService", "HeroService", "PackService", "CommentService")
$allPassed = $true

foreach ($service in $services) {
    $file = "demo/src/main/java/com/example/demo/service/$service.java"
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "LocalFileService") {
            Write-Host "  ✅ $service uses LocalFileService" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $service does NOT use LocalFileService" -ForegroundColor Red
            $allPassed = $false
        }
        
        if ($content -match "S3Service" -and $content -notmatch "old\.java") {
            Write-Host "  ❌ $service still uses S3Service!" -ForegroundColor Red
            $allPassed = $false
        }
    }
}

Write-Host ""

# Test 2: Check LocalFileService Exists
Write-Host "TEST 2: Checking LocalFileService..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

if (Test-Path "demo/src/main/java/com/example/demo/service/LocalFileService.java") {
    Write-Host "  ✅ LocalFileService.java exists" -ForegroundColor Green
    
    $content = Get-Content "demo/src/main/java/com/example/demo/service/LocalFileService.java" -Raw
    if ($content -match "uploads") {
        Write-Host "  ✅ LocalFileService uses 'uploads' directory" -ForegroundColor Green
    }
    if ($content -match "Files\.copy") {
        Write-Host "  ✅ LocalFileService saves to local filesystem" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ LocalFileService.java NOT FOUND!" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""

# Test 3: Check S3Service is Archived
Write-Host "TEST 3: Checking S3Service Status..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

if (Test-Path "demo/src/main/java/com/example/demo/service/S3Service.old.java") {
    Write-Host "  ✅ S3Service.old.java exists (archived)" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  S3Service.old.java not found (may have been deleted)" -ForegroundColor Yellow
}

if (Test-Path "demo/src/main/java/com/example/demo/service/S3Service.java") {
    Write-Host "  ❌ S3Service.java still exists (should be archived!)" -ForegroundColor Red
    $allPassed = $false
} else {
    Write-Host "  ✅ S3Service.java does not exist (correctly archived)" -ForegroundColor Green
}

if (Test-Path "demo/src/main/java/com/example/demo/config/S3Config.java") {
    Write-Host "  ❌ S3Config.java still exists (should be deleted!)" -ForegroundColor Red
    $allPassed = $false
} else {
    Write-Host "  ✅ S3Config.java does not exist (correctly deleted)" -ForegroundColor Green
}

Write-Host ""

# Test 4: Check Configuration
Write-Host "TEST 4: Checking Configuration..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

if (Test-Path "demo/src/main/resources/application.properties") {
    $config = Get-Content "demo/src/main/resources/application.properties" -Raw
    
    if ($config -match "file\.upload-dir=uploads") {
        Write-Host "  ✅ file.upload-dir=uploads (local storage)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ file.upload-dir not set to 'uploads'" -ForegroundColor Red
        $allPassed = $false
    }
    
    if ($config -match "file\.upload\.base-url") {
        Write-Host "  ✅ file.upload.base-url configured" -ForegroundColor Green
    }
    
    # Check AWS is commented out
    $awsLines = Select-String -Path "demo/src/main/resources/application.properties" -Pattern "^aws\." | Where-Object { $_.Line -notmatch "^#" }
    if ($awsLines) {
        Write-Host "  ❌ AWS configuration is NOT commented out!" -ForegroundColor Red
        $allPassed = $false
    } else {
        Write-Host "  ✅ AWS configuration is commented out (disabled)" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ application.properties NOT FOUND!" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""

# Test 5: Check Maven Dependencies
Write-Host "TEST 5: Checking Maven Dependencies..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

if (Test-Path "demo/pom.xml") {
    $pom = Get-Content "demo/pom.xml" -Raw
    
    # Check if AWS dependency is commented out
    if ($pom -match "<!--.*aws-java-sdk-s3.*-->") {
        Write-Host "  ✅ AWS S3 dependency is commented out" -ForegroundColor Green
    } elseif ($pom -match "<dependency>.*aws-java-sdk-s3") {
        Write-Host "  ❌ AWS S3 dependency is still active!" -ForegroundColor Red
        $allPassed = $false
    } else {
        Write-Host "  ✅ AWS S3 dependency not found (removed)" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ pom.xml NOT FOUND!" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""

# Test 6: Check ImageController
Write-Host "TEST 6: Checking ImageController..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

if (Test-Path "demo/src/main/java/com/example/demo/controller/ImageController.java") {
    $controller = Get-Content "demo/src/main/java/com/example/demo/controller/ImageController.java" -Raw
    
    if ($controller -match "FileSystemResource") {
        Write-Host "  ✅ ImageController uses FileSystemResource (local filesystem)" -ForegroundColor Green
    }
    
    if ($controller -match "uploads") {
        Write-Host "  ✅ ImageController serves from 'uploads' directory" -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ ImageController.java NOT FOUND!" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""

# Test 7: Check Frontend
Write-Host "TEST 7: Checking Frontend..." -ForegroundColor Yellow
Write-Host "----------------------------------------" -ForegroundColor Yellow

$frontendFiles = @(
    "frontend/src/components/ProductCard.jsx",
    "frontend/src/pages/HomePage.jsx"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match "s3\.amazonaws|amazonaws\.com|AWS_|S3_") {
            Write-Host "  ❌ $file contains AWS references!" -ForegroundColor Red
            $allPassed = $false
        } else {
            Write-Host "  ✅ $file has no AWS references" -ForegroundColor Green
        }
    }
}

Write-Host ""

# Final Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host ""
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your project is using LOCAL STORAGE (NOT AWS):" -ForegroundColor Green
    Write-Host "  ✅ Backend services use LocalFileService" -ForegroundColor Green
    Write-Host "  ✅ Images saved to uploads/images/ folders" -ForegroundColor Green
    Write-Host "  ✅ Images served from local filesystem" -ForegroundColor Green
    Write-Host "  ✅ No AWS dependencies active" -ForegroundColor Green
    Write-Host "  ✅ Ready for Hostinger deployment" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ SOME TESTS FAILED!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the errors above and fix them." -ForegroundColor Red
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan

