-- Fix for existing coupons with null timesUsed field
-- This script updates all coupons that have null timesUsed to 0

UPDATE coupons 
SET times_used = 0 
WHERE times_used IS NULL;

-- Verify the fix
SELECT id, code, name, times_used, usage_limit 
FROM coupons 
ORDER BY id;
