-- Add linked_chat_title to selling_bots table
ALTER TABLE selling_bots 
ADD COLUMN IF NOT EXISTS linked_chat_title TEXT;
