
-- Drop the overly permissive policy
DROP POLICY "Authenticated users can manage categories" ON public.categories;

-- Create specific policies for categories
CREATE POLICY "Authenticated users can insert categories"
ON public.categories FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
ON public.categories FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete categories"
ON public.categories FOR DELETE TO authenticated USING (true);
