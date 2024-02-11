# Entity Relationship Diagram

This markdown is to note the tables that will be used and the relationships between them. **_Subject To Change_**

## List of Tables

**users**

| Column Name         | Type      | Description                                           |
| ------------------- | --------- | ----------------------------------------------------- |
| id                  | UUID      | Primary key                                           |
| username            | string    | the username of the account                           |
| name                | string    | Full name of the user                                 |
| created_at          | timestamp | when the account was created                          |
| updated_at          | timestamp | when the account was last updated                     |
| profile_picture_url | string    | the url string for a user's profile picture           |
| role                | string    | the designation of the account, 'admin' or 'standard' |
| balance             | numeric   | the balacne of cicero coin a user has                 |

**players**

| Column Name | Type      | Description                                           |
| ----------- | --------- | ----------------------------------------------------- |
| id          | UUID      | Primary key                                           |
| nba_api_id  | UUID      | ID referencing the player on the external NBA API     |
| updated_at  | timestamp | the last time this player was updated                 |
| name        | string    | Full name of the player                               |
| team        | string    | Player's current team                                 |
| position    | string    | Player's playing position (e.g., Point Guard, Center) |

**player_stats**

| Column Name                     | Type    | Description                                                                 |
| ------------------------------- | ------- | --------------------------------------------------------------------------- |
| id                              | integer | Primary key                                                                 |
| player_id                       | integer | Foreign key referencing the `players` table                                 |
| game_date                       | date    | Date of the game for which these stats are recorded                         |
| points                          | integer | Number of points scored by the player in the game                           |
| rebounds                        | integer | Number of rebounds obtained by the player in the game                       |
| assists                         | integer | Number of assists by the player in the game                                 |
| ppg                             | numeric | Points per game (non-advanced)                                              |
| apg                             | numeric | Assists per game (non-advanced)                                             |
| rpg                             | numeric | Rebounds per game (non-advanced)                                            |
| steals                          | numeric | Steals per game (non-advanced)                                              |
| turnovers                       | numeric | Turnovers per game (non-advanced)                                           |
| plus_minus                      | numeric | Player's plus-minus for the game (non-advanced)                             |
| offensive_rebound_percentage    | numeric | Percentage of offensive rebounds                                            |
| defensive_rebound_percentage    | numeric | Percentage of defensive rebounds                                            |
| assist_ratio                    | numeric | Ratio of assists per 100 possessions                                        |
| assist_to_turnover_ratio        | numeric | Ratio of assists to turnovers                                               |
| usage_percentage                | numeric | Percentage of team plays used by player while on the floor                  |
| true_shooting_percentage        | numeric | Measure of shooting efficiency, incorporating 2pt, 3pt, and free throws     |
| turnover_ratio                  | numeric | Ratio of turnovers per 100 possessions                                      |
| effective_field_goal_percentage | numeric | Field goal percentage adjusted for value of 3-point shots                   |
| offensive_rating                | numeric | Points produced per 100 possessions by player                               |
| defensive_rating                | numeric | Points allowed per 100 possessions by player                                |
| net_rating                      | numeric | Player's net point differential per 100 possessions                         |
| estimated_offensive_rating      | numeric | (Advanced) Estimated points produced per 100 possessions                    |
| estimated_defensive_rating      | numeric | (Advanced) Estimated points allowed per 100 possessions                     |
| estimated_net_rating            | numeric | (Advanced) Estimated net point differential per 100 possessions             |
| estimated_usage_percentage      | numeric | (Advanced) Estimated percentage of team plays used while player is on court |
| mamba_mentality                 | numeric | (Non-advanced) Subjective measure of player's competitiveness & work ethic  |

**cicero_scores**

| Column Name   | Type    | Description                                                          |
| ------------- | ------- | -------------------------------------------------------------------- |
| id            | integer | Primary key                                                          |
| player_id     | integer | Foreign key referencing the `players` table                          |
| analysis_date | date    | Date on which the sentiment analysis was conducted                   |
| cicero_score  | float   | A numerical score representing the sentiment + stats (e.g., 1 - 999) |

<!--
**user_investments**
This table is meant to query the db for individual users

| Column Name      | Type      | Description                                 |
| ---------------- | --------- | ------------------------------------------- |
| id               | integer   | Primary key                                 |
| user_id          | integer   | Foreign key referencing the `users` table   |
| player_id        | integer   | Foreign key referencing the `players` table |
| transaction_type | string    | Type of transaction (e.g., 'Buy', 'Sell')   |
| purchase_price   | numeric   | The price of the player's stock             |
| amount_traded    | numeric   | Amount of stocks bought or sold             |
| created_at       | timestamp | Timestamp of when the investment was made   | -->

**transactions**
This table is meant to query the db for general purpose info such as keeping track a player's transactional activity

| Column Name      | Type      | Description                                 |
| ---------------- | --------- | ------------------------------------------- |
| id               | integer   | Primary key                                 |
| user_id          | integer   | Foreign key referencing the `users` table   |
| player_id        | integer   | Foreign key referencing the `players` table |
| transaction_type | string    | Type of transaction (e.g., 'Buy', 'Sell')   |
| purchase_price   | numeric   | The price of the player's stock             |
| amount_traded    | numeric   | Amount of stocks bought or sold             |
| created_at       | timestamp | Timestamp of when the investment was made   |

**Relationships**

**One-to-Many:**

- A user can have multiple transactions (`users` -> `transactions`)
- A player can have multiple stats entries (`players` -> `player_stats`)
- A player can have multiple sentiment scores (`players` -> `player_sentiment`)

**One-to-One**

<!-- additional relationships we might want to add: users following players -->
