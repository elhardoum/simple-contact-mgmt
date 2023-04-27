create table if not exists contacts (
  id bigint(20) unsigned not null auto_increment,
  name varchar(100) not null,
  email varchar(100) not null,
  phone varchar(100),
  -- unique per contact --
  unique(email),
  -- searchable fields --
  index idx_contacts_name(name),
  index idx_contacts_email(email),
  index idx_contacts_phone(phone),
  -- primary key --
  primary key (id)
);

-- tests table --
create table contacts__test like contacts; 
