-- VA Sessions table
create table if not exists va_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  va_name text not null,
  login_count integer default 1,
  last_login timestamptz default now(),
  created_at timestamptz default now()
);

-- Pre-Quote Forms table
create table if not exists pre_quote_forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  va_name text not null,
  quote_date date not null,
  trainer text not null,
  team_leader text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quotes table
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pre_quote_form_id uuid references pre_quote_forms(id) on delete set null,
  quote_type text not null,
  customer_name text not null,
  va_name text not null,
  full_name text not null,
  date_of_birth date,
  gender text,
  marital_status text,
  street text,
  city text,
  state text,
  zip text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- Drivers table
create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  is_primary boolean default false,
  full_name text not null,
  date_of_birth date,
  gender text,
  marital_status text,
  license_number text,
  license_state text,
  license_status text,
  years_driving integer,
  at_fault_accidents integer default 0,
  moving_violations integer default 0,
  sr22_required boolean default false,
  fr44_required boolean default false,
  good_student boolean default false,
  distant_student boolean default false,
  defensive_driving boolean default false,
  created_at timestamptz default now()
);

-- Vehicles table
create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  vehicle_number integer default 1,
  vin text,
  year integer,
  make text,
  model text,
  body_type text,
  primary_use text,
  annual_mileage integer,
  ownership text,
  anti_theft boolean default false,
  garaging_same_as_personal boolean default true,
  garaging_street text,
  garaging_city text,
  garaging_state text,
  garaging_zip text,
  created_at timestamptz default now()
);

-- Auto Coverages table
create table if not exists auto_coverages (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  liability_limit text,
  comp_deductible text,
  collision_deductible text,
  um_pd boolean default false,
  um_pd_limit text,
  uim_stacked boolean default false,
  uim_limit text,
  medical_payments text,
  pip_coverage text,
  rental_reimbursement boolean default false,
  rental_daily_limit text,
  roadside_assistance boolean default false,
  payment_plan text,
  prior_insurance boolean default false,
  prior_carrier text,
  prior_limits text,
  years_with_prior integer,
  lapse_in_coverage boolean default false,
  created_at timestamptz default now()
);

-- Home Properties table
create table if not exists home_properties (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  policy_type text,
  year_built integer,
  square_footage integer,
  stories integer default 1,
  bedrooms integer,
  bathrooms numeric(3,1),
  roof_type text,
  roof_material text,
  roof_age integer,
  roof_update_year integer,
  construction_type text,
  foundation text,
  heating_type text,
  plumbing_update_year integer,
  electrical_update_year integer,
  security_system boolean default false,
  fire_alarm boolean default false,
  smoke_detectors boolean default false,
  sprinkler_system boolean default false,
  deadbolts boolean default false,
  gated_community boolean default false,
  swimming_pool boolean default false,
  pool_fenced boolean default false,
  trampoline boolean default false,
  dog_breed text,
  distance_to_fire_dept text,
  distance_to_fire_hydrant text,
  fire_protection_class text,
  created_at timestamptz default now()
);

-- Home Coverages table
create table if not exists home_coverages (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  dwelling_coverage numeric(12,2),
  other_structures numeric(12,2),
  personal_property numeric(12,2),
  loss_of_use numeric(12,2),
  liability_limit numeric(12,2),
  medical_payments numeric(12,2),
  aop_deductible numeric(12,2),
  wind_hail_deductible text,
  hurricane_deductible text,
  water_backup boolean default false,
  water_backup_limit numeric(12,2),
  earthquake boolean default false,
  flood boolean default false,
  replacement_cost boolean default false,
  scheduled_personal_property boolean default false,
  prior_insurance boolean default false,
  prior_carrier text,
  years_with_prior integer,
  claims_last_5_years integer default 0,
  claim_types text[],
  created_at timestamptz default now()
);

-- Quote Results table
create table if not exists quote_results (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quotes(id) on delete cascade,
  carrier_id text not null,
  carrier_name text not null,
  monthly_premium numeric(12,2),
  semi_annual_premium numeric(12,2),
  annual_premium numeric(12,2),
  is_best_value boolean default false,
  am_best_rating integer,
  coverage_details jsonb,
  discounts_applied text[],
  created_at timestamptz default now()
);

-- Enable RLS
alter table va_sessions enable row level security;
alter table pre_quote_forms enable row level security;
alter table quotes enable row level security;
alter table drivers enable row level security;
alter table vehicles enable row level security;
alter table auto_coverages enable row level security;
alter table home_properties enable row level security;
alter table home_coverages enable row level security;
alter table quote_results enable row level security;
