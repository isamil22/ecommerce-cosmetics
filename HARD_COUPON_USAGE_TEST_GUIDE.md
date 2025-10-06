# 🎯 Hard Coupon Usage Test Guide

## Overview
This guide provides comprehensive testing tools to verify that coupon usage counts increase properly when coupons are applied during checkout.

## 🛠️ Testing Tools Available

### 1. **Comprehensive Coupon Usage Test** (`comprehensive-coupon-usage-test.html`)
- **Purpose**: Simulates multiple coupon applications
- **Features**: 
  - Real-time statistics tracking
  - Progress indicators
  - Multiple test scenarios (1, 3, 5, 10 applications)
  - Detailed logging and results

### 2. **Real Order Coupon Test** (`real-order-coupon-test.html`)
- **Purpose**: Creates actual orders with coupons
- **Features**:
  - Complete order creation flow
  - Real user authentication
  - Actual database updates
  - Step-by-step verification

### 3. **Backend Test Script** (`test-coupon-usage-backend.js`)
- **Purpose**: Direct backend API testing
- **Features**:
  - Node.js script for server-side testing
  - Direct API calls without frontend
  - Automated test execution
  - Detailed logging

## 🚀 How to Run the Tests

### Method 1: Frontend Testing (Recommended)

#### Step 1: Start Your Backend
```bash
cd demo
./mvnw spring-boot:run
```

#### Step 2: Open Test Files
1. Open `comprehensive-coupon-usage-test.html` in your browser
2. Or open `real-order-coupon-test.html` for real order testing

#### Step 3: Configure Test
- Enter admin credentials
- Set test coupon code
- Choose number of test applications
- Click "Start Hard Test"

#### Step 4: Monitor Results
- Watch real-time statistics
- Check test progress
- Review detailed logs
- Verify final results

### Method 2: Backend Testing

#### Step 1: Install Dependencies
```bash
npm install axios
```

#### Step 2: Run Backend Test
```bash
node test-coupon-usage-backend.js
```

#### Step 3: Check Results
- Review console output
- Verify usage count increases
- Check database directly

## 📊 What the Tests Verify

### ✅ **Core Functionality**
- Coupon validation works correctly
- Usage count increments properly
- No null pointer exceptions
- Database updates are saved

### ✅ **Analytics Dashboard**
- Total usage count updates
- Individual coupon analytics work
- Real-time data refresh
- Correct calculations

### ✅ **Edge Cases**
- Multiple rapid applications
- Null timesUsed field handling
- Usage limit validation
- Error handling

## 🔍 Test Scenarios

### Scenario 1: Single Application
- Apply coupon once
- Verify usage count increases by 1
- Check analytics dashboard

### Scenario 2: Multiple Applications
- Apply same coupon multiple times
- Verify cumulative usage count
- Test with different users

### Scenario 3: Rapid Applications
- Apply coupon multiple times quickly
- Verify all applications are counted
- Check for race conditions

### Scenario 4: Error Handling
- Test with invalid coupon codes
- Test with expired coupons
- Test with usage limit exceeded

## 📈 Expected Results

### ✅ **Success Indicators**
- Usage count increases by exact number of applications
- Analytics dashboard shows updated numbers
- No errors in console or logs
- Database reflects correct values

### ❌ **Failure Indicators**
- Usage count doesn't increase
- Null pointer exceptions
- Database inconsistencies
- Analytics showing wrong numbers

## 🐛 Troubleshooting

### Common Issues

#### 1. **Usage Count Not Increasing**
- **Check**: Backend logs for errors
- **Verify**: Order creation includes coupon code
- **Fix**: Ensure OrderService is properly saving coupon

#### 2. **Null Pointer Exceptions**
- **Check**: Database for null timesUsed values
- **Fix**: Run the database migration script
- **Verify**: Backend code handles null values

#### 3. **Analytics Not Updating**
- **Check**: Frontend refresh functionality
- **Verify**: API calls are successful
- **Fix**: Clear browser cache and refresh

#### 4. **Test Failures**
- **Check**: Backend is running on correct port
- **Verify**: Database connection is working
- **Fix**: Restart backend application

## 🔧 Database Verification

### Check Coupon Usage Directly
```sql
-- Check specific coupon usage
SELECT id, code, name, times_used, usage_limit 
FROM coupons 
WHERE code = 'YOUR_TEST_COUPON_CODE';

-- Check all coupons with usage
SELECT id, code, name, times_used, usage_limit 
FROM coupons 
WHERE times_used > 0 
ORDER BY times_used DESC;

-- Check for null times_used values
SELECT id, code, name, times_used 
FROM coupons 
WHERE times_used IS NULL;
```

### Fix Null Values
```sql
-- Update null times_used to 0
UPDATE coupons 
SET times_used = 0 
WHERE times_used IS NULL;
```

## 📋 Test Checklist

### Before Testing
- [ ] Backend is running on localhost:8082
- [ ] Database is accessible
- [ ] Admin user exists
- [ ] Test products are available

### During Testing
- [ ] Monitor console logs
- [ ] Check real-time statistics
- [ ] Verify each step completes
- [ ] Watch for error messages

### After Testing
- [ ] Verify usage count increased
- [ ] Check analytics dashboard
- [ ] Review test results
- [ ] Clean up test data if needed

## 🎯 Success Criteria

The test is considered **PASSED** if:
1. ✅ Usage count increases by exact number of applications
2. ✅ Analytics dashboard shows correct numbers
3. ✅ No errors or exceptions occur
4. ✅ Database values are consistent
5. ✅ Real-time updates work properly

## 📞 Support

If tests fail:
1. **Check Backend Logs**: Look for error messages
2. **Verify Database**: Check for data inconsistencies
3. **Test API Directly**: Use Postman or curl
4. **Review Code**: Check OrderService implementation
5. **Restart Services**: Try restarting backend

## 🎉 Conclusion

These comprehensive tests will verify that your coupon usage tracking system is working correctly. The tests cover all aspects from basic functionality to edge cases, ensuring robust and reliable coupon analytics.

Run the tests regularly to ensure the system continues to work properly as you make changes to the codebase.
