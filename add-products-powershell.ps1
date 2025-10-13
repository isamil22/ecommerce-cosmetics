# PowerShell script to add 4 test products directly to the database
# This script will add products using direct database connection

$connectionString = "Server=localhost;Database=sms;Uid=user;Pwd=password;"

# Test products data
$testProducts = @(
    @{
        name = "Premium Wireless Headphones"
        description = "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals."
        price = 199.99
        quantity = 50
        brand = "TechSound"
        bestseller = $true
        newArrival = $false
        hasVariants = $false
        isPackable = $true
        type = "BOTH"
        images = @("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500")
    },
    @{
        name = "Classic Denim Jacket"
        description = "Timeless denim jacket made from premium cotton denim. Available in multiple washes and sizes. Perfect for casual wear."
        price = 89.99
        quantity = 75
        brand = "DenimCo"
        bestseller = $false
        newArrival = $true
        hasVariants = $true
        isPackable = $false
        type = "BOTH"
        images = @("https://images.unsplash.com/photo-1544966503-7cc6d8a4a6d7?w=500")
    },
    @{
        name = "Smart Fitness Watch"
        description = "Advanced fitness tracking watch with heart rate monitor, GPS, and water resistance. Tracks your workouts and health metrics."
        price = 299.99
        quantity = 30
        brand = "FitTech"
        bestseller = $true
        newArrival = $false
        hasVariants = $false
        isPackable = $true
        type = "BOTH"
        images = @("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500")
    },
    @{
        name = "Organic Cotton T-Shirt"
        description = "Soft and comfortable organic cotton t-shirt. Eco-friendly and ethically made. Available in various colors and sizes."
        price = 24.99
        quantity = 100
        brand = "EcoWear"
        bestseller = $false
        newArrival = $true
        hasVariants = $true
        isPackable = $true
        type = "BOTH"
        images = @("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500")
    }
)

try {
    Write-Host "🚀 Starting to add 4 test products to database..." -ForegroundColor Green
    Write-Host ""
    
    # Load MySQL connector
    Add-Type -Path "C:\Program Files (x86)\MySQL\MySQL Connector Net 8.0.33\Assemblies\v4.5.2\MySql.Data.dll"
    
    # Create connection
    $connection = New-Object MySql.Data.MySqlClient.MySqlConnection($connectionString)
    $connection.Open()
    
    Write-Host "✅ Connected to database successfully!" -ForegroundColor Green
    
    # First, ensure we have a category
    Write-Host "📂 Setting up category..." -ForegroundColor Yellow
    $categoryQuery = "SELECT id FROM categories LIMIT 1"
    $categoryCommand = New-Object MySql.Data.MySqlClient.MySqlCommand($categoryQuery, $connection)
    $categoryReader = $categoryCommand.ExecuteReader()
    
    $categoryId = $null
    if ($categoryReader.Read()) {
        $categoryId = $categoryReader["id"]
        Write-Host "✅ Using existing category with ID: $categoryId" -ForegroundColor Green
    }
    $categoryReader.Close()
    
    if (-not $categoryId) {
        Write-Host "Creating default category..." -ForegroundColor Yellow
        $insertCategoryQuery = "INSERT INTO categories (name, description, image_url) VALUES ('Electronics', 'Default category for test products', '')"
        $insertCategoryCommand = New-Object MySql.Data.MySqlClient.MySqlCommand($insertCategoryQuery, $connection)
        $insertCategoryCommand.ExecuteNonQuery()
        $categoryId = $insertCategoryCommand.LastInsertedId
        Write-Host "✅ Created new category with ID: $categoryId" -ForegroundColor Green
    }
    
    # Add each test product
    Write-Host ""
    Write-Host "📦 Adding test products..." -ForegroundColor Yellow
    $successCount = 0
    
    foreach ($i in 0..($testProducts.Count - 1)) {
        $product = $testProducts[$i]
        $productNumber = $i + 1
        
        Write-Host ""
        Write-Host "$productNumber. Adding: $($product.name)" -ForegroundColor Cyan
        
        try {
            # Insert product
            $insertQuery = @"
INSERT INTO product (
    name, description, price, quantity, brand, 
    bestseller, new_arrival, has_variants, is_packable, 
    type, category_id
) VALUES (
    '$($product.name)', '$($product.description)', $($product.price), $($product.quantity), '$($product.brand)',
    $($product.bestseller.ToString().ToLower()), $($product.newArrival.ToString().ToLower()), $($product.hasVariants.ToString().ToLower()), $($product.isPackable.ToString().ToLower()),
    '$($product.type)', $categoryId
)
"@
            
            $insertCommand = New-Object MySql.Data.MySqlClient.MySqlCommand($insertQuery, $connection)
            $insertCommand.ExecuteNonQuery()
            $productId = $insertCommand.LastInsertedId
            
            Write-Host "   ✅ Product added successfully with ID: $productId" -ForegroundColor Green
            Write-Host "   💰 Price: `$$($product.price) | Brand: $($product.brand)" -ForegroundColor Gray
            
            # Insert images
            if ($product.images.Count -gt 0) {
                foreach ($imageUrl in $product.images) {
                    $imageQuery = "INSERT INTO product_images (product_id, images) VALUES ($productId, '$imageUrl')"
                    $imageCommand = New-Object MySql.Data.MySqlClient.MySqlCommand($imageQuery, $connection)
                    $imageCommand.ExecuteNonQuery()
                }
                Write-Host "   🖼️  Images added" -ForegroundColor Gray
            }
            
            $successCount++
        }
        catch {
            Write-Host "   ❌ Error adding product: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "🎉 Product addition completed!" -ForegroundColor Green
    Write-Host "📊 Results: $successCount/$($testProducts.Count) products added successfully" -ForegroundColor Yellow
    
    # Verify products
    Write-Host ""
    Write-Host "🔍 Verifying products..." -ForegroundColor Yellow
    $verifyQuery = "SELECT COUNT(*) as total FROM product"
    $verifyCommand = New-Object MySql.Data.MySqlClient.MySqlCommand($verifyQuery, $connection)
    $totalProducts = $verifyCommand.ExecuteScalar()
    Write-Host "✅ Total products in database: $totalProducts" -ForegroundColor Green
    
    # Show our test products
    $testNames = ($testProducts | ForEach-Object { $_.name }) -join "','"
    $showQuery = "SELECT id, name, price, brand FROM product WHERE name IN ('$testNames') ORDER BY id DESC"
    $showCommand = New-Object MySql.Data.MySqlClient.MySqlCommand($showQuery, $connection)
    $showReader = $showCommand.ExecuteReader()
    
    Write-Host ""
    Write-Host "📋 Test products found in database:" -ForegroundColor Yellow
    $index = 1
    while ($showReader.Read()) {
        Write-Host "   $index. $($showReader['name']) - `$$($showReader['price']) ($($showReader['brand']))" -ForegroundColor Gray
        $index++
    }
    $showReader.Close()
    
}
catch {
    Write-Host "💥 Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*Could not load file or assembly*") {
        Write-Host ""
        Write-Host "❌ MySQL connector not found. Please install MySQL Connector/NET" -ForegroundColor Red
        Write-Host "Download from: https://dev.mysql.com/downloads/connector/net/" -ForegroundColor Yellow
    }
}
finally {
    if ($connection -and $connection.State -eq "Open") {
        $connection.Close()
        Write-Host ""
        Write-Host "🔌 Database connection closed." -ForegroundColor Gray
    }
}
