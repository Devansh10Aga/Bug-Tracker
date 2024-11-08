# Bug Tracker Dashboard

A modern, responsive bug tracking application built with Next.js, TypeScript, and Tailwind CSS. This application helps teams manage and track bugs/tasks with features like time tracking, filtering, and statistical analysis.

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Context API
- Local Storage for data persistence
- Recharts for data visualization

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Devansh10Aga/Bug-Tracker
cd bug-tracker
```

2. Install dependencies:
```bash
npm install --force
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

The application uses a mock authentication system for demonstration purposes:
- Any email/password combination will work
- Login state persists through page refreshes using localStorage
- Protected routes redirect to login page when accessed without authentication

## Usage

1. **Login**
   - Use any email address
   - Password must be at least 6 characters

2. **Dashboard**
   - View task statistics and charts
   - Create new tasks
   - Manage existing tasks

3. **Task Management**
   - Create tasks with title, description, priority, status, and assignee
   - Edit existing tasks
   - Delete tasks when completed
   - Track time spent on tasks

4. **Filtering and Analysis**
   - Filter tasks by status and priority
   - View time distribution charts
   - Analyze task distribution by assignee

## Local Storage

The application uses localStorage for:
- User authentication state
- Task data persistence
- Application preferences

## Assumptions

1. **Authentication**
   - Mock authentication is used for demonstration
   - In a production environment, this would be replaced with a proper authentication system

2. **Data Persistence**
   - Local storage is used for simplicity
   - In production, this would be replaced with a proper backend database

3. **Performance**
   - The application assumes a reasonable number of tasks
   - Large datasets might require pagination or virtual scrolling

   
## Key Highlights

- **User Authentication**
  - Simple mock authentication system
  - Protected routes
  - Persistent login state

- **Task Management**
  - Create, edit, and delete tasks
  - Priority and status tracking
  - Assignee management
  - Due date scheduling

- **Time Tracking**
  - Log time spent on tasks
  - Track total time per task
  - Time distribution analysis