# Development Setup Guide

This guide outlines the steps to set up the development environment for the project, which consists of a **backend** (Node.js + Express) and a **frontend** (React). The backend connects to a MongoDB database and uses environment variables for configuration.

## Project Structure
```
project-root/
├── backend/
│   ├── .env
│   ├── node_modules/
│   ├── package.json
│   ├── server.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── middleware/
└── frontend/
    ├── node_modules/
    ├── package.json
    └── src/
```

## Prerequisites
Ensure the following tools are installed on your system:
- **Node.js** (v16 or higher): Download from [nodejs.org](https://nodejs.org/).
- **npm** (comes with Node.js) or **yarn** (optional): `npm install -g yarn`.
- **MongoDB Atlas Account**: The backend uses a cloud-hosted MongoDB database (MongoDB Atlas). Ensure you have access to the database specified in the `.env` file.
- **Git**: For cloning the repository (if applicable).
- **Code Editor**: Recommended: Visual Studio Code.

## Backend Setup

### 1. Navigate to the Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
Install the required Node.js packages:
```bash
npm install
```
or, if using Yarn:
```bash
yarn install
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` directory (or update it if it already exists) with the following content:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xdxyx.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0
PORT=3500
JWT_SECRET=<your_jwt_secret>
FRONTEND_URL=<your_frontend_url>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
```

**Replace the placeholders:**
- `<username>` and `<password>`: Your MongoDB Atlas credentials (do not use the provided credentials in production; they are sensitive).
- `<your_jwt_secret>`: A secure, randomly generated string for JWT signing (generate a new one for production).
- `<your_email>`: Your Gmail address for sending emails (e.g., a valid Gmail address).
- `<your_email_password>`: Your Gmail App Password (not your regular password; generate one from [Google Account Settings](https://myaccount.google.com/security)).

**Security Note**: Never commit the `.env` file to version control. Ensure `.env` is listed in `.gitignore`.

### 4. Run the Backend
Start the backend server in development mode:
```bash
npm run server
```
or, if using Yarn:
```bash
yarn server
```

you can also use:
```bash
node server.js
```
or, for development with hot-reloading (if `nodemon` is installed):
```bash
nodemon server.js
```

The server will run on `http://localhost:3500` (as specified by `PORT=3500`).

### 5. Verify Backend
- Ensure the server is running and connected to MongoDB Atlas.
- Test an endpoint (e.g., `/auth/register`) using a tool like [Postman](https://www.postman.com/) or `curl`:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"secure123","userType":"student"}' http://localhost:3500/auth/register
  ```

## Frontend Setup

### 1. Navigate to the Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
Install the required React packages:
```bash
npm install
```
or, if using Yarn:
```bash
yarn install
```

### 3. Configure Environment Variables (Optional)
The frontend may require environment variables (e.g., for API base URL). If needed, create a `.env` file in the `frontend/` directory:
```
VITE_API_URL=http://localhost:3500
```

**Note**: React environment variables must start with `VITE_` (if using Vite) or `REACT_APP_` (if using Create React App). Check your `frontend/package.json` to confirm the build tool (likely Vite, based on `FRONTEND_URL=https://localhost:5173`).

### 4. Run the Frontend
Start the React development server:
```bash
npm run dev
```
or, if using Yarn:
```bash
yarn dev
```

The frontend will run on `https://localhost:5173` (as specified by `FRONTEND_URL` in the backend `.env`). Open this URL in a browser to view the application.

### 5. Verify Frontend
- Ensure the React app loads in the browser.
- Test a feature that interacts with the backend (e.g., login or registration) to confirm connectivity.

## Additional Setup

### MongoDB Atlas
- The `MONGODB_URI` connects to a MongoDB Atlas cluster. Ensure your IP is whitelisted in the MongoDB Atlas dashboard under **Network Access**.
- Verify the database name (`mydb`) and collection names (e.g., `users`, `posts`, `subjects`, `applications`, `messages`, `conversations`) match those expected by the backend models.

### Email Configuration
- The backend uses Gmail for sending emails (e.g., password reset emails). Ensure `EMAIL_USER` is a valid Gmail address and `EMAIL_PASS` is a Gmail App Password.
- To generate an App Password:
  1. Enable 2-Step Verification in your Google Account.
  2. Go to [Google Account Security](https://myaccount.google.com/security) > **App Passwords**.
  3. Generate a password for "Mail" and use it as `EMAIL_PASS`.

### WebSocket Setup (Optional)
- The `/message` endpoints use `socket.io` for real-time messaging. Ensure the WebSocket server is configured in `backend/socket/socket.js` and the frontend is set up to connect to it (e.g., via `socket.io-client`).

## Troubleshooting
- **Backend Fails to Connect to MongoDB**:
  - Verify `MONGODB_URI` credentials and database name.
  - Check MongoDB Atlas **Network Access** settings.
- **CORS Issues**:
  - Ensure the backend includes CORS middleware allowing `https://localhost:5173`.
  - Example in `backend/index.js`:
    ```javascript
    const cors = require('cors');
    app.use(cors({ origin: 'https://localhost:5173' }));
    ```
- **Email Sending Fails**:
  - Confirm `EMAIL_USER` and `EMAIL_PASS` are correct.
  - Check Gmail security settings and App Password configuration.
- **Frontend Cannot Connect to Backend**:
  - Verify the backend is running on `http://localhost:3500`.
  - Check the frontend’s API base URL in its `.env` file.

## Security Considerations
- **Sensitive Data**: Do not expose `.env` files or sensitive values (e.g., `MONGODB_URI`, `JWT_SECRET`, `EMAIL_PASS`) in public repositories or client-side code.
- **Production**: For production, use secure hosting (e.g., HTTPS), rotate `JWT_SECRET`, and store environment variables in a secure vault (e.g., AWS Secrets Manager).
- **Authentication**: Several endpoints (e.g., `/profile`, `/conversation`) lack authentication. Add JWT token validation to secure them.

## Running the Full Application
1. Open two terminal windows.
2. In the first, start the backend:
   ```bash
   cd backend && npm run server 
   ```
3. In the second, start the frontend:
   ```bash
   cd frontend && npm run dev
   ```
4. Access the application at `https://localhost:5173` in your browser.

## Next Steps
- Explore the API documentation for each route (`/auth`, `/post`, `/apply`, `/message`, `/conversation`, `/subjects`, `/profile`) to understand available endpoints.
- Test the application locally and report any issues to the development team.
- For production deployment, configure a reverse proxy (e.g., Nginx), set up HTTPS, and use a production-grade database connection.