-- Add hide_comment_form column to packs table
-- This allows admins to hide the comment form for specific packs

ALTER TABLE packs ADD COLUMN hide_comment_form BOOLEAN NOT NULL DEFAULT FALSE;

-- Update existing packs to have the comment form visible by default
UPDATE packs SET hide_comment_form = FALSE WHERE hide_comment_form IS NULL;
