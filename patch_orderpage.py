import re

# Read the file
with open(r'C:\Users\Hi\Downloads\Project Cosmetics Ayoub\ecommerce-basic - Copy\frontend\src\pages\OrderPage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find and replace the authentication check
old_pattern = r"""if \(!isAuthenticated\) \{
                                                                toast\.error\('يرجى تسجيل الدخول لحذف العناصر / Veuillez vous connecter pour supprimer des articles'\);
                                                                return;
                                                            \}
                                                            
                                                            if \(window\.confirm"""

new_code = """if (window.confirm"""

# Replace
content = re.sub(old_pattern, new_code, content, flags=re.MULTILINE)

# Add guest cart support after the API call block
# Find the API response.ok block and add else clause for guest
old_api_pattern = r"""(if \(response\.ok\) \{
                                                            // Refresh cart
                                                            const updatedCart = await getCart\(\);
                                                            setCart\(updatedCart\.data\);)
                                                            
                                                            // Reset coupon"""

new_api_code = r"""\1
                                                        } else {
                                                            throw new Error('Failed to remove item');
                                                        }
                                                    } else {
                                                        // Guest user - update localStorage
                                                        const guestCart = JSON.parse(localStorage.getItem('cart')) || { items: [] };
                                                        guestCart.items.splice(index, 1);
                                                        localStorage.setItem('cart', JSON.stringify(guestCart));
                                                        setCart(guestCart);
                                                    }
                                                    
                                                    // Reset coupon"""

content = re.sub(old_api_pattern, new_api_code, content, flags=re.MULTILINE)

# Write back
with open(r'C:\Users\Hi\Downloads\Project Cosmetics Ayoub\ecommerce-basic - Copy\frontend\src\pages\OrderPage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated successfully!")
