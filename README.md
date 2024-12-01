# CIS476 Term Project

This repository contains the backend and frontend code for the CIS476 Term Project. The backend is built using Node.js and Express, and the frontend is built using Next.js.

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Byron-Hodel/cis476-term-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd cis476-term-project
   ```

3. Install dependencies for both the backend and frontend, if you don't use Docker:

   - Navigate to the backend folder and install dependencies:

     ```bash
     cd backend-server
     npm install
     ```

   - Navigate to the frontend folder and install dependencies:

     ```bash
     cd term-project-frontend
     npm install
     ```

---

## Starting the Backend Server
###  Must add a .env file with the correct information providing in the report, otherwise it won't work
1. Navigate to the `backend` directory:

   ```bash
   cd backend-server
   ```

2. Start the backend server:

   ```bash
   npm start
   ```

3. The backend server should now be running at `http://localhost:4000`.

---

## Starting the Frontend Application

1. Navigate to the `frontend` directory:

   ```bash
   cd term-project-frontend/
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open your browser and go to `http://localhost:3000` to view the application.

---

## Project Structure

The repository is organized as follows:

```
cis476-term-project/
├── backend-server/    # Backend server code (Node.js + Express)
│   ├── node_modules/  # Backend dependencies
│   ├── Folders breaking up src code/    # Backend source code
│   ├── .env           # Environment variables (not included by default)
│   └── package.json   # Backend package configuration
├── term-project-frontend/   # Frontend application code (Next.js)
│   ├── node_modules/  # Frontend dependencies
│   ├── app/           # frontend source code
│   ├── public/        # Public assets
│   └── package.json   # Frontend package configuration
└── README.md          # Project documentation
```
