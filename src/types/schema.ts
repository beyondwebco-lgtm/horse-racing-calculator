export interface Client {
  id: string;
  client_id: number;
  name: string;
  mobile_number: string | null;
  opening_balance: number;
  current_balance: number;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export interface Race {
  id: string;
  race_id: number;
  date: string;
  name: string;
  location: string | null;
  status: 'Upcoming' | 'Running' | 'Completed';
  created_at: string;
}

export interface Horse {
  id: string;
  horse_id: number;
  race_id: string;
  name: string;
  created_at: string;
}

export interface Bet {
  id: string;
  bet_id: number;
  created_at: string;
  race_id: string;
  horse_id: string;
  client_id: string;
  bet_type: 'Win' | 'Place';
  odds: number;
  stake: number;
  deduction_percent: number;
  result: 'Pending' | 'Win' | 'Lose';
  return_amount: number;
  profit: number;
}
