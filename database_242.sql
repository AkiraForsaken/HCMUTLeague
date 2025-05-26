
DROP TABLE IF EXISTS spectator CASCADE;
DROP TABLE IF EXISTS view_match CASCADE;
DROP TABLE IF EXISTS personal_doctor CASCADE;
DROP TABLE IF EXISTS coach CASCADE;
DROP TABLE IF EXISTS club_doctor CASCADE;
DROP TABLE IF EXISTS player_performance_per_match CASCADE;
DROP TABLE IF EXISTS player CASCADE;
DROP TABLE IF EXISTS team CASCADE;
DROP TABLE IF EXISTS match_of_entering_team CASCADE;
DROP TABLE IF EXISTS competitor_member_contact CASCADE;
DROP TABLE IF EXISTS committee_member_contact CASCADE;
DROP TABLE IF EXISTS competitor_entrance_permission CASCADE;
DROP TABLE IF EXISTS card CASCADE;
DROP TABLE IF EXISTS linesman_referee CASCADE;
DROP TABLE IF EXISTS video_assistant_referee CASCADE;
DROP TABLE IF EXISTS match_manager CASCADE;
DROP TABLE IF EXISTS main_referee CASCADE;
DROP TABLE IF EXISTS match_table CASCADE;
DROP TABLE IF EXISTS stadium CASCADE;
DROP TABLE IF EXISTS sponsor CASCADE;
DROP TABLE IF EXISTS committee_member_entrance CASCADE;
---------------------------------------------------------------------------------
DROP TABLE IF EXISTS competitor_member CASCADE;
CREATE TABLE competitor_member (
    com_id VARCHAR(20) PRIMARY KEY 
);
CREATE OR REPLACE FUNCTION insert_into_competitor_member() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO competitor_member (com_id)
    VALUES (NEW.com_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------------------------
DROP TABLE IF EXISTS committee_member CASCADE;
CREATE TABLE committee_member (
    com_mem_id VARCHAR(20) PRIMARY KEY 
);
CREATE OR REPLACE FUNCTION insert_into_committee_member() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO committee_member (com_mem_id)
    VALUES (NEW.com_mem_id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------
DROP SEQUENCE IF EXISTS com_seq CASCADE;
DROP SEQUENCE IF EXISTS commem_seq CASCADE;
DROP SEQUENCE IF EXISTS team_seq CASCADE;
DROP SEQUENCE IF EXISTS match_seq CASCADE;
DROP SEQUENCE IF EXISTS stadium_seq CASCADE;
DROP SEQUENCE IF EXISTS spec_seq CASCADE;
CREATE SEQUENCE com_seq START 1 INCREMENT 1;
CREATE SEQUENCE commem_seq START 1 INCREMENT 1;
CREATE SEQUENCE team_seq START 1 INCREMENT 1;
CREATE SEQUENCE match_seq START 1 INCREMENT 1;
CREATE SEQUENCE stadium_seq START 1 INCREMENT 1;
CREATE SEQUENCE spec_seq START 1 INCREMENT 1;

---------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_com_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.com_id = 'COM_' || LPAD(NEXTVAL('com_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE OR REPLACE FUNCTION generate_commem_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.com_mem_id = 'COMMEM_' || LPAD(NEXTVAL('commem_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE OR REPLACE FUNCTION generate_team_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.team_id = 'TEAM_' || LPAD(NEXTVAL('team_seq')::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE OR REPLACE FUNCTION generate_match_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.match_id = 'M_' || LPAD(NEXTVAL('match_seq')::TEXT, 9, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE OR REPLACE FUNCTION generate_stadium_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.stadium_id = 'S_' || LPAD(NEXTVAL('stadium_seq')::TEXT, 3, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE OR REPLACE FUNCTION generate_spec_id() RETURNS TRIGGER AS $$
BEGIN
    NEW.spectator_id = 'SPEC_' || LPAD(NEXTVAL('spec_seq')::TEXT, 9, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---------------------------------------------------------------------------------

----------------------------------------------------------------------------------

CREATE TABLE team (
    team_id VARCHAR(20) PRIMARY KEY,
	team_another_name VARCHAR(50),
    team_name VARCHAR(100) NOT NULL UNIQUE,  
    team_city VARCHAR(50) NOT NULL,
    team_country VARCHAR(50) NOT NULL,
	team_created_at VARCHAR(20),
    team_trophies INTEGER,
	team_owner VARCHAR(50),
    group_id INTEGER,
	team_logo_url VARCHAR(500)
);

CREATE TABLE stadium (
    stadium_id VARCHAR(20) PRIMARY KEY,
    stadium_name VARCHAR(100) NOT NULL UNIQUE,
	stadium_another_name VARCHAR(100),
    stadium_address VARCHAR(200) NOT NULL,    
    capacity INTEGER,
	stadium_size VARCHAR(100),
	stadium_construction_date VARCHAR(100),
	stadium_construction_cost VARCHAR(100), -- by dollars =))
	stadium_owner_team VARCHAR(100),
	stadium_public_transit VARCHAR(100),
	stadium_photo_url VARCHAR(500)
);

CREATE TABLE match_table (
    match_id VARCHAR(25) PRIMARY KEY,
    match_time VARCHAR(10) NOT NULL,
	score VARCHAR (10),
	home_team_id VARCHAR(20) NOT NULL,
	away_team_id VARCHAR(20) NOT NULL,
    match_date VARCHAR (10) NOT NULL, 
    match_round INTEGER NOT NULL, 
    stadium_id VARCHAR(20) NOT NULL, 
	price_seat_level_a VARCHAR (10) NOT NULL,
	price_seat_level_b VARCHAR (10) NOT NULL,
	price_seat_level_c VARCHAR (10) NOT NULL,
	price_seat_level_d VARCHAR (10) NOT NULL,
	is_finished BOOLEAN,
    CONSTRAINT fk_match_stadium FOREIGN KEY (stadium_id) REFERENCES stadium(stadium_id) ON DELETE CASCADE,
	CONSTRAINT fk_home_team FOREIGN KEY (home_team_id) REFERENCES team(team_id) ON DELETE CASCADE,
	CONSTRAINT fk_away_team FOREIGN KEY (away_team_id) REFERENCES team(team_id) ON DELETE CASCADE
);


CREATE TABLE main_referee (
	league_id VARCHAR(20),
    com_mem_id VARCHAR(20) PRIMARY KEY,
    com_mem_first_name VARCHAR(50) NOT NULL,
    com_mem_last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(50)
);

CREATE TABLE match_manager (
	league_id VARCHAR(20),
    com_mem_id VARCHAR(20) PRIMARY KEY,
    com_mem_first_name VARCHAR(50) NOT NULL,
    com_mem_last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(50)
);

CREATE TABLE video_assistant_referee (
	league_id VARCHAR(20),
    com_mem_id VARCHAR(20) PRIMARY KEY,
    com_mem_first_name VARCHAR(50) NOT NULL,
    com_mem_last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(50)
);

CREATE TABLE linesman_referee (
	league_id VARCHAR(20),
    com_mem_id VARCHAR(20) PRIMARY KEY,
    com_mem_first_name VARCHAR(50) NOT NULL,
    com_mem_last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(50)
);

CREATE TABLE sponsor (
	league_id VARCHAR(20),
    com_mem_id VARCHAR(20) PRIMARY KEY,
    com_mem_first_name VARCHAR(50) NOT NULL,
    com_mem_last_name VARCHAR(50) NOT NULL,
    nationality VARCHAR(50)
);

CREATE TABLE committee_member_entrance (
    com_mem_id VARCHAR(20),
    match_id VARCHAR(25),
    entrance_ticket VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(50) NOT NULL CHECK (title IN ('Main Referee', 'Match Manager', 'VAR', 'Linesman', 'Sponsor')),
    CONSTRAINT fk_committee_entrance_match FOREIGN KEY (match_id) REFERENCES match_table(match_id) ON DELETE CASCADE,
	CONSTRAINT fk_committee_entrance_id FOREIGN KEY (com_mem_id) REFERENCES committee_member(com_mem_id) ON DELETE CASCADE
);

CREATE TABLE committee_member_contact (
    com_mem_id VARCHAR(20),
    contact_number BIGINT NOT NULL,
	CONSTRAINT fk_committee_contact FOREIGN KEY (com_mem_id) REFERENCES committee_member(com_mem_id) ON DELETE CASCADE,
	CONSTRAINT chk_contact_number CHECK (contact_number::TEXT ~ '^\+?[0-9]{7,15}$')
);

CREATE TABLE player (
	league_id VARCHAR(20),
    com_id VARCHAR(20) PRIMARY KEY,
    com_first_name VARCHAR(50) NOT NULL,
    com_last_name VARCHAR(50) NOT NULL,
    age INTEGER,
    com_street VARCHAR(100),
    postal_code VARCHAR(20),
    squad_number INTEGER,
    position_player VARCHAR(50) NOT NULL,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    total_min_play INTEGER,
    total_goal INTEGER,
    total_assist INTEGER,
    team_id VARCHAR(20),
    CONSTRAINT fk_player_team FOREIGN KEY (team_id) REFERENCES team(team_id)
);


CREATE TABLE club_doctor (
	league_id VARCHAR(20),
    com_id VARCHAR(20) PRIMARY KEY,
    com_first_name VARCHAR(50) NOT NULL,
    com_last_name VARCHAR(50) NOT NULL,
    age INTEGER,
    com_street VARCHAR(100),
    postal_code VARCHAR(20),
    doctor_title VARCHAR(50),
    team_id VARCHAR(20),
    CONSTRAINT fk_club_doctor FOREIGN KEY (team_id) REFERENCES team(team_id)
);

CREATE TABLE coach (
	league_id VARCHAR(20),
    com_id VARCHAR(20) PRIMARY KEY,
    com_first_name VARCHAR(50) NOT NULL,
    com_last_name VARCHAR(50) NOT NULL,
    age INTEGER,
    com_street VARCHAR(100),
    postal_code VARCHAR(20),
	coach_title VARCHAR(50),
    team_id VARCHAR(20),
    CONSTRAINT fk_coach_team FOREIGN KEY (team_id) REFERENCES team(team_id)
);


CREATE TABLE personal_doctor (
	league_id VARCHAR(20),
    com_id VARCHAR(20) PRIMARY KEY,
    com_first_name VARCHAR(50) NOT NULL,
    com_last_name VARCHAR(50) NOT NULL,
    age INTEGER,
    com_street VARCHAR(100),
    postal_code VARCHAR(20),
    doctor_title VARCHAR(50),
    supported_player_id VARCHAR(20),
	team_id VARCHAR(20),  
    CONSTRAINT fk_personal_doctor_player FOREIGN KEY (supported_player_id) REFERENCES player(com_id),
	CONSTRAINT fk_personal_doctor_team FOREIGN KEY (team_id) REFERENCES team(team_id) 
);

CREATE TABLE competitor_entrance_permission (
    com_id VARCHAR(20),
    entrance_ticket SERIAL PRIMARY KEY,
    match_id VARCHAR(25) NOT NULL,
    title VARCHAR(50) NOT NULL,
    CONSTRAINT fk_competitor_entrance_match FOREIGN KEY (match_id) REFERENCES match_table(match_id),
    CONSTRAINT fk_competitor_entrance_id FOREIGN KEY (com_id) REFERENCES competitor_member(com_id)
);

CREATE TABLE competitor_member_contact (
    contact_number BIGINT NOT NULL,
    competitor_id VARCHAR(20) NOT NULL,
    CONSTRAINT fk_competitor_contact FOREIGN KEY (competitor_id) REFERENCES competitor_member(com_id),
    CONSTRAINT chk_contact_number CHECK (contact_number::TEXT ~ '^\+?[0-9]{7,15}$')
);

CREATE TABLE player_performance_per_match (
    match_id VARCHAR(25) NOT NULL,
    com_id VARCHAR(20) NOT NULL,
    minutes_of_playing INTEGER CHECK (minutes_of_playing >= 0), 
    score_time VARCHAR(10) CHECK (score_time ~ '^\d{2}:\d{2}$'), 
    assist_time VARCHAR(10) CHECK (assist_time ~ '^\d{2}:\d{2}$'), 

    PRIMARY KEY (com_id, match_id),
    CONSTRAINT fk_performance_player FOREIGN KEY (com_id) REFERENCES player(com_id),
    CONSTRAINT fk_performance_match FOREIGN KEY (match_id) REFERENCES match_table(match_id)
);

CREATE TABLE card (
    card_id SERIAL PRIMARY KEY,
    card_color VARCHAR(20) NOT NULL CHECK (card_color IN ('Yellow', 'Red')), 
    card_time TIMESTAMP NOT NULL,
    give_referee_id VARCHAR(20) NOT NULL,
    receive_player_id VARCHAR(20) NOT NULL,
    
    CONSTRAINT fk_card_referee FOREIGN KEY (give_referee_id) REFERENCES main_referee(com_mem_id),
    CONSTRAINT fk_card_player FOREIGN KEY (receive_player_id) REFERENCES player(com_id)
);

CREATE TABLE spectator (
	league_id VARCHAR(20),
    spectator_id VARCHAR(50) PRIMARY KEY,
    spectator_first_name VARCHAR(50),
    spectator_last_name VARCHAR(50),
	nationality VARCHAR(50)
);

CREATE TABLE view_match (
    view_match_id SERIAL PRIMARY KEY,
    match_id VARCHAR(25) NOT NULL,
	user_id VARCHAR(50) NOT NULL,
    seat VARCHAR(10),-- this will be insert later by admin
	seat_level CHAR(1) NOT NULL, 
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	total_price DECIMAL(10, 2),
	booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    spectator_id VARCHAR(50),

    CONSTRAINT fk_view_match_match FOREIGN KEY (match_id) REFERENCES match_table(match_id),
    CONSTRAINT fk_view_match_spectator FOREIGN KEY (spectator_id) REFERENCES spectator(spectator_id)
);

----------------------------------------------------------------------------------
CREATE TRIGGER trigger_team_id
BEFORE INSERT ON team
FOR EACH ROW EXECUTE FUNCTION generate_team_id();

---
CREATE TRIGGER trigger_match_id
BEFORE INSERT ON match_table
FOR EACH ROW EXECUTE FUNCTION generate_match_id();

---
CREATE TRIGGER trigger_stadium_id
BEFORE INSERT ON stadium
FOR EACH ROW EXECUTE FUNCTION generate_stadium_id();

---
CREATE TRIGGER trigger_main_referee_commem_id
BEFORE INSERT ON main_referee
FOR EACH ROW EXECUTE FUNCTION generate_commem_id();

CREATE TRIGGER trigger_match_manager_commem_id
BEFORE INSERT ON match_manager
FOR EACH ROW EXECUTE FUNCTION generate_commem_id();

CREATE TRIGGER trigger_video_assistant_referee_commem_id
BEFORE INSERT ON video_assistant_referee
FOR EACH ROW EXECUTE FUNCTION generate_commem_id();

CREATE TRIGGER trigger_linesman_referee_commem_id
BEFORE INSERT ON linesman_referee
FOR EACH ROW EXECUTE FUNCTION generate_commem_id();
---
CREATE TRIGGER trigger_sponsor_com_id
BEFORE INSERT ON sponsor
FOR EACH ROW EXECUTE FUNCTION generate_commem_id();

CREATE TRIGGER trigger_club_doctor_com_id
BEFORE INSERT ON club_doctor
FOR EACH ROW EXECUTE FUNCTION generate_com_id();

CREATE TRIGGER trigger_coach_com_id
BEFORE INSERT ON coach
FOR EACH ROW EXECUTE FUNCTION generate_com_id();

CREATE TRIGGER trigger_player_com_id
BEFORE INSERT ON player
FOR EACH ROW EXECUTE FUNCTION generate_com_id();

CREATE TRIGGER trigger_personal_doctor_com_id
BEFORE INSERT ON personal_doctor
FOR EACH ROW EXECUTE FUNCTION generate_com_id();

CREATE TRIGGER trigger_personal_doctor_com_id
BEFORE INSERT ON spectator
FOR EACH ROW EXECUTE FUNCTION generate_spec_id();
----------------------------------------------------------------------------------
CREATE TRIGGER trigger_player_insert
AFTER INSERT ON player
FOR EACH ROW EXECUTE FUNCTION insert_into_competitor_member();

CREATE TRIGGER trigger_coach_insert
AFTER INSERT ON coach
FOR EACH ROW EXECUTE FUNCTION insert_into_competitor_member();

CREATE TRIGGER trigger_club_doctor_insert
AFTER INSERT ON club_doctor
FOR EACH ROW EXECUTE FUNCTION insert_into_competitor_member();

CREATE TRIGGER trigger_personal_doctor_insert
AFTER INSERT ON personal_doctor
FOR EACH ROW EXECUTE FUNCTION insert_into_competitor_member();

CREATE TRIGGER trigger_main_referee_insert
AFTER INSERT ON main_referee
FOR EACH ROW EXECUTE FUNCTION insert_into_committee_member();

CREATE TRIGGER trigger_match_manager_insert
AFTER INSERT ON match_manager
FOR EACH ROW EXECUTE FUNCTION insert_into_committee_member();

CREATE TRIGGER trigger_video_assistant_referee_insert
AFTER INSERT ON video_assistant_referee
FOR EACH ROW EXECUTE FUNCTION insert_into_committee_member();

CREATE TRIGGER trigger_linesman_referee_insert
AFTER INSERT ON linesman_referee
FOR EACH ROW EXECUTE FUNCTION insert_into_committee_member();

CREATE TRIGGER trigger_sponsor_insert
AFTER INSERT ON sponsor
FOR EACH ROW EXECUTE FUNCTION insert_into_committee_member();

----------------------------------------------------------------------------------
INSERT INTO team (
  team_another_name, team_name, team_city, team_country,
  team_created_at, team_trophies, team_owner, group_id, team_logo_url
) VALUES
  ('The Red Devils', 'Manchester United', 'Manchester', 'England', '1878-01-01', 66, 'Sir Jim Ratcliffe', 1, 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg'),
  ('The Reds', 'Liverpool FC', 'Liverpool', 'England', '1892-01-01', 63, 'Fenway Sports Group', 1, 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg'),
  ('The Blues', 'Chelsea FC', 'London', 'England', '1905-01-01', 32, 'BlueCo (Todd Boehly)', 1, 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'),
  ('The Gunners', 'Arsenal FC', 'London', 'England', '1886-12-11', 48, 'Kroenke Sports & Entertainment', 1, 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg'),
  ('The Cityzens', 'Manchester City', 'Manchester', 'England', '1880-01-01', 28, 'City Football Group', 1, 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg'),
  ('The Lilywhites', 'Tottenham Hotspur', 'London', 'England', '1882-01-01', 26, 'ENIC Group', 1, 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg'),
  ('The Toffees', 'Everton FC', 'Liverpool', 'England', '1878-01-01', 24, 'Farhad Moshiri', 1, 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg'),
  ('The Foxes', 'Leicester City', 'Leicester', 'England', '1884-01-01', 7, 'King Power International Group', 2, 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg'),
  ('The Whites', 'Leeds United', 'Leeds', 'England', '1919-01-01', 9, '49ers Enterprises', 2, 'https://i.imgur.com/UqdG9Nv.png'),
  ('The Hammers', 'West Ham United', 'London', 'England', '1895-01-01', 6, 'David Sullivan', 1, 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg'),
  ('The Magpies', 'Newcastle United', 'Newcastle', 'England', '1892-01-01', 11, 'Public Investment Fund (Saudi Arabia)', 1, 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg'),
  ('The Villans', 'Aston Villa', 'Birmingham', 'England', '1874-01-01', 19, 'NSWE Group', 1, 'https://logos-world.net/wp-content/uploads/2023/08/Aston-Villa-Logo.png'),
  ('The Seagulls', 'Brighton & Hove Albion', 'Brighton', 'England', '1901-06-24', 3, 'Tony Bloom', 1, 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg'),
  ('Wolves', 'Wolverhampton Wanderers', 'Wolverhampton', 'England', '1877-01-01', 13, 'Fosun International', 1, 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg'),
  ('The Saints', 'Southampton FC', 'Southampton', 'England', '1885-01-01', 5, 'Sport Republic', 2, 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg'),
  ('The Eagles', 'Crystal Palace', 'London', 'England', '1905-01-01', 1, 'Steve Parish', 1, 'https://upload.wikimedia.org/wikipedia/en/0/0c/Crystal_Palace_FC_logo.svg'),
  ('The Bees', 'Brentford FC', 'London', 'England', '1889-01-01', 0, 'Matthew Benham', 1, 'https://upload.wikimedia.org/wikipedia/en/2/2a/Brentford_FC_crest.svg'),
  ('The Cottagers', 'Fulham FC', 'London', 'England', '1879-01-01', 0, 'Shahid Khan', 1, 'https://logodownload.org/wp-content/uploads/2022/10/fulham-fc-logo-400x500.png'),
  ('Forest', 'Nottingham Forest', 'Nottingham', 'England', '1865-01-01', 13, 'Evangelos Marinakis', 1, 'https://upload.wikimedia.org/wikipedia/en/1/1d/Nottingham_Forest_F.C._logo.svg'),
  ('The Cherries', 'AFC Bournemouth', 'Bournemouth', 'England', '1899-01-01', 0, 'Bill Foley', 1, 'https://upload.wikimedia.org/wikipedia/en/e/e5/AFC_Bournemouth.svg'),
  ('The Clarets', 'Burnley FC', 'Burnley', 'England', '1882-01-01', 4, 'ALK Capital', 2, 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Burnley_FC_badge.svg/200px-Burnley_FC_badge.svg.png'),
  ('The Blades', 'Sheffield United', 'Sheffield', 'England', '1889-01-01', 4, 'Prince Abdullah bin Musa', 2, 'https://upload.wikimedia.org/wikipedia/en/f/fc/Sheffield_United_FC_logo.svg'),
  ('The Hatters', 'Luton Town', 'Luton', 'England', '1885-01-01', 0, 'Luton Town Football Club 2020 Ltd', 1, 'https://upload.wikimedia.org/wikipedia/en/6/6e/Luton_Town_logo.svg'),
  ('The Canaries', 'Norwich City', 'Norwich', 'England', '1902-01-01', 2, 'Delia Smith & Michael Wynn', 0, 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Norwich_City.svg/200px-Norwich_City.svg' );
 

--https://i.imgur.com/UqdG9Nv.png

INSERT INTO stadium (
    stadium_name, stadium_another_name, stadium_address, capacity,
    stadium_size, stadium_construction_date, stadium_construction_cost,
    stadium_owner_team, stadium_public_transit
) VALUES
('Old Trafford', 'The Theatre of Dreams', 'Sir Matt Busby Way, Manchester', 74197,
 '105x68 meters', '1910-02-19', '£90,000', 'Manchester United', 'Wharfside tram stop'),

('Anfield', 'The Kop', 'Anfield Road, Liverpool', 61276,
 '101x68 meters', '1884-09-28', '£80,000', 'Liverpool FC', 'Kirkdale Station, Lime Street Station'),

('Stamford Bridge', 'The Bridge', 'Fulham Road, London', 40173,
 '103x67 meters', '1877-04-28', '£2,000,000', 'Chelsea FC', 'Fulham Broadway Station'),

('Emirates Stadium', 'Ashburton Grove', 'Hornsey Road, London', 60704,
 '105x68 meters', '2006-07-22', '£390,000,000', 'Arsenal FC', 'Arsenal Station, Holloway Road Station'),

('Etihad Stadium', 'City of Manchester Stadium', 'Ashton New Road, Manchester', 52900,
 '105x68 meters', '2002-07-25', '£112,000,000', 'Manchester City FC', 'Etihad Campus tram stop'),

('Tottenham Hotspur Stadium', 'New White Hart Lane', 'High Road, London', 62850,
 '105x68 meters', '2019-04-03', '£1,000,000,000', 'Tottenham Hotspur FC', 'White Hart Lane Station, Tottenham Hale Station'),

('Goodison Park', 'The Grand Old Lady', 'Goodison Road, Liverpool', 39414,
 '100x68 meters', '1892-08-24', '£300,000', 'Everton FC', 'Kirkdale Station'),

('King Power Stadium', 'Filbert Way', 'Filbert Way, Leicester', 32312,
 '105x68 meters', '2002-07-23', '£37,000,000', 'Leicester City FC', 'Leicester Railway Station'),

('Elland Road', 'The Peacocks'' Nest', 'Elland Road, Leeds', 37792,
 '105x68 meters', '1897-10-15', '£150,000', 'Leeds United FC', 'Elland Road bus stops'),

('London Stadium', 'Olympic Stadium', 'Queen Elizabeth Olympic Park, London', 60000,
 '105x68 meters', '2012-05-05', '£486,000,000', 'West Ham United FC', 'Stratford Station'),

('St James'' Park', 'The Cathedral on the Hill', 'Barrack Road, Newcastle', 52258,
 '105x68 meters', '1892-09-03', '£200,000', 'Newcastle United FC', 'St James Metro Station'),

('Villa Park', 'The Holte End', 'Trinity Road, Birmingham', 42918,
 '105x68 meters', '1897-04-17', '£17,000', 'Aston Villa FC', 'Witton Station'),

('Amex Stadium', 'Falmer Stadium', 'Village Way, Brighton', 31800,
 '105x68 meters', '2011-07-30', '£93,000,000', 'Brighton & Hove Albion FC', 'Falmer Station'),

('Molineux Stadium', 'The Golden Palace', 'Waterloo Road, Wolverhampton', 32050,
 '100x64 meters', '1889-09-07', '£10,000', 'Wolverhampton Wanderers FC', 'Wolverhampton Station'),

('St Mary''s Stadium', 'The Saints'' Home', 'Britannia Road, Southampton', 32384,
 '105x68 meters', '2001-08-01', '£32,000,000', 'Southampton FC', 'St Denys Station, Southampton Central');

INSERT INTO match_table (match_time, home_team_id, away_team_id, match_date, match_round, stadium_id, is_finished, score, price_seat_level_a, price_seat_level_b, price_seat_level_c, price_seat_level_d) VALUES
-- Round 1 (Finished, August 2024)
('20:00', 'TEAM_001', 'TEAM_003', '2024-08-16', 1, 'S_001', TRUE, '2-1', '180', '120', '70', '40'), -- Man Utd vs Chelsea
('12:30', 'TEAM_002', 'TEAM_011', '2024-08-17', 1, 'S_002', TRUE, '3-0', '170', '110', '65', '35'), -- Liverpool vs Newcastle
('15:00', 'TEAM_004', 'TEAM_014', '2024-08-17', 1, 'S_004', TRUE, '1-0', '160', '100', '60', '30'), -- Arsenal vs Wolves
('15:00', 'TEAM_007', 'TEAM_013', '2024-08-17', 1, 'S_007', TRUE, '1-1', '140', '90', '55', '25'), -- Everton vs Brighton
('15:00', 'TEAM_008', 'TEAM_006', '2024-08-17', 1, 'S_008', TRUE, '0-2', '150', '95', '60', '30'), -- Leicester vs Spurs
('15:00', 'TEAM_010', 'TEAM_012', '2024-08-17', 1, 'S_010', TRUE, '2-2', '145', '90', '55', '25'), -- West Ham vs Aston Villa
('15:00', 'TEAM_015', 'TEAM_005', '2024-08-17', 1, 'S_015', TRUE, '0-3', '130', '85', '50', '20'), -- Southampton vs Man City
('14:00', 'TEAM_009', 'TEAM_001', '2024-08-18', 1, 'S_009', TRUE, '1-2', '150', '95', '60', '30'), -- Leeds vs Man Utd
('16:30', 'TEAM_011', 'TEAM_015', '2024-08-18', 1, 'S_011', TRUE, '2-0', '140', '90', '55', '25'), -- Newcastle vs Southampton
('20:00', 'TEAM_005', 'TEAM_008', '2024-08-19', 1, 'S_005', TRUE, '4-0', '180', '120', '70', '40'), -- Man City vs Leicester

-- Round 2 (Finished, August 2024)
('12:30', 'TEAM_004', 'TEAM_012', '2024-08-24', 2, 'S_004', TRUE, '3-1', '160', '100', '60', '30'), -- Arsenal vs Aston Villa
('15:00', 'TEAM_006', 'TEAM_007', '2024-08-24', 2, 'S_006', TRUE, '2-1', '150', '95', '60', '30'), -- Spurs vs Everton
('15:00', 'TEAM_013', 'TEAM_001', '2024-08-24', 2, 'S_013', TRUE, '0-1', '140', '90', '55', '25'), -- Brighton vs Man Utd
('15:00', 'TEAM_015', 'TEAM_009', '2024-08-24', 2, 'S_015', TRUE, '1-1', '130', '85', '50', '20'), -- Southampton vs Leeds
('17:30', 'TEAM_002', 'TEAM_010', '2024-08-24', 2, 'S_002', TRUE, '3-2', '170', '110', '65', '35'), -- Liverpool vs West Ham
('14:00', 'TEAM_003', 'TEAM_014', '2024-08-25', 2, 'S_003', TRUE, '2-0', '170', '110', '65', '35'), -- Chelsea vs Wolves
('14:00', 'TEAM_011', 'TEAM_005', '2024-08-25', 2, 'S_011', TRUE, '1-3', '150', '95', '60', '30'), -- Newcastle vs Man City
('16:30', 'TEAM_012', 'TEAM_008', '2024-08-25', 2, 'S_012', TRUE, '2-1', '145', '90', '55', '25'), -- Aston Villa vs Leicester
('15:00', 'TEAM_001', 'TEAM_006', '2024-08-24', 2, 'S_001', TRUE, '1-0', '180', '120', '70', '40'), -- Man Utd vs Spurs
('15:00', 'TEAM_014', 'TEAM_013', '2024-08-24', 2, 'S_014', TRUE, '0-0', '130', '85', '50', '20'), -- Wolves vs Brighton

-- Round 3 (Finished, August/September 2024)
('12:30', 'TEAM_005', 'TEAM_010', '2024-08-31', 3, 'S_005', TRUE, '3-0', '180', '120', '70', '40'), -- Man City vs West Ham
('15:00', 'TEAM_007', 'TEAM_002', '2024-08-31', 3, 'S_007', TRUE, '0-2', '150', '95', '60', '30'), -- Everton vs Liverpool
('15:00', 'TEAM_008', 'TEAM_004', '2024-08-31', 3, 'S_008', TRUE, '1-2', '145', '90', '55', '25'), -- Leicester vs Arsenal
('15:00', 'TEAM_009', 'TEAM_011', '2024-08-31', 3, 'S_009', TRUE, '2-2', '140', '90', '55', '25'), -- Leeds vs Newcastle
('15:00', 'TEAM_013', 'TEAM_015', '2024-08-31', 3, 'S_013', TRUE, '1-0', '130', '85', '50', '20'), -- Brighton vs Southampton
('17:30', 'TEAM_012', 'TEAM_003', '2024-08-31', 3, 'S_012', TRUE, '1-1', '150', '95', '60', '30'), -- Aston Villa vs Chelsea
('14:00', 'TEAM_014', 'TEAM_001', '2024-09-01', 3, 'S_014', TRUE, '0-1', '140', '90', '55', '25'), -- Wolves vs Man Utd
('14:00', 'TEAM_006', 'TEAM_009', '2024-09-01', 3, 'S_006', TRUE, '2-1', '150', '95', '60', '30'), -- Spurs vs Leeds
('16:30', 'TEAM_010', 'TEAM_013', '2024-09-01', 3, 'S_010', TRUE, '1-1', '145', '90', '55', '25'), -- West Ham vs Brighton
('15:00', 'TEAM_003', 'TEAM_005', '2024-09-01', 3, 'S_003', TRUE, '2-3', '180', '120', '70', '40'), -- Chelsea vs Man City

-- Round 15 (Finished, December 2024)
('15:00', 'TEAM_012', 'TEAM_015', '2024-12-07', 15, 'S_012', TRUE, '2-0', '145', '90', '55', '25'), -- Aston Villa vs Southampton
('15:00', 'TEAM_001', 'TEAM_008', '2024-12-07', 15, 'S_001', TRUE, '3-1', '180', '120', '70', '40'), -- Man Utd vs Leicester
('15:00', 'TEAM_002', 'TEAM_014', '2024-12-07', 15, 'S_002', TRUE, '2-0', '170', '110', '65', '35'), -- Liverpool vs Wolves
('15:00', 'TEAM_004', 'TEAM_006', '2024-12-07', 15, 'S_004', TRUE, '1-1', '160', '100', '60', '30'), -- Arsenal vs Spurs
('14:00', 'TEAM_005', 'TEAM_009', '2024-12-08', 15, 'S_005', TRUE, '3-0', '180', '120', '70', '40'), -- Man City vs Leeds
('14:00', 'TEAM_007', 'TEAM_011', '2024-12-08', 15, 'S_007', TRUE, '1-2', '140', '90', '55', '25'), -- Everton vs Newcastle
('14:00', 'TEAM_013', 'TEAM_003', '2024-12-08', 15, 'S_013', TRUE, '0-1', '140', '90', '55', '25'), -- Brighton vs Chelsea
('15:00', 'TEAM_010', 'TEAM_001', '2024-12-08', 15, 'S_010', TRUE, '1-2', '150', '95', '60', '30'), -- West Ham vs Man Utd
('20:00', 'TEAM_015', 'TEAM_012', '2024-12-09', 15, 'S_015', TRUE, '0-1', '130', '85', '50', '20'), -- Southampton vs Aston Villa
('15:00', 'TEAM_014', 'TEAM_004', '2024-12-14', 16, 'S_014', TRUE, '0-2', '140', '90', '55', '25'), -- Wolves vs Arsenal

-- Round 32 (Finished and Upcoming, April 2025)
('15:00', 'TEAM_013', 'TEAM_005', '2025-04-19', 32, 'S_013', FALSE, NULL, '140', '90', '55', '25'), -- Brighton vs Man City
('15:00', 'TEAM_006', 'TEAM_015', '2025-04-19', 32, 'S_006', FALSE, NULL, '150', '95', '60', '30'), -- Spurs vs Southampton
('15:00', 'TEAM_007', 'TEAM_014', '2025-04-19', 32, 'S_007', FALSE, NULL, '140', '90', '55', '25'), -- Everton vs Wolves
('15:00', 'TEAM_011', 'TEAM_009', '2025-04-19', 32, 'S_011', FALSE, NULL, '145', '90', '55', '25'), -- Newcastle vs Leeds
('14:00', 'TEAM_003', 'TEAM_001', '2025-04-20', 32, 'S_003', FALSE, NULL, '180', '120', '70', '40'), -- Chelsea vs Man Utd
('14:00', 'TEAM_012', 'TEAM_002', '2025-04-20', 32, 'S_012', FALSE, NULL, '150', '95', '60', '30'), -- Aston Villa vs Liverpool
('16:30', 'TEAM_008', 'TEAM_004', '2025-04-20', 32, 'S_008', FALSE, NULL, '145', '90', '55', '25'), -- Leicester vs Arsenal
('20:00', 'TEAM_001', 'TEAM_013', '2025-04-21', 32, 'S_001', FALSE, NULL, '180', '120', '70', '40'), -- Man Utd vs Brighton
('20:00', 'TEAM_005', 'TEAM_006', '2025-04-22', 32, 'S_005', FALSE, NULL, '180', '120', '70', '40'), -- Man City vs Spurs
('20:00', 'TEAM_009', 'TEAM_007', '2025-04-23', 32, 'S_009', FALSE, NULL, '140', '90', '55', '25'), -- Leeds vs Everton

-- Round 33 (Upcoming, April 2025)
('12:30', 'TEAM_002', 'TEAM_003', '2025-04-26', 33, 'S_002', FALSE, NULL, '180', '120', '70', '40'), -- Liverpool vs Chelsea
('15:00', 'TEAM_004', 'TEAM_011', '2025-04-26', 33, 'S_004', FALSE, NULL, '160', '100', '60', '30'), -- Arsenal vs Newcastle
('15:00', 'TEAM_015', 'TEAM_010', '2025-04-26', 33, 'S_015', FALSE, NULL, '130', '85', '50', '20'), -- Southampton vs West Ham
('15:00', 'TEAM_014', 'TEAM_008', '2025-04-26', 33, 'S_014', FALSE, NULL, '140', '90', '55', '25'), -- Wolves vs Leicester
('14:00', 'TEAM_006', 'TEAM_012', '2025-04-27', 33, 'S_006', FALSE, NULL, '150', '95', '60', '30'), -- Spurs vs Aston Villa
('16:30', 'TEAM_013', 'TEAM_009', '2025-04-27', 33, 'S_013', FALSE, NULL, '140', '90', '55', '25'), -- Brighton vs Leeds
('15:00', 'TEAM_001', 'TEAM_005', '2025-05-01', 33, 'S_001', FALSE, NULL, '180', '120', '70', '40'), -- Man Utd vs Man City
('20:00', 'TEAM_007', 'TEAM_015', '2025-05-02', 34, 'S_007', FALSE, NULL, '140', '90', '55', '25'), -- Everton vs Southampton
('14:00', 'TEAM_010', 'TEAM_002', '2025-05-04', 34, 'S_010', FALSE, NULL, '150', '95', '60', '30'), -- West Ham vs Liverpool
('15:00', 'TEAM_003', 'TEAM_013', '2025-05-04', 34, 'S_003', FALSE, NULL, '170', '110', '65', '35'), -- Chelsea vs Brighton

-- Round 34 (April 2025)
('12:30', 'TEAM_004', 'TEAM_015', '2025-04-19', 34, 'S_004', FALSE, NULL, '160', '100', '60', '30'), -- Arsenal vs Southampton
('15:00', 'TEAM_009', 'TEAM_003', '2025-04-19', 34, 'S_009', FALSE, NULL, '150', '95', '60', '30'), -- Leeds vs Chelsea
('15:00', 'TEAM_011', 'TEAM_001', '2025-04-19', 34, 'S_011', FALSE, NULL, '150', '95', '60', '30'), -- Newcastle vs Man Utd
('15:00', 'TEAM_012', 'TEAM_014', '2025-04-19', 34, 'S_012', FALSE, NULL, '145', '90', '55', '25'), -- Aston Villa vs Wolves
('15:00', 'TEAM_013', 'TEAM_006', '2025-04-19', 34, 'S_013', FALSE, NULL, '140', '90', '55', '25'), -- Brighton vs Spurs
('14:00', 'TEAM_005', 'TEAM_007', '2025-04-20', 34, 'S_005', FALSE, NULL, '180', '120', '70', '40'), -- Man City vs Everton
('14:00', 'TEAM_008', 'TEAM_010', '2025-04-20', 34, 'S_008', FALSE, NULL, '145', '90', '55', '25'), -- Leicester vs West Ham
('16:30', 'TEAM_002', 'TEAM_004', '2025-04-20', 34, 'S_002', FALSE, NULL, '180', '120', '70', '40'), -- Liverpool vs Arsenal
('19:30', 'TEAM_001', 'TEAM_012', '2025-04-22', 34, 'S_001', FALSE, NULL, '180', '120', '70', '40'), -- Man Utd vs Aston Villa
('20:00', 'TEAM_006', 'TEAM_011', '2025-04-22', 34, 'S_006', FALSE, NULL, '150', '95', '60', '30'), -- Spurs vs Newcastle

-- Round 35 (April/May 2025)
('12:30', 'TEAM_015', 'TEAM_002', '2025-04-26', 35, 'S_015', FALSE, NULL, '130', '85', '50', '20'), -- Southampton vs Liverpool
('15:00', 'TEAM_003', 'TEAM_008', '2025-04-26', 35, 'S_003', FALSE, NULL, '170', '110', '65', '35'), -- Chelsea vs Leicester
('15:00', 'TEAM_007', 'TEAM_009', '2025-04-26', 35, 'S_007', FALSE, NULL, '140', '90', '55', '25'), -- Everton vs Leeds
('15:00', 'TEAM_010', 'TEAM_013', '2025-04-26', 35, 'S_010', FALSE, NULL, '145', '90', '55', '25'), -- West Ham vs Brighton
('15:00', 'TEAM_014', 'TEAM_005', '2025-04-26', 35, 'S_014', FALSE, NULL, '140', '90', '55', '25'), -- Wolves vs Man City
('14:00', 'TEAM_004', 'TEAM_001', '2025-04-27', 35, 'S_004', FALSE, NULL, '180', '120', '70', '40'), -- Arsenal vs Man Utd
('14:00', 'TEAM_011', 'TEAM_012', '2025-04-27', 35, 'S_011', FALSE, NULL, '150', '95', '60', '30'), -- Newcastle vs Aston Villa
('16:30', 'TEAM_006', 'TEAM_002', '2025-04-27', 35, 'S_006', FALSE, NULL, '170', '110', '65', '35'), -- Spurs vs Liverpool
('19:30', 'TEAM_013', 'TEAM_007', '2025-04-29', 35, 'S_013', FALSE, NULL, '140', '90', '55', '25'), -- Brighton vs Everton
('20:00', 'TEAM_005', 'TEAM_003', '2025-04-29', 35, 'S_005', FALSE, NULL, '180', '120', '70', '40'), -- Man City vs Chelsea

-- Round 36 (May 2025)
('12:30', 'TEAM_002', 'TEAM_013', '2025-05-03', 36, 'S_002', FALSE, NULL, '170', '110', '65', '35'), -- Liverpool vs Brighton
('15:00', 'TEAM_008', 'TEAM_015', '2025-05-03', 36, 'S_008', FALSE, NULL, '145', '90', '55', '25'), -- Leicester vs Southampton
('15:00', 'TEAM_009', 'TEAM_014', '2025-05-03', 36, 'S_009', FALSE, NULL, '140', '90', '55', '25'), -- Leeds vs Wolves
('15:00', 'TEAM_012', 'TEAM_010', '2025-05-03', 36, 'S_012', FALSE, NULL, '145', '90', '55', '25'), -- Aston Villa vs West Ham
('15:00', 'TEAM_001', 'TEAM_006', '2025-05-03', 36, 'S_001', FALSE, NULL, '180', '120', '70', '40'), -- Man Utd vs Spurs
('14:00', 'TEAM_003', 'TEAM_011', '2025-05-04', 36, 'S_003', FALSE, NULL, '170', '110', '65', '35'), -- Chelsea vs Newcastle
('14:00', 'TEAM_007', 'TEAM_004', '2025-05-04', 36, 'S_007', FALSE, NULL, '140', '90', '55', '25'), -- Everton vs Arsenal
('16:30', 'TEAM_015', 'TEAM_005', '2025-05-04', 36, 'S_015', FALSE, NULL, '130', '85', '50', '20'), -- Southampton vs Man City
('19:30', 'TEAM_010', 'TEAM_009', '2025-05-06', 36, 'S_010', FALSE, NULL, '145', '90', '55', '25'), -- West Ham vs Leeds
('20:00', 'TEAM_014', 'TEAM_002', '2025-05-06', 36, 'S_014', FALSE, NULL, '140', '90', '55', '25'), -- Wolves vs Liverpool

-- Round 37 (May 2025)
('12:30', 'TEAM_005', 'TEAM_001', '2025-05-10', 37, 'S_005', FALSE, NULL, '180', '120', '70', '40'), -- Man City vs Man Utd
('15:00', 'TEAM_006', 'TEAM_008', '2025-05-10', 37, 'S_006', FALSE, NULL, '150', '95', '60', '30'), -- Spurs vs Leicester
('15:00', 'TEAM_011', 'TEAM_007', '2025-05-10', 37, 'S_011', FALSE, NULL, '150', '95', '60', '30'), -- Newcastle vs Everton
('15:00', 'TEAM_013', 'TEAM_015', '2025-05-10', 37, 'S_013', FALSE, NULL, '140', '90', '55', '25'), -- Brighton vs Southampton
('15:00', 'TEAM_002', 'TEAM_012', '2025-05-10', 37, 'S_002', FALSE, NULL, '170', '110', '65', '35'), -- Liverpool vs Aston Villa
('14:00', 'TEAM_004', 'TEAM_003', '2025-05-11', 37, 'S_004', FALSE, NULL, '180', '120', '70', '40'), -- Arsenal vs Chelsea
('14:00', 'TEAM_009', 'TEAM_005', '2025-05-11', 37, 'S_009', FALSE, NULL, '150', '95', '60', '30'), -- Leeds vs Man City
('16:30', 'TEAM_010', 'TEAM_014', '2025-05-11', 37, 'S_010', FALSE, NULL, '145', '90', '55', '25'), -- West Ham vs Wolves
('19:30', 'TEAM_015', 'TEAM_006', '2025-05-13', 37, 'S_015', FALSE, NULL, '130', '85', '50', '20'), -- Southampton vs Spurs
('20:00', 'TEAM_001', 'TEAM_011', '2025-05-13', 37, 'S_001', FALSE, NULL, '180', '120', '70', '40'); -- Man Utd vs Newcastle

INSERT INTO main_referee (com_mem_first_name, com_mem_last_name, nationality) VALUES
('Michael', 'Oliver', 'English'),
('Anthony', 'Taylor', 'English'),
('Martin', 'Atkinson', 'English'),
('Mike', 'Dean', 'English'),
('Andre', 'Marriner', 'English'),
('Kevin', 'Friend', 'English'),
('Lee', 'Mason', 'English'),
('Jonathan', 'Moss', 'English'),
('Stuart', 'Attwell', 'English'),
('Paul', 'Tierney', 'English'),
('Craig', 'Pawson', 'English'),
('Chris', 'Kavanagh', 'English'),
('David', 'Coote', 'English'),
('Graham', 'Scott', 'English'),
('Robert', 'Jones', 'English');

INSERT INTO match_manager (com_mem_first_name, com_mem_last_name, nationality) VALUES
('Richard', 'Masters', 'English'),
('Gary', 'Hoffman', 'English'),
('Bill', 'Bush', 'English'),
('Claudia', 'Arney', 'English'),
('Kevin', 'Beeston', 'English'),
('Tim', 'Score', 'English'),
('Susan', 'Whelan', 'English'),
('Tom', 'Betts', 'English'),
('David', 'Gill', 'English'),
('Peter', 'McCormick', 'English'),
('John', 'Smith', 'English'),
('Emma', 'Hayes', 'English'),
('Mark', 'Jones', 'English'),
('Laura', 'Brown', 'English'),
('James', 'Taylor', 'English');

INSERT INTO video_assistant_referee (com_mem_first_name, com_mem_last_name, nationality) VALUES
('Darren', 'England', 'English'),
('Jarred', 'Gillett', 'Australian'),
('Peter', 'Bankes', 'English'),
('Simon', 'Hooper', 'English'),
('Andy', 'Madley', 'English'),
('Tim', 'Robinson', 'English'),
('Tony', 'Harrington', 'English'),
('Matt', 'Donohue', 'English'),
('James', 'Mainwaring', 'English'),
('Sian', 'Massey-Ellis', 'English'),
('Neil', 'Davies', 'English'),
('Dan', 'Cook', 'English'),
('Lee', 'Betts', 'English'),
('Ian', 'Hussin', 'English'),
('Derek', 'Eaton', 'English');


INSERT INTO linesman_referee (com_mem_first_name, com_mem_last_name, nationality) VALUES
('Gary', 'Beswick', 'English'),
('Adam', 'Nunn', 'English'),
('Marc', 'Perry', 'English'),
('Dan', 'Robathan', 'English'),
('Nick', 'Hopton', 'English'),
('James', 'Bell', 'English'),
('Scott', 'Ledger', 'English'),
('Harry', 'Lennard', 'English'),
('Simon', 'Bennett', 'English'),
('Eddie', 'Smart', 'English'),
('Mark', 'Scholes', 'English'),
('Natalie', 'Aspinall', 'English'),
('Tim', 'Wood', 'English'),
('Steve', 'Meredith', 'English'),
('Matt', 'Wilkes', 'English');

INSERT INTO sponsor (com_mem_first_name, com_mem_last_name, nationality) VALUES
('John', 'Doe', 'American'),
('Emma', 'Smith', 'English'),
('Liam', 'Johnson', 'English'),
('Sophie', 'Brown', 'French'),
('Carlos', 'Garcia', 'Spanish'),
('Anna', 'Muller', 'German'),
('Hiroshi', 'Tanaka', 'Japanese'),
('Maria', 'Rossi', 'Italian'),
('Ahmed', 'Khan', 'Pakistani'),
('Olivia', 'Lee', 'Australian'),
('Pierre', 'Dubois', 'French'),
('Elena', 'Petrova', 'Russian'),
('Tom', 'Wilson', 'English'),
('Aisha', 'Malik', 'Indian'),
('Lucas', 'Silva', 'Brazilian');



INSERT INTO committee_member_contact (com_mem_id, contact_number) VALUES
('COMMEM_000001', 447912345678),
('COMMEM_000002', 447923456789),
('COMMEM_000016', 447934567890),
('COMMEM_000017', 447945678901),
('COMMEM_000031', 447956789012),
('COMMEM_000032', 447967890123),
('COMMEM_000046', 447978901234),
('COMMEM_000047', 447989012345),
('COMMEM_000061', 12025550123),
('COMMEM_000062', 12025550124),
('COMMEM_000003', 447912345679),
('COMMEM_000018', 447923456780),
('COMMEM_000033', 447934567891),
('COMMEM_000048', 447945678902),
('COMMEM_000063', 12025550125);

INSERT INTO player (com_first_name, com_last_name, age, com_street, postal_code, squad_number, position_player, weight, height, total_min_play, total_goal, total_assist, team_id) VALUES
-- Manchester United (TEAM_001)
('Luke', 'Shaw', 29, '167 Old Trafford Rd', 'M16 0RA', 23, 'Defender', 75.0, 181.0, 1800, 1, 5, 'TEAM_001'),
('Marcus', 'Rashford', 27, '167 Old Trafford Rd', 'M16 0RA', 10, 'Forward', 71.0, 180.0, 2100, 12, 6, 'TEAM_001'),
('Bruno', 'Fernandes', 30, '167 Old Trafford Rd', 'M16 0RA', 8, 'Midfielder', 69.0, 179.0, 2300, 10, 15, 'TEAM_001'),
('Lisandro', 'Martinez', 27, '167 Old Trafford Rd', 'M16 0RA', 6, 'Defender', 77.0, 175.0, 1900, 2, 1, 'TEAM_001'),
('Mason', 'Mount', 26, '167 Old Trafford Rd', 'M16 0RA', 7, 'Midfielder', 70.0, 181.0, 1700, 5, 4, 'TEAM_001'),
('Diogo', 'Dalot', 25, '167 Old Trafford Rd', 'M16 0RA', 20, 'Defender', 76.0, 183.0, 2000, 1, 3, 'TEAM_001'),
('Casemiro', '', 33, '167 Old Trafford Rd', 'M16 0RA', 18, 'Midfielder', 84.0, 185.0, 1800, 3, 2, 'TEAM_001'),
('Andre', 'Onana', 28, '167 Old Trafford Rd', 'M16 0RA', 24, 'Goalkeeper', 82.0, 190.0, 2200, 0, 0, 'TEAM_001'),
('Jadon', 'Sancho', 24, '167 Old Trafford Rd', 'M16 0RA', 25, 'Winger', 76.0, 180.0, 1600, 6, 5, 'TEAM_001'),
('Harry', 'Maguire', 31, '167 Old Trafford Rd', 'M16 0RA', 5, 'Defender', 94.0, 194.0, 1700, 2, 0, 'TEAM_001'),
('Alejandro', 'Garnacho', 20, '167 Old Trafford Rd', 'M16 0RA', 17, 'Winger', 70.0, 180.0, 1500, 7, 3, 'TEAM_001'),
('Kobbie', 'Mainoo', 19, '167 Old Trafford Rd', 'M16 0RA', 37, 'Midfielder', 68.0, 175.0, 1400, 2, 2, 'TEAM_001'),
('Rasmus', 'Hojlund', 22, '167 Old Trafford Rd', 'M16 0RA', 11, 'Forward', 79.0, 191.0, 1600, 8, 1, 'TEAM_001'),

-- Liverpool FC (TEAM_002)
('Trent', 'Alexander-Arnold', 26, '89 Anfield St', 'L4 0TH', 66, 'Defender', 69.0, 175.0, 2300, 2, 12, 'TEAM_002'),
('Cody', 'Gakpo', 25, '101 Anfield St', 'L4 0TH', 18, 'Forward', 76.0, 187.0, 2000, 9, 5, 'TEAM_002'),
('Mohamed', 'Salah', 32, '89 Anfield St', 'L4 0TH', 11, 'Forward', 71.0, 175.0, 2400, 18, 10, 'TEAM_002'),
('Virgil', 'van Dijk', 33, '89 Anfield St', 'L4 0TH', 4, 'Defender', 92.0, 193.0, 2300, 3, 1, 'TEAM_002'),
('Alisson', 'Becker', 32, '89 Anfield St', 'L4 0TH', 1, 'Goalkeeper', 91.0, 191.0, 2200, 0, 0, 'TEAM_002'),
('Dominik', 'Szoboszlai', 24, '89 Anfield St', 'L4 0TH', 8, 'Midfielder', 74.0, 186.0, 1900, 5, 7, 'TEAM_002'),
('Andy', 'Robertson', 30, '89 Anfield St', 'L4 0TH', 26, 'Defender', 64.0, 178.0, 2100, 1, 8, 'TEAM_002'),
('Diogo', 'Jota', 28, '89 Anfield St', 'L4 0TH', 20, 'Forward', 70.0, 178.0, 1800, 10, 4, 'TEAM_002'),
('Ibrahima', 'Konate', 25, '89 Anfield St', 'L4 0TH', 5, 'Defender', 95.0, 194.0, 1700, 1, 0, 'TEAM_002'),
('Alexis', 'Mac Allister', 26, '89 Anfield St', 'L4 0TH', 10, 'Midfielder', 71.0, 174.0, 2000, 4, 6, 'TEAM_002'),
('Luis', 'Diaz', 28, '89 Anfield St', 'L4 0TH', 7, 'Winger', 73.0, 180.0, 1900, 8, 5, 'TEAM_002'),
('Curtis', 'Jones', 24, '89 Anfield St', 'L4 0TH', 17, 'Midfielder', 75.0, 185.0, 1600, 3, 3, 'TEAM_002'),
('Darwin', 'Nunez', 25, '89 Anfield St', 'L4 0TH', 9, 'Forward', 81.0, 187.0, 1700, 11, 3, 'TEAM_002'),

-- Chelsea FC (TEAM_003)
('Reece', 'James', 25, '101 Stamford Rd', 'SW6 1HS', 24, 'Defender', 82.0, 182.0, 1900, 3, 6, 'TEAM_003'),
('Thiago', 'Silva', 40, '123 Stamford Rd', 'SW6 1HS', 6, 'Defender', 79.0, 183.0, 2300, 2, 1, 'TEAM_003'),
('Enzo', 'Fernandez', 24, '101 Stamford Rd', 'SW6 1HS', 8, 'Midfielder', 76.0, 178.0, 2100, 5, 7, 'TEAM_003'),
('Cole', 'Palmer', 22, '101 Stamford Rd', 'SW6 1HS', 20, 'Midfielder', 74.0, 182.0, 2000, 12, 8, 'TEAM_003'),
('Moises', 'Caicedo', 23, '101 Stamford Rd', 'SW6 1HS', 25, 'Midfielder', 73.0, 178.0, 1900, 2, 3, 'TEAM_003'),
('Levi', 'Colwill', 21, '101 Stamford Rd', 'SW6 1HS', 26, 'Defender', 83.0, 187.0, 1800, 1, 2, 'TEAM_003'),
('Ben', 'Chilwell', 28, '101 Stamford Rd', 'SW6 1HS', 21, 'Defender', 77.0, 178.0, 1700, 1, 5, 'TEAM_003'),
('Nicolas', 'Jackson', 23, '101 Stamford Rd', 'SW6 1HS', 15, 'Forward', 78.0, 186.0, 1600, 9, 3, 'TEAM_003'),
('Robert', 'Sanchez', 27, '101 Stamford Rd', 'SW6 1HS', 1, 'Goalkeeper', 90.0, 197.0, 2000, 0, 0, 'TEAM_003'),
('Noni', 'Madueke', 22, '101 Stamford Rd', 'SW6 1HS', 11, 'Winger', 70.0, 182.0, 1500, 6, 4, 'TEAM_003'),
('Wesley', 'Fofana', 24, '101 Stamford Rd', 'SW6 1HS', 3, 'Defender', 76.0, 186.0, 1400, 1, 0, 'TEAM_003'),
('Mykhailo', 'Mudryk', 24, '101 Stamford Rd', 'SW6 1HS', 10, 'Winger', 71.0, 175.0, 1600, 5, 3, 'TEAM_003'),
('Christopher', 'Nkunku', 27, '101 Stamford Rd', 'SW6 1HS', 18, 'Forward', 73.0, 175.0, 1400, 7, 2, 'TEAM_003'),

-- Arsenal FC (TEAM_004)
('Gabriel', 'Jesus', 27, '45 Emirates Ln', 'N7 7AJ', 9, 'Forward', 73.0, 175.0, 2000, 10, 4, 'TEAM_004'),
('William', 'Saliba', 23, '67 Emirates Ln', 'N7 7AJ', 2, 'Defender', 85.0, 192.0, 2400, 3, 2, 'TEAM_004'),
('Bukayo', 'Saka', 23, '45 Emirates Ln', 'N7 7AJ', 7, 'Winger', 70.0, 178.0, 2300, 15, 10, 'TEAM_004'),
('Martin', 'Odegaard', 26, '45 Emirates Ln', 'N7 7AJ', 8, 'Midfielder', 68.0, 178.0, 2200, 8, 12, 'TEAM_004'),
('Declan', 'Rice', 26, '45 Emirates Ln', 'N7 7AJ', 41, 'Midfielder', 80.0, 185.0, 2100, 4, 5, 'TEAM_004'),
('David', 'Raya', 29, '45 Emirates Ln', 'N7 7AJ', 22, 'Goalkeeper', 83.0, 183.0, 2000, 0, 0, 'TEAM_004'),
('Gabriel', 'Magalhaes', 27, '45 Emirates Ln', 'N7 7AJ', 6, 'Defender', 87.0, 190.0, 2300, 4, 1, 'TEAM_004'),
('Kai', 'Havertz', 25, '45 Emirates Ln', 'N7 7AJ', 29, 'Forward', 83.0, 193.0, 1900, 10, 6, 'TEAM_004'),
('Ben', 'White', 27, '45 Emirates Ln', 'N7 7AJ', 4, 'Defender', 78.0, 185.0, 2100, 2, 4, 'TEAM_004'),
('Thomas', 'Partey', 31, '45 Emirates Ln', 'N7 7AJ', 5, 'Midfielder', 77.0, 185.0, 1700, 1, 2, 'TEAM_004'),
('Oleksandr', 'Zinchenko', 28, '45 Emirates Ln', 'N7 7AJ', 35, 'Defender', 64.0, 175.0, 1800, 1, 5, 'TEAM_004'),
('Leandro', 'Trossard', 30, '45 Emirates Ln', 'N7 7AJ', 19, 'Winger', 70.0, 172.0, 1600, 8, 3, 'TEAM_004'),
('Jurrien', 'Timber', 23, '45 Emirates Ln', 'N7 7AJ', 12, 'Defender', 73.0, 179.0, 1400, 1, 1, 'TEAM_004'),

-- Manchester City (TEAM_005)
('Jack', 'Grealish', 29, '90 Etihad Dr', 'M11 3FF', 10, 'Winger', 81.0, 180.0, 2100, 5, 7, 'TEAM_005'),
('Phil', 'Foden', 24, '112 Etihad Dr', 'M11 3FF', 47, 'Midfielder', 70.0, 171.0, 2200, 12, 8, 'TEAM_005'),
('Erling', 'Haaland', 24, '90 Etihad Dr', 'M11 3FF', 9, 'Forward', 88.0, 194.0, 2300, 25, 5, 'TEAM_005'),
('Kevin', 'De Bruyne', 33, '90 Etihad Dr', 'M11 3FF', 17, 'Midfielder', 70.0, 181.0, 2000, 7, 15, 'TEAM_005'),
('Rodri', '', 28, '90 Etihad Dr', 'M11 3FF', 16, 'Midfielder', 82.0, 191.0, 2100, 4, 3, 'TEAM_005'),
('Ederson', 'Moraes', 31, '90 Etihad Dr', 'M11 3FF', 31, 'Goalkeeper', 86.0, 188.0, 2200, 0, 0, 'TEAM_005'),
('Kyle', 'Walker', 34, '90 Etihad Dr', 'M11 3FF', 2, 'Defender', 83.0, 183.0, 2000, 1, 4, 'TEAM_005'),
('Ruben', 'Dias', 27, '90 Etihad Dr', 'M11 3FF', 3, 'Defender', 83.0, 187.0, 2300, 2, 1, 'TEAM_005'),
('Bernardo', 'Silva', 30, '90 Etihad Dr', 'M11 3FF', 20, 'Midfielder', 64.0, 173.0, 1900, 6, 8, 'TEAM_005'),
('John', 'Stones', 30, '90 Etihad Dr', 'M11 3FF', 5, 'Defender', 74.0, 188.0, 1800, 1, 2, 'TEAM_005'),
('Josko', 'Gvardiol', 23, '90 Etihad Dr', 'M11 3FF', 24, 'Defender', 80.0, 185.0, 1900, 3, 3, 'TEAM_005'),
('Ilkay', 'Gundogan', 34, '90 Etihad Dr', 'M11 3FF', 19, 'Midfielder', 80.0, 180.0, 1700, 4, 5, 'TEAM_005'),
('Jeremy', 'Doku', 22, '90 Etihad Dr', 'M11 3FF', 11, 'Winger', 68.0, 171.0, 1600, 7, 4, 'TEAM_005'),

-- Tottenham Hotspur (TEAM_006)
('Richarlison', 'de Andrade', 27, '145 Spurs Ave', 'N17 0BX', 9, 'Forward', 83.0, 184.0, 1900, 8, 3, 'TEAM_006'),
('Son', 'Heung-Min', 32, '145 Spurs Ave', 'N17 0BX', 7, 'Forward', 78.0, 183.0, 2300, 15, 8, 'TEAM_006'),
('James', 'Maddison', 28, '145 Spurs Ave', 'N17 0BX', 10, 'Midfielder', 73.0, 175.0, 2000, 6, 10, 'TEAM_006'),
('Dejan', 'Kulusevski', 24, '145 Spurs Ave', 'N17 0BX', 21, 'Winger', 75.0, 186.0, 1900, 7, 5, 'TEAM_006'),
('Guglielmo', 'Vicario', 28, '145 Spurs Ave', 'N17 0BX', 13, 'Goalkeeper', 83.0, 194.0, 2100, 0, 0, 'TEAM_006'),
('Pedro', 'Porro', 25, '145 Spurs Ave', 'N17 0BX', 23, 'Defender', 71.0, 173.0, 2000, 3, 7, 'TEAM_006'),
('Cristian', 'Romero', 26, '145 Spurs Ave', 'N17 0BX', 17, 'Defender', 79.0, 185.0, 2200, 2, 1, 'TEAM_006'),
('Yves', 'Bissouma', 28, '145 Spurs Ave', 'N17 0BX', 8, 'Midfielder', 78.0, 182.0, 1800, 1, 3, 'TEAM_006'),
('Destiny', 'Udogie', 22, '145 Spurs Ave', 'N17 0BX', 38, 'Defender', 74.0, 188.0, 1900, 2, 4, 'TEAM_006'),
('Micky', 'van de Ven', 23, '145 Spurs Ave', 'N17 0BX', 37, 'Defender', 81.0, 193.0, 2000, 1, 1, 'TEAM_006'),
('Rodrigo', 'Bentancur', 27, '145 Spurs Ave', 'N17 0BX', 30, 'Midfielder', 77.0, 187.0, 1700, 2, 3, 'TEAM_006'),
('Brennan', 'Johnson', 23, '145 Spurs Ave', 'N17 0BX', 22, 'Winger', 71.0, 179.0, 1600, 6, 3, 'TEAM_006'),
('Dominic', 'Solanke', 27, '145 Spurs Ave', 'N17 0BX', 19, 'Forward', 80.0, 187.0, 1700, 8, 2, 'TEAM_006'),

-- Everton FC (TEAM_007)
('Amadou', 'Onana', 23, '78 Goodison Rd', 'L4 4EL', 8, 'Midfielder', 84.0, 195.0, 1700, 3, 2, 'TEAM_007'),
('Jordan', 'Pickford', 30, '78 Goodison Rd', 'L4 4EL', 1, 'Goalkeeper', 77.0, 185.0, 2300, 0, 0, 'TEAM_007'),
('Dominic', 'Calvert-Lewin', 27, '78 Goodison Rd', 'L4 4EL', 9, 'Forward', 71.0, 187.0, 1900, 10, 3, 'TEAM_007'),
('James', 'Tarkowski', 32, '78 Goodison Rd', 'L4 4EL', 6, 'Defender', 81.0, 185.0, 2200, 2, 1, 'TEAM_007'),
('Abdoulaye', 'Doucoure', 32, '78 Goodison Rd', 'L4 4EL', 16, 'Midfielder', 75.0, 183.0, 2000, 5, 4, 'TEAM_007'),
('Ashley', 'Young', 39, '78 Goodison Rd', 'L4 4EL', 18, 'Defender', 65.0, 175.0, 1800, 1, 3, 'TEAM_007'),
('Jack', 'Harrison', 28, '78 Goodison Rd', 'L4 4EL', 11, 'Winger', 70.0, 175.0, 1700, 4, 5, 'TEAM_007'),
('Vitaliy', 'Mykolenko', 25, '78 Goodison Rd', 'L4 4EL', 19, 'Defender', 71.0, 180.0, 1900, 1, 2, 'TEAM_007'),
('Dwight', 'McNeil', 25, '78 Goodison Rd', 'L4 4EL', 7, 'Winger', 68.0, 183.0, 1800, 6, 6, 'TEAM_007'),
('Jarrad', 'Branthwaite', 22, '78 Goodison Rd', 'L4 4EL', 32, 'Defender', 82.0, 195.0, 2000, 2, 0, 'TEAM_007'),
('Idrissa', 'Gueye', 35, '78 Goodison Rd', 'L4 4EL', 27, 'Midfielder', 66.0, 174.0, 1700, 1, 1, 'TEAM_007'),
('Beto', '', 27, '78 Goodison Rd', 'L4 4EL', 14, 'Forward', 83.0, 194.0, 1500, 7, 1, 'TEAM_007'),
('Seamus', 'Coleman', 36, '78 Goodison Rd', 'L4 4EL', 23, 'Defender', 67.0, 177.0, 1600, 1, 2, 'TEAM_007'),

-- Leicester City (TEAM_008)
('Kiernan', 'Dewsbury-Hall', 26, '101 King Power St', 'LE2 7FL', 22, 'Midfielder', 70.0, 178.0, 1800, 4, 5, 'TEAM_008'),
('Jamie', 'Vardy', 38, '101 King Power St', 'LE2 7FL', 9, 'Forward', 74.0, 179.0, 1900, 12, 3, 'TEAM_008'),
('Wilfred', 'Ndidi', 28, '101 King Power St', 'LE2 7FL', 25, 'Midfielder', 74.0, 183.0, 2000, 2, 4, 'TEAM_008'),
('James', 'Justin', 26, '101 King Power St', 'LE2 7FL', 2, 'Defender', 80.0, 183.0, 1800, 1, 3, 'TEAM_008'),
('Mads', 'Hermansen', 24, '101 King Power St', 'LE2 7FL', 30, 'Goalkeeper', 82.0, 187.0, 2100, 0, 0, 'TEAM_008'),
('Harry', 'Winks', 29, '101 King Power St', 'LE2 7FL', 8, 'Midfielder', 65.0, 178.0, 1900, 1, 5, 'TEAM_008'),
('Victor', 'Kristiansen', 22, '101 King Power St', 'LE2 7FL', 21, 'Defender', 73.0, 181.0, 1700, 1, 2, 'TEAM_008'),
('Stephy', 'Mavididi', 26, '101 King Power St', 'LE2 7FL', 10, 'Winger', 71.0, 182.0, 1800, 7, 4, 'TEAM_008'),
('Wout', 'Faes', 26, '101 King Power St', 'LE2 7FL', 3, 'Defender', 84.0, 187.0, 2000, 2, 1, 'TEAM_008'),
('Abdul', 'Fatawu', 20, '101 King Power St', 'LE2 7FL', 18, 'Winger', 68.0, 177.0, 1600, 6, 3, 'TEAM_008'),
('Bobby', 'De Cordova-Reid', 32, '101 King Power St', 'LE2 7FL', 29, 'Forward', 70.0, 170.0, 1700, 5, 2, 'TEAM_008'),
('Patson', 'Daka', 26, '101 King Power St', 'LE2 7FL', 20, 'Forward', 76.0, 183.0, 1500, 8, 1, 'TEAM_008'),
('Ricardo', 'Pereira', 31, '101 King Power St', 'LE2 7FL', 17, 'Defender', 70.0, 174.0, 1800, 1, 4, 'TEAM_008'),

-- Leeds United (TEAM_009)
('Crysencio', 'Summerville', 23, '67 Elland Rd', 'LS11 0ES', 10, 'Winger', 65.0, 174.0, 1900, 8, 3, 'TEAM_009'),
('Illan', 'Meslier', 24, '67 Elland Rd', 'LS11 0ES', 1, 'Goalkeeper', 74.0, 196.0, 2100, 0, 0, 'TEAM_009'),
('Pascal', 'Struijk', 25, '67 Elland Rd', 'LS11 0ES', 6, 'Defender', 82.0, 190.0, 2000, 2, 1, 'TEAM_009'),
('Ethan', 'Ampadu', 24, '67 Elland Rd', 'LS11 0ES', 4, 'Midfielder', 78.0, 182.0, 1900, 1, 3, 'TEAM_009'),
('Wilfried', 'Gnonto', 21, '67 Elland Rd', 'LS11 0ES', 29, 'Winger', 71.0, 170.0, 1800, 7, 4, 'TEAM_009'),
('Joe', 'Rodon', 27, '67 Elland Rd', 'LS11 0ES', 5, 'Defender', 87.0, 193.0, 2000, 1, 0, 'TEAM_009'),
('Brenden', 'Aaronson', 24, '67 Elland Rd', 'LS11 0ES', 7, 'Midfielder', 68.0, 178.0, 1700, 4, 5, 'TEAM_009'),
('Patrick', 'Bamford', 31, '67 Elland Rd', 'LS11 0ES', 9, 'Forward', 71.0, 185.0, 1600, 6, 2, 'TEAM_009'),
('Junior', 'Firpo', 28, '67 Elland Rd', 'LS11 0ES', 3, 'Defender', 78.0, 178.0, 1800, 1, 4, 'TEAM_009'),
('Daniel', 'James', 27, '67 Elland Rd', 'LS11 0ES', 20, 'Winger', 63.0, 170.0, 1700, 5, 3, 'TEAM_009'),
('Mateo', 'Joseph', 21, '67 Elland Rd', 'LS11 0ES', 19, 'Forward', 77.0, 185.0, 1500, 7, 1, 'TEAM_009'),
('Max', 'Wober', 27, '67 Elland Rd', 'LS11 0ES', 25, 'Defender', 82.0, 186.0, 1700, 1, 1, 'TEAM_009'),
('Joel', 'Piroe', 25, '67 Elland Rd', 'LS11 0ES', 10, 'Forward', 79.0, 181.0, 1600, 8, 2, 'TEAM_009'),

-- West Ham United (TEAM_010)
('Michail', 'Antonio', 34, '89 London Stadium Way', 'E20 2ST', 9, 'Forward', 82.0, 180.0, 2000, 9, 2, 'TEAM_010'),
('Jarrod', 'Bowen', 28, '89 London Stadium Way', 'E20 2ST', 20, 'Forward', 70.0, 175.0, 2100, 12, 6, 'TEAM_010'),
('Lucas', 'Paqueta', 27, '89 London Stadium Way', 'E20 2ST', 10, 'Midfielder', 72.0, 180.0, 1900, 5, 7, 'TEAM_010'),
('Edson', 'Alvarez', 27, '89 London Stadium Way', 'E20 2ST', 19, 'Midfielder', 73.0, 187.0, 2000, 2, 3, 'TEAM_010'),
('Alphonse', 'Areola', 31, '89 London Stadium Way', 'E20 2ST', 23, 'Goalkeeper', 94.0, 195.0, 2100, 0, 0, 'TEAM_010'),
('Kurt', 'Zouma', 30, '89 London Stadium Way', 'E20 2ST', 4, 'Defender', 96.0, 190.0, 2000, 2, 1, 'TEAM_010'),
('Emerson', 'Palmieri', 30, '89 London Stadium Way', 'E20 2ST', 33, 'Defender', 79.0, 176.0, 1900, 1, 4, 'TEAM_010'),
('Tomas', 'Soucek', 30, '89 London Stadium Way', 'E20 2ST', 28, 'Midfielder', 86.0, 192.0, 1800, 4, 2, 'TEAM_010'),
('Vladimir', 'Coufal', 32, '89 London Stadium Way', 'E20 2ST', 5, 'Defender', 76.0, 179.0, 1900, 1, 3, 'TEAM_010'),
('Max', 'Kilman', 27, '89 London Stadium Way', 'E20 2ST', 26, 'Defender', 89.0, 194.0, 2000, 1, 0, 'TEAM_010'),
('Mohammed', 'Kudus', 24, '89 London Stadium Way', 'E20 2ST', 14, 'Winger', 70.0, 177.0, 1700, 8, 5, 'TEAM_010'),
('Crysencio', 'Summerville', 23, '89 London Stadium Way', 'E20 2ST', 7, 'Winger', 65.0, 174.0, 1600, 6, 3, 'TEAM_010'),
('Danny', 'Ings', 32, '89 London Stadium Way', 'E20 2ST', 18, 'Forward', 73.0, 178.0, 1500, 5, 1, 'TEAM_010'),

-- Newcastle United (TEAM_011)
('Valentino', 'Livramento', 22, '112 St James St', 'NE1 4NF', 21, 'Defender', 68.0, 173.0, 1600, 1, 3, 'TEAM_011'),
('Alexander', 'Isak', 25, '112 St James St', 'NE1 4NF', 14, 'Forward', 77.0, 192.0, 2000, 15, 4, 'TEAM_011'),
('Bruno', 'Guimaraes', 27, '112 St James St', 'NE1 4NF', 39, 'Midfielder', 74.0, 182.0, 2100, 5, 7, 'TEAM_011'),
('Anthony', 'Gordon', 24, '112 St James St', 'NE1 4NF', 10, 'Winger', 72.0, 186.0, 1900, 10, 6, 'TEAM_011'),
('Nick', 'Pope', 32, '112 St James St', 'NE1 4NF', 22, 'Goalkeeper', 76.0, 191.0, 2100, 0, 0, 'TEAM_011'),
('Fabian', 'Schar', 33, '112 St James St', 'NE1 4NF', 5, 'Defender', 84.0, 188.0, 2000, 2, 1, 'TEAM_011'),
('Sven', 'Botman', 25, '112 St James St', 'NE1 4NF', 4, 'Defender', 85.0, 195.0, 1900, 1, 0, 'TEAM_011'),
('Joelinton', '', 28, '112 St James St', 'NE1 4NF', 7, 'Midfielder', 81.0, 186.0, 1800, 4, 3, 'TEAM_011'),
('Dan', 'Burn', 32, '112 St James St', 'NE1 4NF', 33, 'Defender', 87.0, 198.0, 1900, 1, 2, 'TEAM_011'),
('Sean', 'Longstaff', 27, '112 St James St', 'NE1 4NF', 36, 'Midfielder', 65.0, 180.0, 1800, 3, 4, 'TEAM_011'),
('Miguel', 'Almiron', 31, '112 St James St', 'NE1 4NF', 24, 'Winger', 70.0, 174.0, 1700, 6, 3, 'TEAM_011'),
('Jacob', 'Murphy', 30, '112 St James St', 'NE1 4NF', 23, 'Winger', 71.0, 176.0, 1600, 5, 5, 'TEAM_011'),
('Lewis', 'Hall', 20, '112 St James St', 'NE1 4NF', 20, 'Defender', 70.0, 179.0, 1500, 1, 2, 'TEAM_011'),

-- Aston Villa (TEAM_012)
('Jacob', 'Ramsey', 23, '56 Villa Park Rd', 'B6 6HE', 8, 'Midfielder', 72.0, 180.0, 1800, 6, 4, 'TEAM_012'),
('Ollie', 'Watkins', 29, '56 Villa Park Rd', 'B6 6HE', 11, 'Forward', 70.0, 180.0, 2100, 15, 6, 'TEAM_012'),
('Emiliano', 'Martinez', 32, '56 Villa Park Rd', 'B6 6HE', 1, 'Goalkeeper', 88.0, 195.0, 2200, 0, 0, 'TEAM_012'),
('Leon', 'Bailey', 27, '56 Villa Park Rd', 'B6 6HE', 31, 'Winger', 70.0, 178.0, 1900, 8, 7, 'TEAM_012'),
('Youri', 'Tielemans', 27, '56 Villa Park Rd', 'B6 6HE', 8, 'Midfielder', 72.0, 176.0, 2000, 4, 5, 'TEAM_012'),
('Ezri', 'Konsa', 27, '56 Villa Park Rd', 'B6 6HE', 4, 'Defender', 77.0, 183.0, 2100, 1, 2, 'TEAM_012'),
('John', 'McGinn', 30, '56 Villa Park Rd', 'B6 6HE', 7, 'Midfielder', 68.0, 178.0, 2000, 5, 4, 'TEAM_012'),
('Pau', 'Torres', 28, '56 Villa Park Rd', 'B6 6HE', 14, 'Defender', 81.0, 191.0, 1900, 2, 1, 'TEAM_012'),
('Morgan', 'Rogers', 22, '56 Villa Park Rd', 'B6 6HE', 27, 'Winger', 75.0, 187.0, 1700, 6, 3, 'TEAM_012'),
('Tyrone', 'Mings', 31, '56 Villa Park Rd', 'B6 6HE', 5, 'Defender', 77.0, 195.0, 1800, 1, 0, 'TEAM_012'),
('Lucas', 'Digne', 31, '56 Villa Park Rd', 'B6 6HE', 12, 'Defender', 74.0, 178.0, 1700, 1, 4, 'TEAM_012'),
('Amadou', 'Onana', 23, '56 Villa Park Rd', 'B6 6HE', 22, 'Midfielder', 84.0, 195.0, 1800, 3, 2, 'TEAM_012'),
('Jhon', 'Duran', 21, '56 Villa Park Rd', 'B6 6HE', 9, 'Forward', 73.0, 186.0, 1500, 7, 1, 'TEAM_012'),

-- Brighton & Hove Albion (TEAM_013)
('Evan', 'Ferguson', 20, '90 Amex Dr', 'BN1 9BL', 9, 'Forward', 78.0, 183.0, 1500, 7, 1, 'TEAM_013'),
('Lewis', 'Dunk', 33, '90 Amex Dr', 'BN1 9BL', 5, 'Defender', 88.0, 192.0, 2200, 2, 1, 'TEAM_013'),
('Joao', 'Pedro', 23, '90 Amex Dr', 'BN1 9BL', 9, 'Forward', 71.0, 182.0, 1900, 10, 4, 'TEAM_013'),
('Kaoru', 'Mitoma', 27, '90 Amex Dr', 'BN1 9BL', 22, 'Winger', 71.0, 178.0, 2000, 8, 6, 'TEAM_013'),
('Pervis', 'Estupinan', 27, '90 Amex Dr', 'BN1 9BL', 30, 'Defender', 73.0, 175.0, 1900, 2, 5, 'TEAM_013'),
('Jason', 'Steele', 34, '90 Amex Dr', 'BN1 9BL', 1, 'Goalkeeper', 79.0, 188.0, 2100, 0, 0, 'TEAM_013'),
('Billy', 'Gilmour', 23, '90 Amex Dr', 'BN1 9BL', 11, 'Midfielder', 65.0, 170.0, 1800, 1, 4, 'TEAM_013'),
('Solly', 'March', 30, '90 Amex Dr', 'BN1 9BL', 7, 'Winger', 72.0, 180.0, 1700, 5, 3, 'TEAM_013'),
('Adam', 'Webster', 30, '90 Amex Dr', 'BN1 9BL', 4, 'Defender', 75.0, 191.0, 1800, 1, 0, 'TEAM_013'),
('Yankuba', 'Minteh', 20, '90 Amex Dr', 'BN1 9BL', 17, 'Winger', 68.0, 180.0, 1600, 6, 3, 'TEAM_013'),
('Jack', 'Hinshelwood', 19, '90 Amex Dr', 'BN1 9BL', 29, 'Midfielder', 70.0, 178.0, 1500, 2, 2, 'TEAM_013'),
('Danny', 'Welbeck', 34, '90 Amex Dr', 'BN1 9BL', 18, 'Forward', 78.0, 185.0, 1700, 7, 2, 'TEAM_013'),
('Carlos', 'Baleba', 21, '90 Amex Dr', 'BN1 9BL', 20, 'Midfielder', 76.0, 183.0, 1600, 1, 3, 'TEAM_013'),

-- Wolverhampton Wanderers (TEAM_014)
('Hwang', 'Hee-Chan', 29, '78 Molineux St', 'WV1 4QR', 11, 'Forward', 77.0, 177.0, 2000, 10, 3, 'TEAM_014'),
('Jose', 'Sa', 32, '78 Molineux St', 'WV1 4QR', 1, 'Goalkeeper', 84.0, 192.0, 2100, 0, 0, 'TEAM_014'),
('Matheus', 'Cunha', 25, '78 Molineux St', 'WV1 4QR', 10, 'Forward', 76.0, 184.0, 1900, 8, 5, 'TEAM_014'),
('Joao', 'Gomes', 24, '78 Molineux St', 'WV1 4QR', 8, 'Midfielder', 74.0, 176.0, 2000, 2, 3, 'TEAM_014'),
('Nelson', 'Semedo', 31, '78 Molineux St', 'WV1 4QR', 22, 'Defender', 67.0, 177.0, 1900, 1, 4, 'TEAM_014'),
('Mario', 'Lemina', 31, '78 Molineux St', 'WV1 4QR', 5, 'Midfielder', 80.0, 184.0, 1800, 3, 2, 'TEAM_014'),
('Craig', 'Dawson', 34, '78 Molineux St', 'WV1 4QR', 15, 'Defender', 82.0, 188.0, 2000, 2, 0, 'TEAM_014'),
('Rayan', 'Ait-Nouri', 23, '78 Molineux St', 'WV1 4QR', 3, 'Defender', 70.0, 179.0, 1900, 2, 5, 'TEAM_014'),
('Toti', 'Gomes', 26, '78 Molineux St', 'WV1 4QR', 24, 'Defender', 83.0, 187.0, 1800, 1, 1, 'TEAM_014'),
('Jorgen', 'Strand Larsen', 25, '78 Molineux St', 'WV1 4QR', 9, 'Forward', 79.0, 193.0, 1700, 7, 2, 'TEAM_014'),
('Tommy', 'Doyle', 23, '78 Molineux St', 'WV1 4QR', 20, 'Midfielder', 70.0, 178.0, 1600, 1, 3, 'TEAM_014'),
('Santiago', 'Bueno', 26, '78 Molineux St', 'WV1 4QR', 4, 'Defender', 76.0, 190.0, 1700, 1, 0, 'TEAM_014'),
('Pablo', 'Sarabia', 32, '78 Molineux St', 'WV1 4QR', 21, 'Winger', 70.0, 174.0, 1600, 5, 4, 'TEAM_014'),

-- Southampton FC (TEAM_015)
('Kyle', 'Walker-Peters', 27, '123 St Marys Rd', 'SO14 0AH', 2, 'Defender', 64.0, 173.0, 2100, 1, 4, 'TEAM_015'),
('Adam', 'Armstrong', 28, '123 St Marys Rd', 'SO14 0AH', 9, 'Forward', 69.0, 172.0, 1900, 10, 3, 'TEAM_015'),
('Aaron', 'Ramsdale', 26, '123 St Marys Rd', 'SO14 0AH', 30, 'Goalkeeper', 77.0, 190.0, 2100, 0, 0, 'TEAM_015'),
('Flynn', 'Downes', 26, '123 St Marys Rd', 'SO14 0AH', 4, 'Midfielder', 70.0, 173.0, 2000, 2, 4, 'TEAM_015'),
('Jan', 'Bednarek', 28, '123 St Marys Rd', 'SO14 0AH', 35, 'Defender', 77.0, 189.0, 2000, 1, 0, 'TEAM_015'),
('Will', 'Smallbone', 25, '123 St Marys Rd', 'SO14 0AH', 16, 'Midfielder', 70.0, 183.0, 1800, 3, 5, 'TEAM_015'),
('Taylor', 'Harwood-Bellis', 23, '123 St Marys Rd', 'SO14 0AH', 6, 'Defender', 82.0, 188.0, 1900, 1, 1, 'TEAM_015'),
('Joe', 'Aribo', 28, '123 St Marys Rd', 'SO14 0AH', 7, 'Midfielder', 76.0, 183.0, 1700, 4, 3, 'TEAM_015'),
('Yukinari', 'Sugawara', 24, '123 St Marys Rd', 'SO14 0AH', 3, 'Defender', 69.0, 179.0, 1800, 1, 3, 'TEAM_015'),
('Ben', 'Brereton Diaz', 25, '123 St Marys Rd', 'SO14 0AH', 17, 'Forward', 73.0, 185.0, 1600, 6, 2, 'TEAM_015'),
('Kamaldeen', 'Sulemana', 23, '123 St Marys Rd', 'SO14 0AH', 20, 'Winger', 70.0, 174.0, 1500, 5, 3, 'TEAM_015'),
('Mateus', 'Fernandes', 20, '123 St Marys Rd', 'SO14 0AH', 18, 'Midfielder', 68.0, 178.0, 1600, 2, 2, 'TEAM_015'),
('Jack', 'Stephens', 31, '123 St Marys Rd', 'SO14 0AH', 5, 'Defender', 75.0, 185.0, 1700, 1, 0, 'TEAM_015'),

-- Crystal Palace (TEAM_016)
('Eberechi', 'Eze', 26, '12 Selhurst Park', 'SE25 6PU', 10, 'Midfielder', 70.0, 178.0, 2000, 8, 6, 'TEAM_016'),
('Marc', 'Guehi', 24, '12 Selhurst Park', 'SE25 6PU', 6, 'Defender', 82.0, 182.0, 2100, 2, 1, 'TEAM_016'),
('Jean-Philippe', 'Mateta', 27, '12 Selhurst Park', 'SE25 6PU', 14, 'Forward', 84.0, 192.0, 1900, 12, 3, 'TEAM_016'),
('Dean', 'Henderson', 27, '12 Selhurst Park', 'SE25 6PU', 1, 'Goalkeeper', 85.0, 188.0, 2000, 0, 0, 'TEAM_016'),
('Adam', 'Wharton', 20, '12 Selhurst Park', 'SE25 6PU', 20, 'Midfielder', 68.0, 182.0, 1800, 3, 4, 'TEAM_016'),
('Tyrick', 'Mitchell', 25, '12 Selhurst Park', 'SE25 6PU', 3, 'Defender', 70.0, 175.0, 1900, 1, 3, 'TEAM_016'),
('Daniel', 'Munoz', 28, '12 Selhurst Park', 'SE25 6PU', 17, 'Defender', 73.0, 180.0, 2000, 2, 2, 'TEAM_016'),
('Jeffrey', 'Schlupp', 32, '12 Selhurst Park', 'SE25 6PU', 15, 'Midfielder', 72.0, 178.0, 1700, 4, 2, 'TEAM_016'),
('Odsonne', 'Edouard', 27, '12 Selhurst Park', 'SE25 6PU', 22, 'Forward', 87.0, 187.0, 1600, 6, 1, 'TEAM_016'),
('Nathaniel', 'Clyne', 33, '12 Selhurst Park', 'SE25 6PU', 2, 'Defender', 67.0, 175.0, 1800, 1, 1, 'TEAM_016'),
('Will', 'Hughes', 29, '12 Selhurst Park', 'SE25 6PU', 19, 'Midfielder', 65.0, 182.0, 1700, 1, 3, 'TEAM_016'),
('Cheick', 'Doucoure', 25, '12 Selhurst Park', 'SE25 6PU', 8, 'Midfielder', 73.0, 180.0, 1900, 2, 2, 'TEAM_016'),
('Ismaila', 'Sarr', 27, '12 Selhurst Park', 'SE25 6PU', 11, 'Winger', 76.0, 185.0, 1600, 7, 4, 'TEAM_016'),

-- Brentford FC (TEAM_017)
('Bryan', 'Mbeumo', 25, '27 Griffin Park', 'TW8 0NT', 19, 'Forward', 75.0, 171.0, 2000, 10, 5, 'TEAM_017'),
('Ivan', 'Toney', 28, '27 Griffin Park', 'TW8 0NT', 17, 'Forward', 80.0, 185.0, 1900, 12, 4, 'TEAM_017'),
('Mark', 'Flekken', 31, '27 Griffin Park', 'TW8 0NT', 1, 'Goalkeeper', 87.0, 195.0, 2100, 0, 0, 'TEAM_017'),
('Vitaly', 'Janelt', 26, '27 Griffin Park', 'TW8 0NT', 27, 'Midfielder', 79.0, 184.0, 1900, 3, 3, 'TEAM_017'),
('Nathan', 'Collins', 23, '27 Griffin Park', 'TW8 0NT', 22, 'Defender', 81.0, 193.0, 2000, 1, 1, 'TEAM_017'),
('Christian', 'Norgaard', 30, '27 Griffin Park', 'TW8 0NT', 6, 'Midfielder', 77.0, 187.0, 1800, 2, 2, 'TEAM_017'),
('Ethan', 'Pinnock', 31, '27 Griffin Park', 'TW8 0NT', 5, 'Defender', 84.0, 194.0, 2100, 2, 0, 'TEAM_017'),
('Mads', 'Roerslev', 25, '27 Griffin Park', 'TW8 0NT', 30, 'Defender', 77.0, 184.0, 1800, 1, 3, 'TEAM_017'),
('Yoane', 'Wissa', 28, '27 Griffin Park', 'TW8 0NT', 11, 'Forward', 73.0, 176.0, 1700, 8, 3, 'TEAM_017'),
('Rico', 'Henry', 27, '27 Griffin Park', 'TW8 0NT', 3, 'Defender', 67.0, 170.0, 1900, 1, 2, 'TEAM_017'),
('Mathias', 'Jensen', 29, '27 Griffin Park', 'TW8 0NT', 8, 'Midfielder', 68.0, 180.0, 1800, 2, 4, 'TEAM_017'),
('Kevin', 'Schade', 23, '27 Griffin Park', 'TW8 0NT', 9, 'Winger', 74.0, 183.0, 1600, 6, 2, 'TEAM_017'),
('Aaron', 'Hickey', 22, '27 Griffin Park', 'TW8 0NT', 2, 'Defender', 72.0, 175.0, 1700, 1, 1, 'TEAM_017'),

-- Fulham FC (TEAM_018)
('Antonee', 'Robinson', 27, '10 Craven Cottage', 'SW6 6HH', 33, 'Defender', 70.0, 183.0, 2100, 1, 5, 'TEAM_018'),
('Bernd', 'Leno', 32, '10 Craven Cottage', 'SW6 6HH', 17, 'Goalkeeper', 83.0, 190.0, 2200, 0, 0, 'TEAM_018'),
('Andreas', 'Pereira', 29, '10 Craven Cottage', 'SW6 6HH', 18, 'Midfielder', 71.0, 178.0, 2000, 5, 7, 'TEAM_018'),
('Raul', 'Jimenez', 33, '10 Craven Cottage', 'SW6 6HH', 7, 'Forward', 76.0, 185.0, 1900, 10, 3, 'TEAM_018'),
('Calvin', 'Bassey', 25, '10 Craven Cottage', 'SW6 6HH', 3, 'Defender', 80.0, 185.0, 2000, 1, 1, 'TEAM_018'),
('Emile', 'Smith Rowe', 24, '10 Craven Cottage', 'SW6 6HH', 32, 'Midfielder', 72.0, 182.0, 1800, 6, 4, 'TEAM_018'),
('Issa', 'Diop', 28, '10 Craven Cottage', 'SW6 6HH', 5, 'Defender', 92.0, 194.0, 1900, 2, 0, 'TEAM_018'),
('Adama', 'Traore', 29, '10 Craven Cottage', 'SW6 6HH', 11, 'Winger', 86.0, 178.0, 1700, 5, 3, 'TEAM_018'),
('Sasa', 'Lukic', 28, '10 Craven Cottage', 'SW6 6HH', 20, 'Midfielder', 77.0, 183.0, 1800, 2, 2, 'TEAM_018'),
('Kenny', 'Tete', 29, '10 Craven Cottage', 'SW6 6HH', 2, 'Defender', 71.0, 180.0, 1900, 1, 3, 'TEAM_018'),
('Rodrigo', 'Muniz', 23, '10 Craven Cottage', 'SW6 6HH', 9, 'Forward', 79.0, 185.0, 1600, 8, 2, 'TEAM_018'),
('Harrison', 'Reed', 30, '10 Craven Cottage', 'SW6 6HH', 6, 'Midfielder', 72.0, 174.0, 1700, 1, 3, 'TEAM_018'),
('Tom', 'Cairney', 34, '10 Craven Cottage', 'SW6 6HH', 10, 'Midfielder', 72.0, 185.0, 1600, 3, 4, 'TEAM_018'),

-- Nottingham Forest (TEAM_019)
('Chris', 'Wood', 33, '1 City Ground', 'NG2 5FJ', 11, 'Forward', 81.0, 191.0, 2000, 12, 3, 'TEAM_019'),
('Morgan', 'Gibbs-White', 25, '1 City Ground', 'NG2 5FJ', 10, 'Midfielder', 70.0, 178.0, 2100, 6, 8, 'TEAM_019'),
('Matz', 'Sels', 33, '1 City Ground', 'NG2 5FJ', 26, 'Goalkeeper', 84.0, 188.0, 2200, 0, 0, 'TEAM_019'),
('Anthony', 'Elanga', 22, '1 City Ground', 'NG2 5FJ', 21, 'Winger', 71.0, 178.0, 1900, 7, 5, 'TEAM_019'),
('Neco', 'Williams', 23, '1 City Ground', 'NG2 5FJ', 7, 'Defender', 72.0, 183.0, 2000, 1, 4, 'TEAM_019'),
('Murillo', '', 22, '1 City Ground', 'NG2 5FJ', 40, 'Defender', 78.0, 182.0, 2100, 2, 1, 'TEAM_019'),
('Callum', 'Hudson-Odoi', 24, '1 City Ground', 'NG2 5FJ', 14, 'Winger', 76.0, 182.0, 1800, 6, 3, 'TEAM_019'),
('Nikola', 'MilENovic', 27, '1 City Ground', 'NG2 5FJ', 34, 'Defender', 92.0, 195.0, 2000, 2, 0, 'TEAM_019'),
('Ibrahim', 'Sangare', 27, '1 City Ground', 'NG2 5FJ', 6, 'Midfielder', 77.0, 191.0, 1800, 1, 2, 'TEAM_019'),
('Ola', 'Aina', 28, '1 City Ground', 'NG2 5FJ', 19, 'Defender', 82.0, 184.0, 1900, 1, 3, 'TEAM_019'),
('Elliot', 'Anderson', 22, '1 City Ground', 'NG2 5FJ', 8, 'Midfielder', 72.0, 178.0, 1700, 3, 4, 'TEAM_019'),
('Taiwo', 'Awoniyi', 27, '1 City Ground', 'NG2 5FJ', 9, 'Forward', 84.0, 183.0, 1600, 8, 2, 'TEAM_019'),
('Ryan', 'Yates', 27, '1 City Ground', 'NG2 5FJ', 22, 'Midfielder', 77.0, 190.0, 1800, 2, 1, 'TEAM_019'),

-- AFC Bournemouth (TEAM_020)
('Dominic', 'Solanke', 27, '33 Vitality Stadium', 'BH7 7AF', 9, 'Forward', 80.0, 187.0, 2100, 15, 4, 'TEAM_020'),
('Neto', '', 35, '33 Vitality Stadium', 'BH7 7AF', 1, 'Goalkeeper', 84.0, 190.0, 2200, 0, 0, 'TEAM_020'),
('Antoine', 'Semenyo', 25, '33 Vitality Stadium', 'BH7 7AF', 24, 'Winger', 75.0, 185.0, 1900, 8, 5, 'TEAM_020'),
('Lewis', 'Cook', 28, '33 Vitality Stadium', 'BH7 7AF', 4, 'Midfielder', 71.0, 175.0, 2000, 2, 4, 'TEAM_020'),
('Lloyd', 'Kelly', 26, '33 Vitality Stadium', 'BH7 7AF', 5, 'Defender', 70.0, 190.0, 1900, 1, 2, 'TEAM_020'),
('Justin', 'Kluivert', 25, '33 Vitality Stadium', 'BH7 7AF', 11, 'Winger', 66.0, 171.0, 1800, 6, 3, 'TEAM_020'),
('Adam', 'Smith', 33, '33 Vitality Stadium', 'BH7 7AF', 15, 'Defender', 78.0, 180.0, 1800, 1, 3, 'TEAM_020'),
('Ryan', 'Christie', 30, '33 Vitality Stadium', 'BH7 7AF', 8, 'Midfielder', 70.0, 178.0, 1900, 3, 5, 'TEAM_020'),
('Marcos', 'Senesi', 27, '33 Vitality Stadium', 'BH7 7AF', 3, 'Defender', 80.0, 185.0, 2000, 2, 1, 'TEAM_020'),
('Evanilson', '', 25, '33 Vitality Stadium', 'BH7 7AF', 21, 'Forward', 80.0, 183.0, 1700, 7, 2, 'TEAM_020'),
('Milos', 'Kerkez', 21, '33 Vitality Stadium', 'BH7 7AF', 17, 'Defender', 71.0, 180.0, 1900, 1, 4, 'TEAM_020'),
('Dango', 'Ouattara', 23, '33 Vitality Stadium', 'BH7 7AF', 16, 'Winger', 71.0, 177.0, 1600, 5, 3, 'TEAM_020'),
('Illia', 'Zabarnyi', 22, '33 Vitality Stadium', 'BH7 7AF', 27, 'Defender', 81.0, 189.0, 2000, 1, 0, 'TEAM_020'),

-- Burnley FC (TEAM_021)
('Josh', 'Brownhill', 29, '55 Turf Moor', 'BB10 4BX', 8, 'Midfielder', 69.0, 180.0, 2100, 5, 6, 'TEAM_021'),
('James', 'Trafford', 22, '55 Turf Moor', 'BB10 4BX', 1, 'Goalkeeper', 83.0, 197.0, 2200, 0, 0, 'TEAM_021'),
('Lyle', 'Foster', 24, '55 Turf Moor', 'BB10 4BX', 17, 'Forward', 70.0, 185.0, 1900, 8, 3, 'TEAM_021'),
('Sander', 'Berge', 27, '55 Turf Moor', 'BB10 4BX', 16, 'Midfielder', 83.0, 195.0, 2000, 3, 4, 'TEAM_021'),
('Dara', 'O''Shea', 25, '55 Turf Moor', 'BB10 4BX', 2, 'Defender', 77.0, 188.0, 2100, 2, 1, 'TEAM_021'),
('Anass', 'Zaroury', 24, '55 Turf Moor', 'BB10 4BX', 19, 'Winger', 70.0, 180.0, 1800, 6, 4, 'TEAM_021'),
('Jordan', 'Bey Jordan', 28, '55 Turf Moor', 'BB10 4BX', 23, 'Defender', 75.0, 184.0, 1900, 1, 2, 'TEAM_021'),
('Zeki', 'Amdouni', 24, '55 Turf Moor', 'BB10 4BX', 25, 'Forward', 79.0, 185.0, 1700, 7, 2, 'TEAM_021'),
('Vitinho', '', 25, '55 Turf Moor', 'BB10 4BX', 22, 'Defender', 75.0, 182.0, 1800, 1, 3, 'TEAM_021'),
('Aaron', 'Ramsey', 22, '55 Turf Moor', 'BB10 4BX', 10, 'Midfielder', 72.0, 180.0, 1700, 4, 3, 'TEAM_021'),
('Connor', 'Roberts', 29, '55 Turf Moor', 'BB10 4BX', 14, 'Defender', 71.0, 175.0, 1800, 1, 2, 'TEAM_021'),
('Jay', 'Rodriguez', 35, '55 Turf Moor', 'BB10 4BX', 9, 'Forward', 80.0, 185.0, 1600, 5, 1, 'TEAM_021'),
('Nathan', 'Redmond', 31, '55 Turf Moor', 'BB10 4BX', 15, 'Winger', 69.0, 173.0, 1700, 3, 4, 'TEAM_021'),

-- Sheffield United (TEAM_022)
('Oli', 'McBurnie', 28, '2 Bramall Lane', 'S2 4SU', 9, 'Forward', 79.0, 188.0, 2000, 10, 3, 'TEAM_022'),
('Anel', 'Ahmedhodzic', 25, '2 Bramall Lane', 'S2 4SU', 15, 'Defender', 84.0, 195.0, 2100, 2, 1, 'TEAM_022'),
('Wes', 'Foderingham', 34, '2 Bramall Lane', 'S2 4SU', 1, 'Goalkeeper', 75.0, 188.0, 2100, 0, 0, 'TEAM_022'),
('Vini', 'Souza', 25, '2 Bramall Lane', 'S2 4SU', 21, 'Midfielder', 80.0, 187.0, 1900, 2, 3, 'TEAM_022'),
('Gustavo', 'Hamer', 27, '2 Bramall Lane', 'S2 4SU', 8, 'Midfielder', 69.0, 169.0, 2000, 5, 5, 'TEAM_022'),
('Jack', 'Robinson', 31, '2 Bramall Lane', 'S2 4SU', 5, 'Defender', 73.0, 180.0, 1900, 1, 1, 'TEAM_022'),
('Jayden', 'Bogle', 24, '2 Bramall Lane', 'S2 4SU', 3, 'Defender', 69.0, 178.0, 1800, 1, 3, 'TEAM_022'),
('Cameron', 'Archer', 23, '2 Bramall Lane', 'S2 4SU', 10, 'Forward', 72.0, 175.0, 1700, 7, 2, 'TEAM_022'),
('George', 'Baldock', 31, '2 Bramall Lane', 'S2 4SU', 2, 'Defender', 71.0, 178.0, 1800, 1, 2, 'TEAM_022'),
('Andre', 'Brooks', 21, '2 Bramall Lane', 'S2 4SU', 25, 'Midfielder', 68.0, 180.0, 1600, 2, 2, 'TEAM_022'),
('Oliver', 'Arblaster', 20, '2 Bramall Lane', 'S2 4SU', 4, 'Midfielder', 70.0, 175.0, 1500, 3, 3, 'TEAM_022'),
('Ben', 'Osborn', 30, '2 Bramall Lane', 'S2 4SU', 23, 'Midfielder', 75.0, 176.0, 1700, 2, 4, 'TEAM_022'),
('Rhian', 'Brewster', 24, '2 Bramall Lane', 'S2 4SU', 7, 'Forward', 75.0, 180.0, 1600, 6, 1, 'TEAM_022');

INSERT INTO club_doctor (com_first_name, com_last_name, age, com_street, postal_code, doctor_title, team_id) VALUES
('Sarah', 'Jones', 45, '90 Old Trafford Rd', 'M16 0RA', 'MD', 'TEAM_001'),
('David', 'Brown', 50, '22 Anfield St', 'L4 0TH', 'MD', 'TEAM_002'),
('Emily', 'Clark', 38, '33 Stamford Rd', 'SW6 1HS', 'MD', 'TEAM_003'),
('James', 'Wilson', 55, '44 Emirates Ln', 'N7 7AJ', 'MD', 'TEAM_004'),
('Laura', 'Taylor', 42, '55 Etihad Dr', 'M11 3FF', 'MD', 'TEAM_005'),
('Robert', 'Davis', 47, '66 Spurs Ave', 'N17 0BX', 'MD', 'TEAM_006'),
('Anna', 'Miller', 39, '77 Goodison Rd', 'L4 4EL', 'MD', 'TEAM_007'),
('Thomas', 'White', 52, '88 King Power St', 'LE2 7FL', 'MD', 'TEAM_008'),
('Sophie', 'Green', 41, '99 Elland Rd', 'LS11 0ES', 'MD', 'TEAM_009'),
('Mark', 'Harris', 48, '11 London Stadium Way', 'E20 2ST', 'MD', 'TEAM_010'),
('Claire', 'Adams', 46, '22 St James St', 'NE1 4NF', 'MD', 'TEAM_011'),
('Paul', 'Evans', 53, '33 Villa Park Rd', 'B6 6HE', 'MD', 'TEAM_012'),
('Lisa', 'Scott', 40, '44 Amex Dr', 'BN1 9BL', 'MD', 'TEAM_013'),
('John', 'King', 49, '55 Molineux St', 'WV1 4QR', 'MD', 'TEAM_014'),
('Emma', 'Lee', 44, '66 St Marys Rd', 'SO14 0AH', 'MD', 'TEAM_015');

INSERT INTO coach (com_first_name, com_last_name, age, com_street, postal_code, coach_title, team_id) VALUES
('Erik', 'ten Hag', 55, '101 Old Trafford Rd', 'M16 0RA', 'Head Coach', 'TEAM_001'),
('Jurgen', 'Klopp', 57, '102 Anfield St', 'L4 0TH', 'Head Coach', 'TEAM_002'),
('Enzo', 'Maresca', 45, '103 Stamford Rd', 'SW6 1HS', 'Head Coach', 'TEAM_003'),
('Mikel', 'Arteta', 42, '104 Emirates Ln', 'N7 7AJ', 'Head Coach', 'TEAM_004'),
('Pep', 'Guardiola', 54, '105 Etihad Dr', 'M11 3FF', 'Head Coach', 'TEAM_005'),
('Ange', 'Postecoglou', 59, '106 Spurs Ave', 'N17 0BX', 'Head Coach', 'TEAM_006'),
('Sean', 'Dyche', 53, '107 Goodison Rd', 'L4 4EL', 'Head Coach', 'TEAM_007'),
('Steve', 'Cooper', 45, '108 King Power St', 'LE2 7FL', 'Head Coach', 'TEAM_008'),
('Daniel', 'Farke', 48, '109 Elland Rd', 'LS11 0ES', 'Head Coach', 'TEAM_009'),
('David', 'Moyes', 61, '110 London Stadium Way', 'E20 2ST', 'Head Coach', 'TEAM_010'),
('Eddie', 'Howe', 47, '111 St James St', 'NE1 4NF', 'Head Coach', 'TEAM_011'),
('Unai', 'Emery', 53, '112 Villa Park Rd', 'B6 6HE', 'Head Coach', 'TEAM_012'),
('Fabian', 'Hurzeler', 32, '113 Amex Dr', 'BN1 9BL', 'Head Coach', 'TEAM_013'),
('Gary', 'ONeil', 41, '114 Molineux St', 'WV1 4QR', 'Head Coach', 'TEAM_014'),
('Russell', 'Martin', 39, '115 St Marys Rd', 'SO14 0AH', 'Head Coach', 'TEAM_015');

INSERT INTO personal_doctor (com_first_name, com_last_name, age, com_street, postal_code, doctor_title, supported_player_id, team_id) VALUES
('Alice', 'Smith', 35, '201 Old Trafford Rd', 'M16 0RA', 'MD', 'COM_000001', 'TEAM_001'),
('Bob', 'Johnson', 40, '202 Anfield St', 'L4 0TH', 'MD', 'COM_000002', 'TEAM_002'),
('Clara', 'Williams', 38, '203 Stamford Rd', 'SW6 1HS', 'MD', 'COM_000003', 'TEAM_003'),
('Daniel', 'Moore', 45, '204 Emirates Ln', 'N7 7AJ', 'MD', 'COM_000004', 'TEAM_004'),
('Eve', 'Taylor', 50, '205 Etihad Dr', 'M11 3FF', 'MD', 'COM_000005', 'TEAM_005'),
('Frank', 'Davis', 42, '206 Spurs Ave', 'N17 0BX', 'MD', 'COM_000006', 'TEAM_006'),
('Grace', 'Brown', 39, '207 Goodison Rd', 'L4 4EL', 'MD', 'COM_000007', 'TEAM_007'),
('Henry', 'Wilson', 47, '208 King Power St', 'LE2 7FL', 'MD', 'COM_000008', 'TEAM_008'),
('Isla', 'Clark', 36, '209 Elland Rd', 'LS11 0ES', 'MD', 'COM_000009', 'TEAM_009'),
('Jack', 'Lewis', 52, '210 London Stadium Way', 'E20 2ST', 'MD', 'COM_000010', 'TEAM_010'),
('Kate', 'Walker', 41, '211 St James St', 'NE1 4NF', 'MD', 'COM_000011', 'TEAM_011'),
('Leo', 'Harris', 48, '212 Villa Park Rd', 'B6 6HE', 'MD', 'COM_000012', 'TEAM_012'),
('Mia', 'Martin', 37, '213 Amex Dr', 'BN1 9BL', 'MD', 'COM_000013', 'TEAM_013'),
('Noah', 'Thompson', 46, '214 Molineux St', 'WV1 4QR', 'MD', 'COM_000014', 'TEAM_014'),
('Olivia', 'White', 43, '215 St Marys Rd', 'SO14 0AH', 'MD', 'COM_000015', 'TEAM_015');


INSERT INTO competitor_member_contact (contact_number, competitor_id) VALUES
(447912345678, 'COM_000001'),
(447923456789, 'COM_000002'),
(447934567890, 'COM_000003'),
(447945678901, 'COM_000004'),
(447956789012, 'COM_000005'),
(447967890123, 'COM_000006'),
(447978901234, 'COM_000007'),
(447989012345, 'COM_000008'),
(447990123456, 'COM_000009'),
(447901234567, 'COM_000010'),
(447912345680, 'COM_000011'),
(447923456781, 'COM_000012'),
(447934567892, 'COM_000013'),
(447945678903, 'COM_000014'),
(447956789014, 'COM_000015');




INSERT INTO spectator (spectator_first_name, spectator_last_name) VALUES
('John', 'Smith'),
('Emma', 'Johnson'),
('Liam', 'Brown'),
('Olivia', 'Davis'),
('Noah', 'Wilson'),
('Ava', 'Taylor'),
('James', 'Clark'),
('Sophia', 'Lewis'),
('William', 'Walker'),
('Isabella', 'Hall'),
('Michael', 'Allen'),
('Charlotte', 'Young'),
('Alexander', 'King'),
('Amelia', 'Wright'),
('Ethan', 'Scott');


UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg' WHERE team_id = 'TEAM_001';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg' WHERE team_id = 'TEAM_002';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg' WHERE team_id = 'TEAM_003';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' WHERE team_id = 'TEAM_004';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' WHERE team_id = 'TEAM_005';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' WHERE team_id = 'TEAM_006';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg' WHERE team_id = 'TEAM_007';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg' WHERE team_id = 'TEAM_008';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/9/9d/Leeds_United_Logo.svg' WHERE team_id = 'TEAM_009';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/c/c2/West_Ham_United_FC_logo.svg' WHERE team_id = 'TEAM_010';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/5/56/Newcastle_United_Logo.svg' WHERE team_id = 'TEAM_011';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/9/9a/Aston_Villa_FC_crest_%282016%29.svg' WHERE team_id = 'TEAM_012';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/f/fd/Brighton_%26_Hove_Albion_logo.svg' WHERE team_id = 'TEAM_013';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg' WHERE team_id = 'TEAM_014';
UPDATE team SET team_logo_url = 'https://upload.wikimedia.org/wikipedia/en/c/c9/FC_Southampton.svg' WHERE team_id = 'TEAM_015';
UPDATE team SET team_logo_url = 'https://logos-world.net/wp-content/uploads/2023/08/Aston-Villa-Logo.png' WHERE team_id = 'TEAM_012';
UPDATE team SET team_logo_url = 'https://i.imgur.com/UqdG9Nv.png' WHERE team_id = 'TEAM_009';


SELECT * FROM stadium;