# TaskNest
This project is a MERN (MongoDB, Express, React, Node.js) stack application named **TaskNest**. It is a task management system with features like user authentication, task creation, editing, filtering, and OTP-based verification. Here's a summary of its key components:

### Features:
1. **User Authentication**:
   - Users can register and log in using their email or username.
   - Passwords are hashed using bcrypt.
   - JWT tokens are used for session management.
   - OTP-based verification is implemented for additional security.

2. **Task Management**:
   - Users can create, edit, delete, and filter tasks.
   - Tasks have attributes like title, description, duration, priority, and status.
   - Tasks are associated with specific users.

3. **Profile Management**:
   - Users can update their profile information, including uploading a profile picture.

4. **OTP Verification**:
   - OTPs are generated and sent via email using Nodemailer.
   - OTPs are stored temporarily in memory and verified during login or registration.

5. **UI**:
   - The application uses EJS templates for rendering views.
   - CSS files provide styling for pages like login, task management, and profile editing.

6. **Database**:
   - MongoDB is used to store user and task data.

---

### Key Files:
- **Backend**:
  - app.js: Main entry point for the Express server.
  - routes: Contains route handlers for users, tasks, and APIs.
  - middlewares: Includes authentication and login middleware.
  - models: Defines Mongoose schemas for users and tasks.
  - utils: Utility functions for password encryption, OTP generation, and token handling.
  - nodemailer.js: Handles email sending.

- **Frontend**:
  - views: EJS templates for rendering pages like login, task list, and profile editing.
  - public: Static assets like CSS and JavaScript files.

- **Database**:
  - mongodbconnection.js: Establishes a connection to the MongoDB database.
