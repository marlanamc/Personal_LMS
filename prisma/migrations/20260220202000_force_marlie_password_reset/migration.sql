-- Ensure the default admin account is prompted to change password after login.
UPDATE "User"
SET "mustChangePassword" = true
WHERE "username" = 'marlie';
