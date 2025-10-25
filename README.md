# HATS - Hybrid Application Tracking System

A full-stack MERN application that combines automated and manual processing for job applications. Technical roles are automatically processed by a bot system, while non-technical roles are handled manually by administrators.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Test Credentials](#test-credentials)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Known Issues & Limitations](#known-issues--limitations)
- [Future Enhancements](#future-enhancements)

---

## Overview

HATS (Hybrid Application Tracking System) is designed to streamline the job application process by automating repetitive tasks for technical positions while allowing human oversight for non-technical roles. This hybrid approach ensures efficiency without sacrificing quality control where it matters most.

### The Problem It Solves

Traditional application tracking systems are either fully manual (time-consuming) or fully automated (lacks human judgment). HATS combines both approaches based on job type, giving you the best of both worlds.

---

## Features

### For Applicants
- ✅ Register and create account
- ✅ Browse available job postings
- ✅ Apply for jobs with personal comments
- ✅ Track application status in real-time
- ✅ View detailed application history
- ✅ Personal dashboard with statistics

### For Administrators
- ✅ Post and manage job openings
- ✅ View all applications across the system
- ✅ Manually update application statuses
- ✅ Add comments and notes to applications
- ✅ Comprehensive dashboard with charts
- ✅ Full traceability of all actions

### For Bot Mimic (Automation)
- ✅ Automatically process technical applications
- ✅ Update statuses from "Applied" to "Reviewed"
- ✅ Log all automated actions
- ✅ View technical application statistics
- ✅ On-demand automation trigger

### System-Wide
- ✅ Role-based authentication (JWT)
- ✅ Complete activity logging
- ✅ Status timeline tracking
- ✅ Comment system with timestamps
- ✅ Responsive dashboard with charts
- ✅ Secure company ID verification for admin/bot

---

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Bootstrap** - Styling

---

## Getting Started

### Prerequisites

Make sure you have these installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adithyakiran47/hats-project
   cd HATS
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/hats
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   ```

5. **Start MongoDB**
   ```bash
   # If using MongoDB locally
   mongod
   ```

6. **Seed the database** 

   You can manually create users in MongoDB or register via the app. For admin and bot users, you need to add them directly to the database since they require company ID verification.

   Open MongoDB Compass or shell and insert:
   ```javascript
   use hats;
   
   db.users.insertMany([
     {
       name: "admin",
      email: "admin@gmail.com",
      password: "$2b$10$MUwXCZ3cra8BlbmkSMIZDOYaw6NPq0m5AoYW4v4AJQsUa.J0X.5BS", // bcrypt hash of "2168"
      role: "admin"
     },
     {
       name: "bot",
       email: "botmimic@gmail.com",
       password: "$2b$10$iXYXBwrDKsa1pIAu.RyMmeMkl2k.w0fW5cmTZfZESsEPK78fYkMdG", // bcrypt hash of "2168"
       role: "botmimic"
     }
   ]);
   ```

7. **Start the backend server**
   ```bash
   cd backend
   node server.js
   ```
   You should see: `Server running on port 5000` and `MongoDB connected`

8. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Your browser should open automatically at `http://localhost:3000`

---

## Project Structure

```
HATS/
├── backend/
│   ├── controllers/
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   └── botMimicController.js
│   ├── middleware/
│   │   └── authenticateJWT.js
│   ├── models/
│   │   ├── ActivityLog.js
│   │   ├── Application.js
│   │   ├── Job.js
│   │   └── User.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── application.js
│   │   ├── auth.js
│   │   ├── automation.js
│   │   ├── botMimic.js
│   │   ├── botMimicRoutes.js
│   │   ├── dashboard.js
│   │   └── job.js
│   ├── services/
│   │   └── botMimicService.js
│   ├── .env
│   ├── botMimicRunner.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── hats-frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── ActivityLogs.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminJobPost.js
│   │   │   ├── AdminMetricsDashboard.js
│   │   │   ├── ApplicantDashboard.js
│   │   │   ├── ApplicationCreate.js
│   │   │   ├── ApplicationDetails.js
│   │   │   ├── ApplicationList.js
│   │   │   ├── ApplicationStatusTimeline.js
│   │   │   ├── BotMimicDashboard.js
│   │   │   ├── JobListWithApply.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── StatusUpdateForm.js
│   │   │   └── UpdateStatus.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── logo.svg
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── README.md
├── API_DOCUMENTATION.md
├── HATS_Postman_Collection.json

```

---

## User Roles

### Applicant
- Can register and login without company ID
- Browse and apply for jobs
- View their own applications only
- Cannot update application statuses
- Personal dashboard with their stats

### Admin
- Requires company ID (`companyid1`) for login
- Create, update, and delete job postings
- View all applications (technical and non-technical)
- Manually update application statuses
- Add comments to applications
- Full dashboard with system-wide stats

### Bot Mimic
- Requires company ID (`companyid1`) for login
- View only technical applications
- Run automation to process applications
- Cannot manually update statuses (automation does it)
- Dashboard showing technical application stats
- View automation logs

---

## Test Credentials

### Option 1: Use Pre-Created Accounts

If you seeded the database, use these credentials:

**Applicant** (Create via registration)
```
1. Go to http://localhost:3000
2. Click "Register"
3. Fill in your details
```

**Admin**
```
Email: admin@gmail.com
Password: 2168
Company ID: companyid1
```

**Bot Mimic**
```
Email: botmimic@gmail.com
Password: 2168
Company ID: companyid1
```

### Option 2: Testing Workflow

1. **Register as applicant** → Apply for jobs
2. **Login as admin** → Create jobs, view applications
3. **Login as bot** → Run automation on technical apps
4. **Check dashboards** → See stats and charts

---

## API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`.

### Quick API Reference

**Base URL:** `http://localhost:5000/api`

**Authentication:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Key Endpoints:**
- `POST /auth/register` - Register new applicant
- `POST /auth/login` - Login (all roles)
- `GET /job/list` - Get all jobs
- `POST /job/create` - Create job (admin only)
- `POST /application/create` - Apply for job
- `GET /application/list` - Get applications (role-based)
- `PUT /application/update-status/:id` - Update status (admin/bot)
- `POST /automation/run` - Run bot automation
- `GET /dashboard/stats` - Get dashboard statistics

### Testing with Postman

1. Import `HATS-Complete-API.json`
2. Set `base_url` variable to `http://localhost:5000/api`
3. Login and copy JWT token
4. Set `jwt_token` variable
5. Test all endpoints

---

### Applicant View
- Dashboard with personal application stats
- Job browsing and application interface
- Application status tracking

### Admin View
- Job posting management
- All applications overview
- System-wide dashboard with charts

### Bot Mimic View
- Technical applications dashboard
- Automation controls
- Activity logs


## Known Issues & Limitations

### Current Limitations
1. **No Email Notifications** - Status changes don't trigger email alerts
2. **Single Company Support** - Only one company ID (`companyid1`) is supported
3. **Basic Search** - No advanced filtering or search functionality
4. **No File Uploads** - Can't attach resumes or documents
5. **Manual Bot Trigger** - Automation must be triggered manually, not scheduled

### Workarounds
- **Admin/Bot Creation**: Must be added directly to database (can't self-register)
- **Company ID**: Hardcoded as `companyid1` - change in `backend/routes/auth.js` if needed

---

## Future Enhancements

### Planned Features
- [ ] Email notifications for status updates
- [ ]  Resume upload and storage
- [ ] Advanced search and filtering
- [ ] Scheduled automation (cron jobs)
- [ ] Multi-company support
- [ ] Interview scheduling integration
- [ ] Export applications to CSV/PDF
- [ ] Real-time notifications (WebSocket)
- [ ] Application analytics and insights
- [ ] Mobile responsive improvements

---

## Troubleshooting

### Backend won't start
```bash
# Check if MongoDB is running
mongod --version

# Check if port 5000 is available
netstat -ano | findstr :5000

# Check environment variables
cat backend/.env
```

### Frontend won't connect to backend
1. Verify backend is running on port 5000
2. Check `frontend/src/api/api.js` has correct base URL
3. Clear browser cache and restart

### Can't login as admin/bot
1. Verify users exist in database:
   ```javascript
   db.users.find({ role: "admin" })
   ```
2. Make sure you're using `companyid1` as Company ID
3. Check password is hashed correctly

### Automation not working
1. Verify you're logged in as admin or bot
2. Check if technical applications with "Applied" status exist
3. Check backend console for errors

---

## Contributing

This is a POC project for evaluation purposes. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

This project is created for educational and evaluation purposes.

---

## Contact

For questions or support:
- **Email**: adithya44kiran@gmail.com
- **GitHub**: https://github.com/adithyakiran47/hats-project

---

## Acknowledgments

- Built as part of Round 2 MERN Engineer evaluation
- Uses Bootstrap for UI components
- Charts powered by Recharts library
- Icons and design inspired by modern application tracking systems

---

Thank you
