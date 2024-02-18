# Cicero Component Documentation

This markdown documents the components that will be used, organized by page and sorted by phase(stage in development that it'll likely be completed)

## Dashboard

| Component         | Phase Level | Description/Purpose                                                                       |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `Watchlist`       | Phase 1     | `Shortcuts`, open a list of players that the user has added to their watchlist            |
| `Balance`         | Phase 1     | This component is meant of to display the balance the user has in their account to invest |
| `Chart`           | Phase 1.5   | This component charts how the user's investments are doing                                |
| `ManagingBalance` | Phase 2     | `Shortcuts`, let the user add more to their balance component                             |
| `YourInvestments` | Phase 2     | `Shortcuts`, show the user a list of the players they're invested in                      |
| `UpcomingEvents`  | Phase 3     | `Shortcuts`, show the user upcoming events in the league that might impact scores         |
| `AISummary`       | Phase 3     | Summarize to the user why their invesments are doing well or not                          |

## Explore

| Component           | Phase Level | Description/Purpose                                                                       |
| ------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `UserLeaderboard`   | Phase 1     | This will list and rank the users who are doing best in terms of investments              |
| `TopMovers`         | Phase 1     | This will list the players who are fluctuating in value the most, good or bad             |
| `HowItWorks`        | Phase 1     | This static component will explain to the user how the web app works                      |
| `Search-Bar`        | Phase 2     | This will let the user search for players and users                                       |
| `News`              | Phase 2     | This will list relevent news about the NBA                                                |
| `SentimentRankings` | Phase 2     | This will list and rank the players with the best sentiment rankings, regardless of stats |

## Profile

| Component            | Phase Level | Description/Purpose                                      | Subcomponents                                                                     |
| -------------------- | ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `ProfileCard`        | Phase 1     | This component is meant to showcase user info.           | `ProfilePic`, `DisplayName`, `Bio`, `Pronouns`, `Location`, `Username`, `Socials` |
| `AllStars`           | Phase 1     | This will show the user's best performers                |
| `EditProfileLink`    | Phase 1     | This will link to the form to edit the user account info |
| `ShareProfileButton` | Phase 2     | This will copy the users account to the clipboard        |
| `Badges`             | Phase 3     | This will list the badges the that the user has          |

## Settings

| Component | Phase Level | Description/Purpose                                    |
| --------- | ----------- | ------------------------------------------------------ |
| Profile   | Phase 1     | `EditProfileForm` form to let user change profile info |
| Theme     | Phase 1     | Light or Dark Theme Toggle                             |
| Account   | Phase 2     | `DeleteAccount` and `AlertManagement`                  |

## Individual Player

| Component          | Phase Level | Description/Purpose                                        | Subcomponents |
| ------------------ | ----------- | ---------------------------------------------------------- | ------------- |
| `AddToWatchlist`   | Phase 1     | Button to Add player to watchlist                          |               |
| `BuyButton`        | Phase 2     | Button to buy stocks in player                             |               |
| `PlayerName`       | Phase 1     | The player's name                                          |               |
| `SellButton`       | Phase 1     | Button to sell stocks in player                            |               |
| `CiceroScoreChart` | Phase 1     | The chart that will show the player's score over time      | `SortChart`   |
| `AISummary`        | Phase 2     | The summary to explain why a player has the score they do. |               |
| `CriticSentiment`  | Phase 3     | The sentiment from verified 'critic's' in media            |               |
| `DoYouAgreeForm`   | Phase 3     | Form to let users voice if they agree with the score       |               |
