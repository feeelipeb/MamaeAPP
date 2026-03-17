-- 1. Criar tabela de marcos (milestones)
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
    milestone_key TEXT NOT NULL,
    milestone_name TEXT NOT NULL,
    milestone_date DATE NOT NULL,
    is_required BOOLEAN DEFAULT true,
    is_achieved BOOLEAN DEFAULT true,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(child_id, milestone_key)
);

-- 2. Ativar RLS para milestones
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own milestones" 
ON public.milestones FOR ALL 
USING (auth.uid() = user_id);

-- 3. Garantir que a tabela de eventos do calendário existe (utilizada para integração)
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME WITHOUT TIME ZONE,
    end_time TIME WITHOUT TIME ZONE,
    type TEXT DEFAULT 'reminder',
    color TEXT DEFAULT '#D8B4FE',
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Ativar RLS para calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own calendar events" 
ON public.calendar_events FOR ALL 
USING (auth.uid() = user_id);
