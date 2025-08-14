# Healthcare MVP Web App

## Overview
This is a prototype React application for a healthcare MVP. It features secure JWT-based login and role-based dashboards. No signup functionality is included; users log in directly. The app uses Redux for state management, React Router for routing, Tailwind CSS for styling, and Axios for API calls.

### Key Features
- Secure login with JWT authentication (token refresh handled automatically).
- Role-based access: Super Admin, Hospital Admin, Doctor, Tech Advisor, etc.
- Dashboards redirected based on user role.
- Private routes protected.
- Professional UI with Tailwind CSS.
- Toast notifications for feedback.
- Loading spinners and error handling.

### Technologies
- React 18
- TypeScript
- Redux Toolkit
- React Router v6
- Tailwind CSS
- Axios
- React Hot Toast
- CryptoJS (for local storage encryption)

## Setup and Installation

### Prerequisites
- Node.js >= 18
- npm or yarn
- Backend server running at `http://localhost:8080` (configure in `.env` if different)

### Steps
1. Clone the repository:

git clone <repo-url>
cd healthcare-mvp-web</repo-url>

2. Install dependencies:
npm install

3. Create `.env` file (optional):
REACT_APP_API_URL=http://localhost:8080/api

4. Run the app:
npm start

5. Opens at `http://localhost:3000`

6. Build for production:
   npm run build

8. Test:
   npm test

9. t### Docker (Optional)
- Build image: `docker build -t healthcare-mvp-web .`
- Run: `docker run -p 3000:3000 healthcare-mvp-web`

## Usage
- Navigate to `/login`.
- Enter credentials (provided by backend).
- Upon successful login, redirected to role-based dashboard.
- Logout clears session and redirects to login.

### Roles and Dashboards
- **SUPER_ADMIN**: `/admin/dashboard`
- **HOSPITAL_ADMIN**: `/hospital/dashboard`
- **DOCTOR**: `/doctor/dashboard`
- **TECH_ADVISOR**: `/advisor/dashboard`
- Others: Similar pattern (add as needed).

## Security Notes
- Tokens stored in localStorage (consider httpOnly cookies for production).
- User data encrypted in storage using CryptoJS (use secure key in prod).
- Axios interceptors handle token refresh on 401.
- All API calls use JWT bearer token.
- Validate tokens on app load via `checkAuthStatus`.
- Bypass AWS Cognito: All Amplify code removed; use JWT endpoints.

## Troubleshooting
- **CSS not applying**: Ensure Tailwind is configured in `tailwind.config.js` and `craco.config.js`.
- **Compilation errors**: Check imports; remove duplicates (e.g., multiple stores).
- **API errors**: Verify backend is running and endpoints match (e.g., `/api/auth/login`).
- **Role redirect issues**: Ensure backend returns `role` in user object.

## Future Improvements
- Add forgot password.
- Implement MFA.
- Use secure cookie storage for tokens.
- Add unit/integration tests.
- Optimize performance with lazy loading.

For issues, contact [your email].