# TaskFlow

TaskFlow is a full-stack task and project management application.

It includes:
- Node.js + Express backend
- MySQL database
- React admin dashboard
- Next.js public frontend

## Features

- User registration and login
- JWT authentication
- Protected admin routes
- Create, read, update, and delete projects
- Create, read, update, and delete tasks
- Project and task validation
- Public project listing
- Public task listing
- Dynamic project detail pages
- Tasks displayed by project
- Responsive frontend
- Error and loading states
- Environment variable configuration

## Technologies

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- CORS

### Admin Dashboard
- React
- Vite
- React Router
- JavaScript

### Public Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Development Tools
- Git
- GitHub
- Postman
- MySQL Workbench
- VS Code

## Project Structure

```text
TaskFlow/
├── admin/          React admin dashboard
├── frontend/       Next.js public frontend
├── server.js       Express backend server
├── db.js           MySQL connection
├── database.sql    Database structure
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/perlakabbout/TaskFlow.git
cd TaskFlow
```

### 2. Install Backend Dependencies

From the TaskFlow root folder:

```bash
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file in the TaskFlow root folder and add:

```env
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
PORT=3000
```

### 4. Set Up the Database

Create a MySQL database and run the SQL file:

```text
database.sql
```

This creates the required database structure for TaskFlow.

### 5. Start the Backend

From the TaskFlow root folder:

```bash
npm run dev
```

The backend runs locally on:

```text
http://localhost:3000
```

### 6. Set Up the React Admin Dashboard

Open a new terminal:

```bash
cd admin
npm install
```

Create a `.env` file inside the `admin` folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the admin dashboard:

```bash
npm run dev
```

The React admin dashboard runs locally on:

```text
http://localhost:5173
```

### 7. Set Up the Next.js Public Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Start the public frontend:

```bash
npm run dev
```

The Next.js frontend runs locally on:

```text
http://localhost:3001
```

## Live Deployment

### Backend API
https://taskflow-production-d281.up.railway.app

### Admin Dashboard
https://benevolent-muffin-d4fbf4.netlify.app

### Public Frontend
https://taskflow-public.netlify.app

## Deployment

- Backend and MySQL database are hosted on Railway.
- React admin dashboard is hosted on Netlify.
- Next.js public frontend is hosted on Netlify.
- Production environment variables are configured separately from local development variables.

## Final Project Outcome

TaskFlow demonstrates a complete full-stack workflow connecting:

```text
Next.js Public Frontend
        ↓
Node.js / Express REST API
        ↓
MySQL Database
        ↑
React Admin Dashboard
```

The application includes authentication, protected admin functionality, project and task management, public-facing pages, API integration, persistent database storage, and live deployment.