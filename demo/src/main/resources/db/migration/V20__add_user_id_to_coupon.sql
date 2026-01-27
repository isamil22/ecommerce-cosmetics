ALTER TABLE coupons
ADD COLUMN user_id BIGINT;

ALTER TABLE coupons
ADD CONSTRAINT fk_coupon_user
FOREIGN KEY (user_id) REFERENCES users(id);
