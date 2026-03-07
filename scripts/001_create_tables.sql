-- LAVA PL Rater Database Schema
-- ================================

-- VA Sessions table (tracks VA login activity)
CREATE TABLE IF NOT EXISTS va_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  va_name TEXT NOT NULL,
  login_count INTEGER DEFAULT 1,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-Quote Forms table (mandatory before quoting)
CREATE TABLE IF NOT EXISTS pre_quote_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  va_name TEXT NOT NULL,
  quote_date DATE NOT NULL,
  trainer TEXT NOT NULL CHECK (trainer IN ('Nash/Aurelle', 'Kyle/Chanie')),
  team_leader TEXT NOT NULL CHECK (team_leader IN ('RJ', 'Martin', 'Ed', 'Rezyl')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table (main quote records)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pre_quote_form_id UUID NOT NULL REFERENCES pre_quote_forms(id) ON DELETE CASCADE,
  quote_type TEXT NOT NULL CHECK (quote_type IN ('auto', 'homeowners')),
  customer_name TEXT NOT NULL,
  va_name TEXT NOT NULL,
  -- Personal Info
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  marital_status TEXT,
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drivers table (for auto quotes)
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  marital_status TEXT,
  license_number TEXT,
  license_state TEXT,
  license_status TEXT CHECK (license_status IN ('valid', 'suspended', 'revoked', 'permit', 'foreign', '')),
  years_driving INTEGER,
  at_fault_accidents INTEGER DEFAULT 0,
  moving_violations INTEGER DEFAULT 0,
  sr22_required BOOLEAN DEFAULT FALSE,
  fr44_required BOOLEAN DEFAULT FALSE,
  -- Discounts
  good_student BOOLEAN DEFAULT FALSE,
  distant_student BOOLEAN DEFAULT FALSE,
  defensive_driving BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles table (for auto quotes)
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  vehicle_number INTEGER DEFAULT 1,
  vin TEXT,
  year INTEGER,
  make TEXT,
  model TEXT,
  body_type TEXT,
  primary_use TEXT CHECK (primary_use IN ('commute', 'pleasure', 'business', 'rideshare', '')),
  annual_mileage INTEGER,
  ownership TEXT CHECK (ownership IN ('owned', 'financed', 'leased', '')),
  anti_theft BOOLEAN DEFAULT FALSE,
  -- Garaging Address
  garaging_same_as_personal BOOLEAN DEFAULT TRUE,
  garaging_street TEXT,
  garaging_city TEXT,
  garaging_state TEXT,
  garaging_zip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto Coverages table
CREATE TABLE IF NOT EXISTS auto_coverages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  -- Liability
  liability_limit TEXT,
  -- Comprehensive/Collision
  comp_deductible TEXT,
  collision_deductible TEXT,
  -- UM/UIM options
  um_pd BOOLEAN DEFAULT FALSE,
  um_pd_limit TEXT,
  uim_stacked BOOLEAN DEFAULT FALSE,
  uim_limit TEXT,
  -- Medical
  medical_payments TEXT,
  pip_coverage TEXT,
  -- Rental & Roadside
  rental_reimbursement BOOLEAN DEFAULT FALSE,
  rental_daily_limit TEXT,
  roadside_assistance BOOLEAN DEFAULT FALSE,
  -- Payment Plan
  payment_plan TEXT CHECK (payment_plan IN ('paid_in_full', 'monthly', 'quarterly', 'semi_annual', '')),
  -- Prior Insurance
  prior_insurance BOOLEAN DEFAULT FALSE,
  prior_carrier TEXT,
  prior_limits TEXT,
  years_with_prior INTEGER,
  lapse_in_coverage BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home Properties table (for homeowners quotes)
CREATE TABLE IF NOT EXISTS home_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  policy_type TEXT CHECK (policy_type IN ('HO3', 'HO4', 'HO5', 'HO6', 'DP1', 'DP3', '')),
  year_built INTEGER,
  square_footage INTEGER,
  stories INTEGER DEFAULT 1,
  bedrooms INTEGER,
  bathrooms NUMERIC(3,1),
  -- Roof Details
  roof_type TEXT CHECK (roof_type IN ('asphalt', 'tile', 'metal', 'slate', 'wood_shake', 'flat', '')),
  roof_material TEXT,
  roof_age INTEGER,
  roof_update_year INTEGER,
  -- Construction
  construction_type TEXT CHECK (construction_type IN ('frame', 'masonry', 'steel', 'log', 'manufactured', '')),
  foundation TEXT CHECK (foundation IN ('slab', 'basement', 'crawlspace', 'pier', '')),
  -- Heating/Plumbing/Electrical
  heating_type TEXT,
  plumbing_update_year INTEGER,
  electrical_update_year INTEGER,
  -- Safety & Security
  security_system BOOLEAN DEFAULT FALSE,
  fire_alarm BOOLEAN DEFAULT FALSE,
  smoke_detectors BOOLEAN DEFAULT FALSE,
  sprinkler_system BOOLEAN DEFAULT FALSE,
  deadbolts BOOLEAN DEFAULT FALSE,
  gated_community BOOLEAN DEFAULT FALSE,
  -- Hazards
  swimming_pool BOOLEAN DEFAULT FALSE,
  pool_fenced BOOLEAN DEFAULT FALSE,
  trampoline BOOLEAN DEFAULT FALSE,
  dog_breed TEXT,
  -- Fire Protection
  distance_to_fire_dept TEXT,
  distance_to_fire_hydrant TEXT,
  fire_protection_class TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home Coverages table
CREATE TABLE IF NOT EXISTS home_coverages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  -- Coverage A-D
  dwelling_coverage NUMERIC(12,2),
  other_structures NUMERIC(12,2),
  personal_property NUMERIC(12,2),
  loss_of_use NUMERIC(12,2),
  -- Liability & Medical
  liability_limit NUMERIC(12,2),
  medical_payments NUMERIC(12,2),
  -- Deductibles
  aop_deductible NUMERIC(12,2),
  wind_hail_deductible TEXT,
  hurricane_deductible TEXT,
  -- Optional Coverages
  water_backup BOOLEAN DEFAULT FALSE,
  water_backup_limit NUMERIC(12,2),
  earthquake BOOLEAN DEFAULT FALSE,
  flood BOOLEAN DEFAULT FALSE,
  replacement_cost BOOLEAN DEFAULT FALSE,
  scheduled_personal_property BOOLEAN DEFAULT FALSE,
  -- Prior Insurance
  prior_insurance BOOLEAN DEFAULT FALSE,
  prior_carrier TEXT,
  years_with_prior INTEGER,
  claims_last_5_years INTEGER DEFAULT 0,
  claim_types TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Results table (stores calculated quotes from carriers)
CREATE TABLE IF NOT EXISTS quote_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  carrier_id TEXT NOT NULL,
  carrier_name TEXT NOT NULL,
  monthly_premium NUMERIC(12,2),
  semi_annual_premium NUMERIC(12,2),
  annual_premium NUMERIC(12,2),
  is_best_value BOOLEAN DEFAULT FALSE,
  am_best_rating INTEGER,
  coverage_details JSONB,
  discounts_applied TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE va_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pre_quote_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_coverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_coverages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for va_sessions
CREATE POLICY "va_sessions_select_own" ON va_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "va_sessions_insert_own" ON va_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "va_sessions_update_own" ON va_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "va_sessions_delete_own" ON va_sessions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for pre_quote_forms
CREATE POLICY "pre_quote_forms_select_own" ON pre_quote_forms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pre_quote_forms_insert_own" ON pre_quote_forms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pre_quote_forms_update_own" ON pre_quote_forms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "pre_quote_forms_delete_own" ON pre_quote_forms FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for quotes
CREATE POLICY "quotes_select_own" ON quotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quotes_insert_own" ON quotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quotes_update_own" ON quotes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quotes_delete_own" ON quotes FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for drivers (through quote ownership)
CREATE POLICY "drivers_select_own" ON drivers FOR SELECT 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = drivers.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "drivers_insert_own" ON drivers FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = drivers.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "drivers_update_own" ON drivers FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = drivers.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "drivers_delete_own" ON drivers FOR DELETE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = drivers.quote_id AND quotes.user_id = auth.uid()));

