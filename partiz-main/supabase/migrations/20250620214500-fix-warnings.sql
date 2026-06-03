
-- Fix any remaining issues after game_modes removal

-- Ensure cards table has proper RLS policies
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for cards table
DROP POLICY IF EXISTS "Public read access for cards" ON public.cards;
DROP POLICY IF EXISTS "Public insert access for cards" ON public.cards;
DROP POLICY IF EXISTS "Public update access for cards" ON public.cards;
DROP POLICY IF EXISTS "Public delete access for cards" ON public.cards;

-- Allow public read access to active cards
CREATE POLICY "Allow public read access to active cards" 
ON public.cards 
FOR SELECT 
USING (is_active = true);

-- Allow public insert access (for admin functions)
CREATE POLICY "Allow public insert access for cards" 
ON public.cards 
FOR INSERT 
WITH CHECK (true);

-- Allow public update access (for admin functions)
CREATE POLICY "Allow public update access for cards" 
ON public.cards 
FOR UPDATE 
USING (true);

-- Allow public delete/soft delete access (for admin functions)
CREATE POLICY "Allow public delete access for cards" 
ON public.cards 
FOR DELETE 
USING (true);

-- Ensure the updated_at trigger is working properly
DROP TRIGGER IF EXISTS update_cards_updated_at ON public.cards;
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON public.cards 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- Clean up any potential orphaned data or constraints
-- Ensure all constraints are properly named and valid
ALTER TABLE public.cards 
  DROP CONSTRAINT IF EXISTS cards_date_mode_check,
  ADD CONSTRAINT cards_date_mode_check 
  CHECK (date_mode IS NULL OR date_mode IN ('no', 'compatible', 'exclusive'));

ALTER TABLE public.cards 
  DROP CONSTRAINT IF EXISTS cards_proximity_level_check,
  ADD CONSTRAINT cards_proximity_level_check 
  CHECK (proximity_level IS NULL OR proximity_level IN ('stranger', 'friend', 'close'));

-- Ensure indexes are optimal
CREATE INDEX IF NOT EXISTS idx_cards_active ON public.cards(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_cards_created_at ON public.cards(created_at);
