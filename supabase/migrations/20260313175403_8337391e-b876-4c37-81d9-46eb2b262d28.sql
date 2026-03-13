-- Create photos table
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view photos
CREATE POLICY "Anyone can view photos" ON public.photos FOR SELECT USING (true);

-- Anyone can insert photos (anonymous access)
CREATE POLICY "Anyone can insert photos" ON public.photos FOR INSERT WITH CHECK (true);

-- No update or delete policies - photos are permanent

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

-- Anyone can view photos in storage
CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');

-- Anyone can upload photos
CREATE POLICY "Anyone can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');