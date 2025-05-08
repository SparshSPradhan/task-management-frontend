Technologies Incorporated
Frontend
React:
Used as the primary JavaScript library for building the user interface.
Evidence: useState, useEffect hooks in dashboard.js and TaskForm.js, and component-based structure (TaskForm, TaskCard, NotificationList).
Version: Likely ^18.2.0 (common for Next.js projects in 2025).
Next.js:
A React framework for server-side rendering, static site generation, and API routes.
Evidence: File structure (frontend/pages/dashboard.js), useRouter from next/router, and environment variables prefixed with NEXT_PUBLIC_.
Version: Likely ^14.2.3 (based on typical Next.js projects).
Axios:
A promise-based HTTP client for making API requests.
Evidence: Used in dashboard.js and TaskForm.js for GET and POST requests to the backend (e.g., axios.get, axios.post).
Version: Likely ^1.7.2 (common in recent projects).
Socket.IO (Client):
Used for real-time notifications (e.g., task assignment notifications).
Evidence: NEXT_PUBLIC_SOCKET_URL in environment variables and likely used in NotificationList.js for WebSocket communication.
Version: Not specified, but typically matches backend Socket.IO version.
Tailwind CSS:
A utility-first CSS framework for styling the UI.
Evidence: Classes like bg-gray-50, min-h-screen, max-w-7xl, px-4, sm:px-6, lg:px-8, py-8, bg-white, shadow-sm, rounded-lg, text-3xl, font-bold, text-gray-800 in dashboard.js and TaskForm.js.
React Memo:
Used for performance optimization to prevent unnecessary re-renders.
Evidence: memo in TaskForm.js (export default memo(TaskForm)).
Backend
Node.js:
The runtime environment for the backend server.
Evidence: Backend files (taskController.js) use CommonJS (require) and are deployed on Render, which supports Node.js.
Express.js:
A web framework for Node.js to handle API routes and middleware.
Evidence: Implied by req, res, and app.set('io') in taskController.js, and typical for Socket.IO integration.
MongoDB:
A NoSQL database for storing tasks, users, and notifications.
Evidence: MONGODB_URI in environment variables (mongodb+srv://...@cluster0testing.advfg.mongodb.net/task-management) and Mongoose usage in taskController.js.
Mongoose:
An Object Data Modeling (ODM) library for MongoDB and Node.js.
Evidence: Task and User models in taskController.js (Task.find, Task.save, populate), and mongoose.Types.ObjectId.isValid.
Socket.IO (Server):
Used for real-time notifications to users when tasks are assigned.
Evidence: req.app.get('io') and io.to(assignedTo).emit('notification', ...) in taskController.js.
JSON Web Tokens (JWT):
Used for authentication and authorization.
Evidence: Authorization: Bearer <token> headers in API requests and JWT_SECRET in environment variables.
Deployment and Infrastructure
Vercel:
Platform for hosting the frontend.
Evidence: Frontend URL (https://task-management-frontend-sparsh-km8fi7xcc.vercel.app) and NEXT_PUBLIC_ environment variables.
Render:
Platform for hosting the backend and MongoDB connection.
Evidence: Backend URL (https://task-management-backend-vl3p.onrender.com) and Render-specific environment variables (PORT=5003).
MongoDB Atlas:
Cloud-hosted MongoDB database.
Evidence: MONGODB_URI (mongodb+srv://sparshmillion11:...@cluster0testing.advfg.mongodb.net/task-management).
Development Tools
Git:
Version control system for managing code.
Evidence: Instructions for git add, git commit, and git push in deployment steps.
GitHub:
Repository hosting for frontend and backend code.
Evidence: Implied by deployment instructions (git push origin main).
npm:
Package manager for installing dependencies.
Evidence: Implied by package.json dependencies (axios, react, next) and npm install commands.
Additional Technologies (Inferred)
ESLint (Likely):
Linting tool for JavaScript/React code quality.
Inferred: Common in Next.js projects for consistent code style.
Postman (Likely):
API testing tool.
Inferred: Suggested for testing GET /api/tasks and POST /api/tasks in troubleshooting steps.
WebSocket:
Protocol for real-time communication via Socket.IO.
Evidence: NEXT_PUBLIC_SOCKET_URL and Socket.IO usage.
