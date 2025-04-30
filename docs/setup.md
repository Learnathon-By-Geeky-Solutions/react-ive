# Development Setup Guide

This guide details the setup process for the project's development environment, featuring a **Node.js + Express backend** and a **React frontend**. The backend connects to MongoDB Atlas, supports Google Authentication, and uses Cloudinary for file uploads.

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
    ├── .env
    ├── node_modules/
    ├── package.json
    └── src/
```

## Prerequisites
Install the following:
- **Node.js** (v16+): [nodejs.org](https://nodejs.org/)
- **npm** (included with Node.js) or **yarn**: `npm install -g yarn`
- **MongoDB Atlas Account**: For cloud-hosted database
- **Google Cloud Account**: For Google Auth credentials
- **Cloudinary Account**: For file uploads
- **Git**: For repository cloning
- **Code Editor**: e.g., Visual Studio Code

## Backend Setup

### 1. Navigate to Backend
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```
or:
```bash
yarn install
```

### 3. Configure Environment Variables
Create a `.env` file in `backend/` with:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xdxyx.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0
PORT=3500
JWT_SECRET=<your_jwt_secret>
FRONTEND_URL="http://localhost:5173"
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_REDIRECT_URI=http://localhost:3500/auth/google/callback
NODE_ENV="development"
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
```

**Notes**:
- **MongoDB Atlas**: Replace `<username>` and `<password>` with your credentials.
- **JWT_SECRET**: Use a secure, randomly generated string.
- **EMAIL_USER/PASS**: Use a Gmail address and App Password ([Google Account Settings](https://myaccount.google.com/security)).
- **Google Auth**: Obtain `<your_google_client_id>` and `<your_google_client_secret>` from [Google Cloud Console](https://console.cloud.google.com/). Add `GOOGLE_REDIRECT_URI` to Authorized Redirect URIs.
- **Cloudinary**: Get credentials from [Cloudinary Dashboard](https://cloudinary.com/).
- **Security**: Add `.env` to `.gitignore`.

### 4. Run the Backend
```bash
npm run server
```
or:
```bash
node server.js
```
or, with hot-reloading (if `nodemon` installed):
```bash
nodemon server.js
```

Server runs on `http://localhost:3500`.

### 5. Verify Backend
- Confirm MongoDB connection.
- Test an endpoint (e.g., `/auth/register`):
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Test User","email":"test@example.com","password":"secure123","userType":"student"}' http://localhost:3500/auth/register
```
- Test Google Auth via `/auth/google`.

## Frontend Setup

### 1. Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```
or:
```bash
yarn install
```

### 3. Configure Environment Variables
Create a `.env` file in `frontend/` with:
```
VITE_REACT_APP_GOOGLE_CLIENT_ID=<your_google_client_id>
VITE_REACT_BACKEND_URL="http://localhost:3500"
```

**Note**: Use `VITE_` prefix for Vite-based projects (confirm in `frontend/package.json`).

### 4. Run the Frontend
```bash
npm run dev
```
or:
```bash
yarn dev
```

App runs on `https://localhost:5173`.

### 5. Verify Frontend
- Check if the app loads in the browser.
- Test features like login or Google Auth.

## Additional Setup

### MongoDB Atlas
- Whitelist your IP in MongoDB Atlas (**Network Access**).
- Verify database (`mydb`) and collections (e.g., `users`, `posts`).

### Google Authentication
- Backend handles OAuth callbacks at `/auth/google/callback`.
- Frontend uses `VITE_REACT_APP_GOOGLE_CLIENT_ID` (e.g., with `@react-oauth/google`).

### Email Configuration
- Uses Gmail for emails. Verify `EMAIL_USER` and `EMAIL_PASS`.
- Generate App Password:
  1. Enable 2-Step Verification in Google Account.
  2. Go to [App Passwords](https://myaccount.google.com/security).
  3. Generate password for "Mail".

### Cloudinary
- Used for file uploads. Ensure `CLOUDINARY_*` variables are set.

### WebSocket (Optional)
- Real-time messaging via `/message` endpoints uses `socket.io`. Verify setup in `backend/socket/socket.js` and frontend (`socket.io-client`).

## Troubleshooting
- **MongoDB Connection Failure**:
  - Check `MONGODB_URI` and Atlas **Network Access**.
- **CORS Issues**:
  - Add CORS middleware in `backend/server.js`:
    ```javascript
    app.use(cors({ origin: 'https://localhost:5173' }));
    ```
- **Email Issues**:
  - Verify `EMAIL_USER/PASS` and Gmail settings.
- **Frontend-Backend Connection**:
  - Ensure backend runs on `http://localhost:3500` and `VITE_REACT_BACKEND_URL` is correct.

## Security Considerations
- **Sensitive Data**: Keep `.env` files out of version control.
- **Production**:
  - Use HTTPS, rotate `JWT_SECRET`, and store secrets securely (e.g., AWS Secrets Manager).
  - Add JWT authentication to endpoints like `/profile`, `/conversation`.
- **Google Auth**: Restrict API key usage in Google Cloud Console.

## Running the Application
1. Open two terminals.
2. Backend:
```bash
cd backend && npm run server
```
3. Frontend:
```bash
cd frontend && npm run dev
```
4. Access at `https://localhost:5173`.

## Next Steps
- Review API routes (`/auth`, `/post`, `/apply`, `/message`, `/conversation`, `/subjects`, `/profile`).
- Test locally and report issues.
- For production, use a reverse proxy (e.g., Nginx), HTTPS, and a secure database connection.
