-- Add is_premium boolean field to cards table
ALTER TABLE public.cards 
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;

-- Add an index for better performance when filtering premium cards
CREATE INDEX idx_cards_is_premium ON public.cards(is_premium);