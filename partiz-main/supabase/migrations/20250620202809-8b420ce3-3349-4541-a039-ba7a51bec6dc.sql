
-- Create game_modes table
CREATE TABLE public.game_modes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  emoji TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cards table
CREATE TABLE public.cards (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  mode_id TEXT NOT NULL REFERENCES public.game_modes(id),
  alcohol_level INTEGER DEFAULT 0,
  sexual_level INTEGER DEFAULT 0,
  is_deep BOOLEAN DEFAULT false,
  is_vote BOOLEAN DEFAULT false,
  proximity_level TEXT CHECK (proximity_level IN ('stranger', 'friend', 'close')),
  date_mode TEXT CHECK (date_mode IN ('no', 'compatible', 'exclusive')),
  explicitly_sexual BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert game modes
INSERT INTO public.game_modes (id, name, description, emoji, color) VALUES
('happiz-hour', 'Happiz Hour', 'Une petite pinte après le travail : tu es détendu et tu comptes te rappeler de ta soirée.', '🍻', 'from-orange-400 to-yellow-500'),
('orgizzz', 'Orgizzz', 'Bande de pervers, c''est vraiment ce que vous voulez ?', '🔥', 'from-red-500 to-pink-600'),
('vie-dartizste', 'Vie d''artizste', 'Ayons des deep conversations pour voir qui tu es vraiment. Plutôt bohémien ou poète torturé ?', '🎨', 'from-purple-500 to-indigo-600'),
('psykoz', 'Psykoz', 'J''espère que tu as les nerfs solides. Après ça plus aucun secret.', '🧠', 'from-green-500 to-teal-600');

-- Enable Row Level Security
ALTER TABLE public.game_modes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a game app)
CREATE POLICY "Public read access for game_modes" ON public.game_modes FOR SELECT USING (true);
CREATE POLICY "Public read access for cards" ON public.cards FOR SELECT USING (is_active = true);

-- Create policies for admin access (you'll need to implement auth later if you want to restrict admin actions)
CREATE POLICY "Public insert access for cards" ON public.cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for cards" ON public.cards FOR UPDATE USING (true);
CREATE POLICY "Public delete access for cards" ON public.cards FOR DELETE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cards_updated_at 
    BEFORE UPDATE ON public.cards 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();
