# Horse Racing Calculator - User Guide & Instructions

Welcome to the Horse Racing Calculator. Follow the step-by-step instructions below to set up your clients, races, and manage bet placements and settlements.

---

## 📋 System Setup Flow (Order of Operations)

To use the system successfully, you must input data in the following logical order:
1. **Create Clients**: Set up clients who will place the bets.
2. **Create a Race**: Create the active races.
3. **Add Horses**: Add competing horses to the created races.
4. **Enter Bets**: Select the client, race, horse, and input the bet parameters (Odds & Stake).
5. **Settle Bets**: Declare the race outcomes (Win/Lose) to automatically update balances and calculations.

---

## 🛠 Step-by-Step Instructions

### Step 1: Create a Client
Before a bet can be placed, you need a client.
1. Navigate to the **Clients** section in the navigation menu.
2. Fill out the **Add New Client** form:
   - **Name**: Client's full name.
   - **Credit Limit**: The maximum negative balance this client is allowed to reach.
   - **Status**: Set to **Active** (Inactive clients cannot place new bets).
3. Click **Add Client**.
4. The client's starting balance begins at `$0.00`.

### Step 2: Create a Race
1. Navigate to the **Races** section.
2. Under the **Create New Race** form, enter:
   - **Race Name** (e.g., *Championship Stakes*, *Race 3 - Belmont*).
   - **Status**: Set to **Scheduled** or **Active** (Completed races will not accept new bets).
3. Click **Create Race**.

### Step 3: Add Horses to the Race
A race needs horses before you can place a bet.
1. While still on the **Races** page, look for the **Add Horse** form.
2. Select the **Race** you just created.
3. Type in the **Horse Name** (e.g., *Midnight Run*).
4. Click **Add Horse**.
*(Note: You can add multiple horses to the same race by repeating this step).*

### Step 4: Enter a Bet
1. Navigate to the **Bet Entry & Settlement** section (or the **Bets** tab).
2. Use the **New Bet Entry** form:
   - **Race**: Select your active race from the dropdown.
   - **Horse**: Once you select the race, the **Horse** dropdown will unlock. Select the corresponding horse.
   - **Client**: Select the active client placing this bet.
   - **Bet Type**: Choose **Win** or **Place**.
   - **Odds**: Input the betting odds (e.g., `2.50` or `4.00`).
   - **Stake**: Input the amount of money being wagered (e.g., `100.00`).
3. Click **Submit Bet**.

### Step 5: Settle a Bet & View Updates
Once a race has run, you can settle the bets:
1. Scroll down to the **Recent Bets & Settlement** table on the bets page.
2. Locate the pending bet. Under the **Result** column, click:
   - **W (Win)**: If the horse won/placed.
   - **L (Lose)**: If the horse lost.
3. **Automated Calculations** that occur instantly upon settlement:
   - **Return**: Calculated as `Stake * Odds` for a **Win**, and automatically adjusted based on the database triggers.
   - **Profit**: Calculated as `Return - Stake`. If lost, the profit is `-Stake`.
   - **Client Balance**: The client's balance will instantly update in the database and reflect on the **Clients** dashboard (adding returns or subtracting stakes).
