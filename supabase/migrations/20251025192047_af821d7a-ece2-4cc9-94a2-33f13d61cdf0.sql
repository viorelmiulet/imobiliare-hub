-- Remove the trigger that automatically creates profiles and roles on signup
-- since we've disabled public signup and only admins can create users

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;