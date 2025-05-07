# HCMUT League Application

The **HCMUT League Application** is a comprehensive web-based platform designed to manage and showcase a football league. It provides features for managing teams, players, matches, stadiums, and ticket bookings, while also offering a user-friendly interface for spectators, administrators, and other roles.

## Features

- **User Roles**: Supports multiple roles such as Admin, Player, Coach, Spectator, and more, each with specific functionalities.
- **League Table**: Displays the current standings of teams in the league, including points, matches played, and recent form.
- **Match Management**: View match schedules, results, and details, including participating teams and stadiums.
- **Team Management**: Explore team details, including players, coaches, and other personnel.
- **Stadium Information**: View details about stadiums, including capacity, address, and owner team.
- **Ticket Booking**: Allows spectators to book tickets for upcoming matches.
- **Profile Management**: Users can view and edit their profiles based on their roles.
- **Authentication**: Secure login and registration for different roles.

---

## Frontend Components and Functionality

The frontend is built using **React** and styled with **Tailwind CSS**. Below is an overview of the key components and their functionality:

### 1. **Main Components**
- **`NavBar.jsx`**:
  - Provides navigation links to different sections of the application, such as Home, Matches, Teams, Stadiums, and Profile.
  - Dynamically highlights the active page and adapts for mobile and desktop views.

- **`MainBanner.jsx`**:
  - Displays a visually appealing banner on the home page with a call-to-action button to explore matches.

- **`LeagueTable.jsx`**:
  - Fetches and displays the league standings, including team positions, points, goals scored, and recent form.
  - Highlights the top teams and relegation zone with distinct styles.

- **`MatchList.jsx`**:
  - Displays a list of recent and upcoming matches, grouped by date.
  - Shows team logos, match times, and scores for completed matches.

- **`Match.jsx`**:
  - Represents a single match card with details such as home and away teams, score, and stadium.
  - Includes a "Quick View" link to navigate to the match details page.

---

### 2. **Pages**
- **`Home.jsx`**:
  - Combines the `MainBanner` and `LeagueTable` components to provide an overview of the league.

- **`Matches.jsx`**:
  - Displays a list of matches using the `MatchList` component.

- **`MatchPage.jsx`**:
  - Shows detailed information about a specific match, including participating teams, stadium, and match time.

- **`Teams.jsx`**:
  - Lists all teams in the league with their logos and basic details.
  - Allows users to view detailed information about a specific team, including players, coaches, and doctors.

- **`Stadium.jsx`**:
  - Displays a list of stadiums with details such as name, capacity, and address.
  - Includes a detailed view for individual stadiums.

- **`Register.jsx`**:
  - Provides a registration form for new users, supporting multiple roles such as Admin, Player, Coach, and Spectator.
  - Dynamically adjusts the form fields based on the selected role.

- **`Signin.jsx`**:
  - Allows users to log in to the application.

- **`Profile.jsx`**:
  - Displays the user's profile information, including role-specific details.
  - Allows users to edit their profile.

- **`Booking.jsx`**:
  - Enables spectators to book tickets for upcoming matches.
  - Displays error messages if the user is not logged in or does not have the required role.

---

### 3. **Context**
- **`AppContext.jsx`**:
  - Manages global state for the application, including user authentication, token management, and league data (teams and matches).
  - Provides helper functions for login, logout, and fetching data.

---

### 4. **Styling**
The application uses **Tailwind CSS** for styling, ensuring a responsive and modern design. Custom animations and gradients are used to enhance the user experience.

---

## Backend Overview

The backend is built with **Node.js** and **Express**, using **PostgreSQL** as the database. It provides RESTful APIs for managing users, teams, matches, stadiums, and ticket bookings. Authentication is handled using JWT tokens.

---

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/hcmut-league.git
   cd hcmut-league