-- RLS Policies for vehicles (through quote ownership)
CREATE POLICY "vehicles_select_own" ON vehicles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = vehicles.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "vehicles_insert_own" ON vehicles FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = vehicles.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "vehicles_update_own" ON vehicles FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = vehicles.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "vehicles_delete_own" ON vehicles FOR DELETE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = vehicles.quote_id AND quotes.user_id = auth.uid()));

-- RLS Policies for auto_coverages (through quote ownership)
CREATE POLICY "auto_coverages_select_own" ON auto_coverages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = auto_coverages.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "auto_coverages_insert_own" ON auto_coverages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = auto_coverages.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "auto_coverages_update_own" ON auto_coverages FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = auto_coverages.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "auto_coverages_delete_own" ON auto_coverages FOR DELETE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = auto_coverages.quote_id AND quotes.user_id = auth.uid()));

-- RLS Policies for home_properties (through quote ownership)
CREATE POLICY "home_properties_select_own" ON home_properties FOR SELECT 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_properties.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "home_properties_insert_own" ON home_properties FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_properties.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "home_properties_update_own" ON home_properties FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_properties.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "home_properties_delete_own" ON home_properties FOR DELETE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_properties.quote_id AND quotes.user_id = auth.uid()));

-- RLS Policies for home_coverages (through quote ownership)
CREATE POLICY "home_coverages_select_own" ON home_coverages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_coverages.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "home_coverages_insert_own" ON home_coverages FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_coverages.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "home_coverages_update_own" ON home_coverages FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_coverages.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "home_coverages_delete_own" ON home_coverages FOR DELETE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = home_coverages.quote_id AND quotes.user_id = auth.uid()));

-- RLS Policies for quote_results (through quote ownership)
CREATE POLICY "quote_results_select_own" ON quote_results FOR SELECT 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_results.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "quote_results_insert_own" ON quote_results FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_results.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "quote_results_update_own" ON quote_results FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_results.quote_id AND quotes.user_id = auth.uid()));
CREATE POLICY "quote_results_delete_own" ON quote_results FOR DELETE 
  USING (EXISTS (SELECT 1 FROM quotes WHERE quotes.id = quote_results.quote_id AND quotes.user_id = auth.uid()));

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_va_sessions_user_id ON va_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pre_quote_forms_user_id ON pre_quote_forms(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_pre_quote_form_id ON quotes(pre_quote_form_id);
CREATE INDEX IF NOT EXISTS idx_drivers_quote_id ON drivers(quote_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_quote_id ON vehicles(quote_id);
CREATE INDEX IF NOT EXISTS idx_auto_coverages_quote_id ON auto_coverages(quote_id);
CREATE INDEX IF NOT EXISTS idx_home_properties_quote_id ON home_properties(quote_id);
CREATE INDEX IF NOT EXISTS idx_home_coverages_quote_id ON home_coverages(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_results_quote_id ON quote_results(quote_id);
