ALTER TABLE users ADD COLUMN city VARCHAR(100) DEFAULT 'Chennai';
CREATE INDEX idx_users_city ON users(city);
