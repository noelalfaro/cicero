# Cicero: NBA Player Investment Web App

## What is Cicero?

Cicero is the project codename for Prospect Portfolio - a web app for users to invest in their favorite NBA players potential. This works through a web interface that users can log into, browse/search different players and “Invest” into their current **_PR_** score.

This **_PR_** score is defined through both the players performance through stats in game as well as the sentiment analysis of the players online reputation such as what people and analysts are posting about them online on social media sites like BlueSky.

Therefore there are two main components to this application.

- The Next.js app (this repo) serves as the primary interface for users. It is responsible for rendering the user interface, handling user interactions, and communicating with the backend services to fetch and display data. This app enables users to authenticate/authorize, view investment history - gains & losses -, manage investment balance, manage account settings, browse through players' profile pages as well as other users. The Next.js app pulls data from the same database that the Django app has access to, ensuring consistency and real-time updates across the platform.
- The Django app serves as the engine which will gather player stats data (through the NBA API) and sentiment data (in the form of posts on sites like BlueSky) to conduct sentiment analysis. By using machine learning models, the app analyzes the gathered data to update the **_PR_** score for each player in the database. This score reflects both the player's performance in games and their online reputation based on social media and news posts.

## Next.js App Responsibilities and Features

### Responsibilities

The Next.js app is the frontend component of the Cicero project. It is responsible for:

1. **User Interface (UI) Rendering**: Rendering the web pages and components that make up the user interface.
2. **User Authentication**: Handling user login, registration, and authentication using Kinde Auth.
3. **Data Fetching and Display**: Fetching data from the backend services and displaying it to the users.
4. **User Interactions**: Handling user interactions such as browsing players, making investments, and managing accounts.
5. **API Integration**: Communicating with the Django backend and other APIs to fetch player statistics, sentiment analysis scores, and other relevant data.
6. **Database Connection**: The Next.js app pulls data from the same database that the Django app has access to, ensuring consistency and real-time updates across the platform.

### Key Features

1. **User Authentication and Account Management**:

   - Secure user login and registration using Kinde Auth.
   - User profile management, including updating account settings and viewing investment history.

2. **Player Browsing and Search**:

   - Browse and search for NBA players.
   - View detailed player profiles with performance metrics and historical data.

3. **Investment Management**:

   - Invest in players based on their **_PR_** score.
   - Track investment history, including gains and losses.
   - Manage investment balance and portfolio.

4. **Sentiment Analysis Integration**:

   - Display sentiment analysis scores for each player based on social media and news data.
   - Fetch sentiment analysis scores from the Python backend.

5. **Real-Time Updates**:

   - Regular updates on player performance and news articles.
   - Real-time notifications for significant events or changes in player performance.

6. **Data Visualization**:

   - Visualize player statistics and investment data using charts and graphs.
   - Use Recharts for creating interactive and responsive charts.

7. **Responsive Design**:

   - Ensure the application is fully responsive and works seamlessly on different devices and screen sizes.
   - Use Tailwind CSS for styling and responsive design.

8. **Performance Optimization**:

   - Optimize the application for fast load times and smooth performance.
   - Use Next.js features like server-side rendering (SSR) and static site generation (SSG) to improve performance.

9. **Error Handling and User Feedback**:
   - Provide meaningful error messages and feedback to users.
   - Handle errors gracefully and ensure a smooth user experience.

### Advanced Features and Optimization

1. **TanStack Query and Next.js Caching**:

   - Use TanStack Query for efficient data fetching, caching, and synchronization.
   - Minimize network requests by caching data and reusing it across components.
   - Prefetch data on the server and dehydrate it to pass to the client, ensuring fast initial load times.

2. **Next.js Rendering Strategies**:

   - Leverage Next.js rendering strategies such as server-side rendering (SSR) and static site generation (SSG) to optimize performance.
   - Ready the App for Partial Pre-rendering to pre-render only the critical parts of the page, reducing the time to interactive.

3. **Efficient Data Fetching**:
   - Implement filters in the client component to fetch additional data as needed, such as 15-day or 30-day data.
   - Use TanStack Query's `staleTime` and `cacheTime` configurations to control data freshness and caching behavior.

The Next.js app is a critical component of the Cicero project, responsible for rendering the user interface, handling user interactions, and communicating with the backend services. It provides a seamless and interactive experience for users to browse players, make investments, and manage their accounts. By leveraging modern web technologies and best practices, the Next.js app ensures a fast, responsive, and user-friendly experience. The integration with the Django app and shared database ensures consistency and real-time updates across the platform. Additionally, the use of TanStack Query and Next.js caching, along with advanced rendering strategies, optimizes performance and minimizes network requests, making the app efficient and fast.

## Development Roadmap

### Phase 1: Preparation

1. **Wireframing & UI Basics**

   - Complete wireframes for core user journeys & routes (login/registration, Dashboard, player search, player profile, investment, Explore, user portfolio).

2. **Boilerplate and Initialization**

   - Set up environment for Next.JS app using all dependencies we need to get started.
   - Set up environment for Django app using all dependencies we need to get started.

3. **Try To Map Out App Architecture**

   - Wireframe/Draw out the relationship between all the pieces to organize responsibilities.

4. **Plan Development Timeline**

   - Based on complexity and priorities, define the timeline and order in which features/ui will be developed.

### Phase 2: Development

#### **Next.JS**

1. **Deploy & Connect**

   - Ensure all connections are made and the deployment process is set up.
     - Connecting to the Neon PostgreSQL database through DrizzleORM.
     - Connecting to Vercel, where the project is deployed.

