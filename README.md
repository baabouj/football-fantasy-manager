# Football Fantasy Manager

A web application that allows users to manage their football fantasy teams, buy and sell players, and compete in the transfer market.

## Live Demo

Check out the live demo [here](https://football-fantasy-manager.vercel.app/).

## Features

### Product Features

1. **User Authentication**:

   - Single flow for registration and login using email and password.

2. **Team Creation**:

   - Automatically generates a team for each user upon registration.
   - Initial budget of $5,000,000.
   - Team consists of 20 players:
     - 3 Goalkeepers
     - 6 Defenders
     - 6 Midfielders
     - 5 Attackers

3. **Transfer Market**:
   - Filter players by team name, player name, and price.
   - Add/remove players to/from the transfer list with a custom asking price.
   - Buy players from other teams at 95% of their asking price.

### Technical Features

1. **Frontend**:

   - Built with Next.js and TailwindCSS for a modern, responsive UI.

2. **Backend**:

   - Built with Express.js and Prisma for scalable and efficient server-side logic.
   - Handles user authentication, team generation, and transfer market logic.

3. **Database**:

   - SQLite database managed by Prisma ORM.

4. **Deployment**:
   - Frontend and backend deployed separately using Vercel and Render.

## Installation

### Backend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/baabouj/football-fantasy-manager.git
   cd football-fantasy-manager/backend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set the environment variables:

   ```bash
   # copy the .env.example file to .env

   cp .env.example .env

   # or if you are using Windows:
   copy .env.example .env

   # make sure to open `.env` file and modify the environment variables (if needed)
   ```

4. Push the Prisma schema state to the database:

   ```bash
   pnpm prisma db push
   ```

5. Start the server:
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set the environment variables:

   ```bash
   # copy the .env.example file to .env

   cp .env.example .env

   # or if you are using Windows:
   copy .env.example .env

   # make sure to open `.env` file and modify the environment variables (if needed)
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Usage

1. Register/login to the application.
2. View your automatically generated team.
3. Explore the transfer market to buy and sell players.
4. Manage your team within the set budget.

## Deployment

1. **Frontend**:

   - Deployed on Vercel: [Live Frontend](https://football-fantasy-manager.vercel.app/)
   - Ensure the `NEXT_PUBLIC_API_URL` environment variable is updated to the production backend URL.

2. **Backend**:
   - Deployed on Render: [Live Backend](https://football-fantasy-manager.onrender.com)
   - Ensure the `DATABASE_URL`, `JWT_SECRET` and `FRONTEND_URL` environment variables are properly configured in the Render dashboard.

## Time Report

_Note: The time reported is approximate and might not be entirely accurate._

### Total Time: 23 hours

1. **Backend Development**: 10 hours

   - Authentication: 3 hours
   - Team Creation: 4 hours
   - Transfer Market: 3 hours

2. **Frontend Development**: 11 hours

   - Authentication UI: 3 hours
   - Team Display: 4 hours
   - Transfer Market UI: 4 hours

3. **Deployment**: 2 hours
   - Backend Deployment: 1 hour
   - Frontend Deployment: 1 hour

## Acknowledgments

Special thanks to the team at Calo for the opportunity!

## Contact

For questions, feel free to reach out via email: `baabouj.dev@gmail.com`.
