# Simple Policy Management System

A beginner-friendly prototype for managing insurance policies, claims, and users.

## How to Run

1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   node dbInit.js  # Creates database and dummy data
   node server.js  # Starts server on port 5000
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev     # Starts Vite dev server on port 3000
   ```

## Default Credentials (created by dbInit.js)
- **Policyholder:** john / password123
- **Admin:** admin / admin123
