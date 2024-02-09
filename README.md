# Cicero: NBA Player Investment Web App

## What is Cicero?

Cicero is a web app for users to invest in their favorite NBA players potential. This works through a web interface that users can log into, browse/search different players and “Invest” into their current score.

This **_score_** is defined through both the players performance through stats in game as well as the sentiment analysis of the players online reputation such as what people and analysts are tweeting about them.

Therefore there are two main components to this application.

- The Next.js app which handles displaying the application interface for users to log in, browse players/stats, invest, and manage account(View investment history - gains & losses -, manage investment balance, manage account settings, and profile view).
- The Python app which will conduct the Sentiment Analysis Score for each player. Interacting with the NBA_API to get player stats and the Twitter_API to get tweets, then through the use of Machine Learning and AI, will come up with a score to give a user. The Next app will make an api call to get this score to display on the player profile.

## Development Roadmap

**Phase 1: Core Foundations**

1. **Database Design**

   - Design detailed database schema (include entities like Users, Players, Investments, Transactions).
   - Choose a database provider (Vercel, Railway, or alternative).

2. **Wireframing & UI Basics**

   - Complete wireframes for core user journeys (login/registration, player search, player profile, investment, portfolio).
   - Set up basic Next.js project structure with routing for these views.

3. **Authentication**
   - Select an authentication mechanism (e.g., email/password, social, Auth0).
   - Implement secure authentication within the Next.js app.

**Phase 2: Next.js App Development**

1. **Develop Static Components**

   - Develop each route and their components that will contain static data
   - Style the components and theme toggle using TailwindCSS

2. **Data Fetching (NBA API)**

   - Integrate with an NBA API to fetch player data.
   - Display core player stats on the player profile page.

3. **Investment Mechanics**

   - Create UI components for investment input.
   - Implement mock investment tracking (simulate gains/losses for frontend testing).

4. **Portfolio & Account Management**

   - Build views for user portfolio, transaction history, deposit/withdrawal (simulated).
   - Develop profile settings management UI.

**Phase 3: Python App Development**

1. **Twitter API Integration**

   - Set up Twitter API connection and authorization.
   - Implement tweet collection functions using relevant keywords and player searches.

2. **Sentiment Analysis Model**

   - Select/train a sentiment analysis model (consider Hugging Face Transformers, NLTK, or spaCy).
   - Fine-tune for the basketball domain if necessary.

3. **Score Calculation**
   - Develop a Python script that:
     - Fetches NBA player stats.
     - Collects relevant tweets.
     - Conducts sentiment analysis.
     - Combines stats and sentiment into a "Cicero Score."

**Phase 4: Integration & Refinement**

1. **API Endpoints (Python)**

   - Create a simple API (Flask or FastAPI) to expose Cicero Scores for retrieval.

2. **API Calls (Next.js)**

   - Integrate API calls in the player profile component to fetch and display Cicero Scores.

3. **Database Integration**

   - Connect the Next.js app to the database for investment tracking, user profiles, etc.

4. **Advanced Features & Refinement**
   - User favorites/watchlists.
   - Dynamic investment history charts.
   - Performance optimization.
   - Rigorous testing.
