Task Management Frontend
This is the frontend for a task management application built with Next.js, React, and Tailwind CSS. It provides a user interface for creating, viewing, and managing tasks, with real-time notifications for task assignments.
Features

User authentication (login, register, logout).
Task creation, editing, and deletion.
Task filtering by priority, status, and search query.
Real-time notifications for assigned tasks using Socket.IO.
Responsive UI with grid/list views for tasks.
Task assignment to users with priority and status management.

Technologies

Next.js: React framework for server-side rendering and routing.
React: Component-based UI library.
Axios: HTTP client for API requests.
Socket.IO (Client): Real-time notifications.
Tailwind CSS: Utility-first CSS framework for styling.
React Memo: Performance optimization for components.

Prerequisites

Node.js (v16 or higher)
npm (v8 or higher)
Vercel account for deployment
Backend API running (see Backend README)

Setup Instructions

Clone the Repository:
git clone https://github.com/<your-repo>/task-management-frontend.git
cd task-management-frontend


Install Dependencies:
npm install


Configure Environment Variables:Create a .env.local file in the root directory and add:
NEXT_PUBLIC_API_URL=https://task-management-backend-vl3p.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://task-management-backend-vl3p.onrender.com


NEXT_PUBLIC_API_URL: Backend API endpoint.
NEXT_PUBLIC_SOCKET_URL: Backend Socket.IO endpoint.


Run Locally:
npm run dev

Open http://localhost:3000 in your browser.


Project Structure
task-management-frontend/
├── components/          # React components (TaskForm.js, TaskCard.js, NotificationList.js)
├── pages/              # Next.js pages (dashboard.js, login.js, register.js)
├── public/             # Static assets
├── styles/             # Global CSS (if any)
├── .env.local          # Environment variables (not tracked)
├── package.json        # Dependencies and scripts
├── next.config.js      # Next.js configuration
└── README.md           # This file

Deployment to Vercel

Push to GitHub:
git add .
git commit -m "Initial commit"
git push origin main


Set Up Vercel:

Go to Vercel and create a new project.
Connect your GitHub repository.
Configure environment variables in Vercel dashboard:NEXT_PUBLIC_API_URL=https://task-management-backend-vl3p.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://task-management-backend-vl3p.onrender.com




Deploy:

Vercel automatically deploys on git push.
Access the deployed app at https://task-management-frontend-sparsh-f9l2kw6jp.vercel.app/login.



Scripts

npm run dev: Start development server.
npm run build: Build production bundle.
npm run start: Start production server.

Troubleshooting

API Errors: Ensure NEXT_PUBLIC_API_URL matches the backend URL.
Socket.IO Issues: Verify NEXT_PUBLIC_SOCKET_URL and backend Socket.IO setup.
Console Errors: Check browser DevTools (F12 > Console) for logs (e.g., TaskForm rendered, Fetched tasks).

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

