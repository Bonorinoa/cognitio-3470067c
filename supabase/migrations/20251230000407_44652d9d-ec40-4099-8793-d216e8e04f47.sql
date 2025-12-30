-- v1.2 Migration Part 1: Add instructor enum value and instructor_id column

-- Step 1: Add 'instructor' value to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'instructor';