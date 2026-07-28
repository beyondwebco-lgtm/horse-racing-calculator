-- Create Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id SERIAL UNIQUE,
    name TEXT NOT NULL,
    mobile_number TEXT,
    opening_balance NUMERIC(15, 2) DEFAULT 0.00,
    current_balance NUMERIC(15, 2) DEFAULT 0.00,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Races Table
CREATE TABLE races (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id SERIAL UNIQUE,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Running', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Horses Table
CREATE TABLE horses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    horse_id SERIAL UNIQUE,
    race_id UUID REFERENCES races(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(race_id, name)
);

-- Create Bets Table
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bet_id SERIAL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    race_id UUID REFERENCES races(id) ON DELETE CASCADE,
    horse_id UUID REFERENCES horses(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    bet_type TEXT NOT NULL CHECK (bet_type IN ('Win', 'Place')),
    odds NUMERIC(10, 2) NOT NULL,
    stake NUMERIC(15, 2) NOT NULL,
    deduction_percent NUMERIC(5, 2) DEFAULT 5.00,
    result TEXT DEFAULT 'Pending' CHECK (result IN ('Pending', 'Win', 'Lose')),
    return_amount NUMERIC(15, 2) DEFAULT 0.00,
    profit NUMERIC(15, 2) DEFAULT 0.00
);

-- Function to automatically calculate deduction, return, and profit based on rules
CREATE OR REPLACE FUNCTION calculate_bet_returns()
RETURNS TRIGGER AS $$
BEGIN
    -- Rule 1 & 2: Deduction logic
    IF NEW.bet_type = 'Place' AND NEW.odds < 0.60 THEN
        NEW.deduction_percent := 10.00;
    ELSE
        NEW.deduction_percent := 5.00;
    END IF;

    -- Return and Profit logic
    IF NEW.result = 'Win' THEN
        NEW.return_amount := NEW.stake * (1 + NEW.odds) * (1 - (NEW.deduction_percent / 100.0));
        NEW.profit := NEW.return_amount - NEW.stake;
    ELSIF NEW.result = 'Lose' THEN
        NEW.return_amount := 0;
        NEW.profit := -NEW.stake;
    ELSE
        -- Pending
        NEW.return_amount := 0;
        NEW.profit := 0;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run calculations before insert or update on bets
CREATE TRIGGER trg_calculate_bet_returns
BEFORE INSERT OR UPDATE ON bets
FOR EACH ROW
EXECUTE FUNCTION calculate_bet_returns();

-- Function to automatically update client's current balance
CREATE OR REPLACE FUNCTION update_client_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- If a bet is updated
    IF TG_OP = 'UPDATE' THEN
        -- Adjust balance: reverse old profit, apply new profit
        UPDATE clients
        SET current_balance = current_balance - OLD.profit + NEW.profit
        WHERE id = NEW.client_id;
    -- If a bet is inserted
    ELSIF TG_OP = 'INSERT' THEN
        UPDATE clients
        SET current_balance = current_balance + NEW.profit
        WHERE id = NEW.client_id;
    -- If a bet is deleted
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE clients
        SET current_balance = current_balance - OLD.profit
        WHERE id = OLD.client_id;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update client balance after bet result changes
CREATE TRIGGER trg_update_client_balance
AFTER INSERT OR UPDATE OR DELETE ON bets
FOR EACH ROW
EXECUTE FUNCTION update_client_balance();

-- Function to initialize current balance on client creation
CREATE OR REPLACE FUNCTION init_client_balance()
RETURNS TRIGGER AS $$
BEGIN
    NEW.current_balance := NEW.opening_balance;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_init_client_balance
BEFORE INSERT ON clients
FOR EACH ROW
EXECUTE FUNCTION init_client_balance();