2. **Define Routes**

   - Define and create each route that we know will be used.

     - Landing Page
       - First Impressions, explain and call to action.
     - Login/Register Page
       - Allow the user to access the app
     - Dashboard Page
       - Homebase, most user actions will begin from here
     - Explore Page
       - Inform, lets the user browse & discover macro level trends
     - Notifications Page
       - Latest, lets the user know of any notifications related to players or accounts they follow & interact with.
     - Player Profile Page
       - Inform, lets the user know the gritty details about a specific player and allows them to make an informed decision on wether to invest.
     - User Profile Page
       - Organize, lets the user see what players they folllow, invest in, as well as manage their experience and account.
     - 404 Page
       - Redirect, any route that shouldn't exist.

   - Throughout the process also, learn about rendering strategies, and how to take advantage of React Server Components, best practices for security and efficiency. Document learning progress.

3. **Develop Static/Dynamic Components Per Route**

   - Player Page
     - Player Chart (This will chart the **_PR_** score of players and invesment performance of the user)
     - Player Card (Display Player Picture, Static Information, Watchlist Status)
     - Player News Carousel (This will display recent news about the player or team)
     - PR AI Summary (This will explain the **_PR_** score of a given player)
     - Agree Counter (This will act as a like/dislike button for users to impact whether they think the score is valid)
   - Dashboard Page
     - User Chart (This will chart the invesment performance of the user)
     - Watchlist News Carousel (This will display recent news about the players in a user's watchlist)
     - Control Center (Shortcut UI to common user actions --Invesment History, Manage Balance, Watchlist, etc.)
     - User AI Summary (This will explain how the user's portfolio is performing over time and why)
   - Notifications Page
     - Player Notifications Table (Table that lists the user's player/account notifications)
     - User Notifications Table (Table that lists the user's account notifications, like other users following them.)
   - Explore Page
     - Top Trenders (Table that lists the top trending players based on **_PR_** score over the past week )
     - Search (Search Box to search for players pages)
     - News Carousel (Top Level Breaking News, news about the League)
     - Low Trenders (Table that lists the players whose social sentiment has decreased the most over the past week)
     - Most Invested (Card that shows the player with the most investments over the past week)
     - Explainer (Explainer component that breaks down how to use the app)
   - User Profile Page
     - Watchlist (Carousel/List of players in the user's watchlist)
     - Invesment History (Table that breaks down the user's investment history with transaction information)
     - User Card (Card that displays static user info alongside an 'Edit Profile' & 'Menu' trigger buttons)
     - Edit Profile Dialog (This dialog contains inputs to change user profile picture & display name)
     - Settings Dialog (This dialog contains settings for the app like a theme toggle button.)
   - Login/Register Page
     - Login input (This card input will take in user input to help them login)
     - Register input (This card input will take in user input to help them register)
   - Landing Page
     - Explainer (Explainer component that breaks down how to use the app)
     - Login/Register Buttons
     - Hero Images
   - 404 Page
     - Redirect Component (Component to let the user go back to a functional route)

4. **Define and Document Rendering and Fetching Strategies As Well As Project Work**

   - To solidify understanding, document the rendering & fetching strategies used throughout the application, and ensure the reasoning is included.
   - Document app architecture.'
   - Use Project Management tools to organize & assing tasks

#### **Django**

1. **Deploy & Connect**

   - Ensure all connections are made and the deployment process is set up.
     - Connecting to the Neon PostgreSQL database through DrizzleORM.
     - Connecting to Vercel, where the project is deployed.

2. **Develop Basic App Structure**

   - Code the boilerplate to ensure the django app can communicate well with the database and necessary API's.

3. **NBA API Integration**

   - Connect to NBA API to retrieve player stats data.

4. **BlueSky API Integration**

   - Connect to Bluesky API to retrieve sentiment data.

5. **Develop Sentiment Analysis Model**
   - Select/train a sentiment analysis model (consider Hugging Face Transformers, NLTK, or spaCy).
   - Fine-tune for the basketball domain if necessary.
   - Input NBA API and sentiment data to model.
6. **Score Calculation**

   - Develop a Python script that:
     - Fetches NBA player stats.
     - Collects relevant posts.
     - Conducts sentiment analysis.
     - Combines stats and sentiment into a ' **_PR_** score '
     - Update DB rows for players.

7. **AI Model APU Integration**

   - Connect to an AI API to feed data and calculated score to develop an AI summary for each score change.

8. **Update Database Rows**
   - For each updated player, change the PR score and other relevant data.

### Phase 3: Integrate, Test & Refine

1. **Ensure All Integrations Are Made For MVP Features**

   - For each route, ensure the features work.

2. **Test All MVP Features**

   - Test each feature and track results/bugs.

3. **Based On Tests and User Feedback, Refine UX**

   - Gather results and fix lingering bugs

### Phase 4 & Beyond: Advanced Features & Refinement

1. **Begin Planning To Implement Other Sports Leagues**

   - Once we are at a confident place for NBA players, begin planning integrating NFL(?) players.

## Project Purpose

We came up with this idea purely off the fact that it can be very entertaining to see how social media reacts online to how a player performs. Alongside that, we thought it'd be interesting to see how people view potential with up and coming players since everyone thinks they're the perfect GM their team needs since they know the talent and **_it_** factor. We also wanted to build a project that took advantage of the latest in both web dev trends (React Server Components) and AI.
