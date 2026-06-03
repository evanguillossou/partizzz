-- Add is_ref column to cards table for the "T'as la réf" game mode
ALTER TABLE public.cards 
ADD COLUMN is_ref boolean DEFAULT false;