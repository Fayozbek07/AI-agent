-- Supabase SQL Editor da shu faylni to'liq ishga tushiring.
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table members (
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member')),
  primary key (org_id, user_id)
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  phone text,
  note text,
  created_at timestamptz not null default now(),
  unique (id, org_id)
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  client_id uuid not null,
  starts_at timestamptz not null,
  service text,
  status text not null default 'pending' check (status in ('pending','done','cancelled')),
  created_at timestamptz not null default now(),
  -- mijoz va bron bir tashkilotga tegishli bo'lishini kafolatlaydi
  foreign key (client_id, org_id) references clients(id, org_id) on delete cascade
);

create or replace function is_member(o uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from members where org_id = o and user_id = auth.uid())
$$;

alter table organizations enable row level security;
alter table members enable row level security;
alter table clients enable row level security;
alter table bookings enable row level security;

create policy "org: aʼzolar koʻradi" on organizations for select using (is_member(id));
create policy "members: oʻzini koʻradi" on members for select using (user_id = auth.uid());
create policy "clients: aʼzolar" on clients for all using (is_member(org_id)) with check (is_member(org_id));
create policy "bookings: aʼzolar" on bookings for all using (is_member(org_id)) with check (is_member(org_id));

create or replace function create_organization(org_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if auth.uid() is null then raise exception 'Kirish talab qilinadi'; end if;
  insert into organizations(name) values (org_name) returning id into new_id;
  insert into members(org_id, user_id, role) values (new_id, auth.uid(), 'owner');
  return new_id;
end $$;
