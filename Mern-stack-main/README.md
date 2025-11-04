# 🎯 QR Attendance System

A modern, full-stack web application for managing student attendance using QR code technology. Built with React.js frontend and Node.js/Express backend with MongoDB database.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Default Login Credentials](#default-login-credentials)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Quiz 1 Requirements Fulfilled](#quiz-1-requirements-fulfilled)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Admin Dashboard
- 👥 **Student Management**: Add, view, and manage students
- 👨‍🏫 **Teacher Management**: Add, view, and manage teachers
- 📚 **Course Management**: Create and manage courses
- 🔗 **Course Assignment**: Assign teachers to courses and students to courses
- 📊 **Reports**: View attendance reports and analytics
- 🔍 **Search Functionality**: Search courses and students

### Teacher Dashboard
- 📱 **QR Code Generation**: Generate time-limited QR codes for attendance
- 👀 **Attendance Monitoring**: View real-time attendance data
- 📈 **Reports**: Generate attendance reports by course and date
- 🚫 **No Class Management**: Mark days when no class is held

### Student Dashboard
- 📷 **QR Code Scanner**: Scan QR codes using device camera
- ✅ **Attendance Tracking**: View today's attendance status
- 📅 **Monthly Reports**: View attendance history by month
- 📱 **Mobile Responsive**: Works on all devices

## 🛠 Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool and development server
- **React Router** - Navigation and routing
- **TailwindCSS** - Styling framework
- **Three.js** - 3D animations
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **jsQR** - QR code scanning

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **QRCode** - QR code generation
- **PDFKit** - PDF generation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB** (Community Edition)
   - Download from: https://www.mongodb.com/try/download/community
   - Make sure MongoDB service is running
   - Default connection: `mongodb://127.0.0.1:27017`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

## 🚀 Installation

### Quick Start Commands
```bash
# 1. Navigate to project directory
cd Mern-stack-main

# 2. Install Backend Dependencies
cd Backend
npm install

# 3. Install Frontend Dependencies
cd ../Frontend
npm install

# 4. If missing dependencies error occurs:
npm install react-helmet framer-motion lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge tailwindcss-animate

# 5. Start Backend (Terminal 1)
cd ../Backend
npm run dev

# 6. Start Frontend (Terminal 2)
cd ../Frontend
npm run dev
```

### Detailed Installation Steps

### Step 1: Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd Mern-stack-main

# Or download and extract the ZIP file
```

### Step 2: Install Backend Dependencies
```bash
cd Backend
npm install
```

**Backend Dependencies (automatically installed):**
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- qrcode
- pdfkit
- nodemon (dev dependency)

### Step 3: Install Frontend Dependencies
```bash
cd ../Frontend
npm install
```

**If you encounter missing dependencies errors, install them manually:**
```bash
# Core React dependencies (should be installed automatically)
npm install react react-dom react-router-dom

# UI and Animation libraries
npm install react-helmet framer-motion lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# QR Code and 3D libraries
npm install jsqr qrcode.react three

# Development dependencies
npm install @vitejs/plugin-react autoprefixer postcss tailwindcss vite tailwindcss-animate
```

**Frontend Dependencies (automatically installed):**
- react, react-dom, react-router-dom
- jsqr, qrcode.react, three
- react-helmet, framer-motion, lucide-react
- @radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge
- @vitejs/plugin-react, autoprefixer, postcss, tailwindcss, vite, tailwindcss-animate

### Step 4: Environment Configuration
The backend is pre-configured with environment variables in `.env.local`:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/qr_attendance
JWT_SECRET=your-secret-key-123
```

## ▶️ Running the Application

### Method 1: Run Both Servers Separately (Recommended)

#### Terminal 1 - Start Backend Server
```bash
cd Backend
npm run dev
```
✅ Backend will run on: `http://localhost:5000`

#### Terminal 2 - Start Frontend Server
```bash
cd Frontend
npm run dev
```
✅ Frontend will run on: `http://localhost:3000`

### Method 2: Production Mode
```bash
# Backend
cd Backend
npm start

# Frontend (in another terminal)
cd Frontend
npm run build
npm run preview
```

## 🔐 Default Login Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Dashboard**: `http://localhost:3000/admin`

### Teacher Access
- **Username**: `teacher1`
- **Password**: `teacher123`
- **Dashboard**: `http://localhost:3000/teacher`

### Student Access
- **Username**: `student23021519-084`
- **Password**: `student123`
- **Dashboard**: `http://localhost:3000/student`

## 📁 Project Structure

```
Mern-stack-main/
├── Backend/                 # Node.js/Express Backend
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models (User, Course, etc.)
│   ├── routes/            # API routes (auth, admin, teacher, etc.)
│   ├── .env.local         # Environment variables
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
│
├── Frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components (Admin, Teacher, Student)
│   │   ├── lib/           # Utility functions
│   │   ├── system.jsx     # API service layer
│   │   └── main.jsx       # React entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
│
└── README.md              # This file
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/students` - Add new student
- `POST /api/admin/courses` - Add new course
- `DELETE /api/admin/users/:id` - Remove user

### Teacher Routes
- `POST /api/teacher/generate` - Generate QR code
- `GET /api/teacher/current` - Get current QR code
- `GET /api/teacher/attendance` - Get attendance data

### Student Routes
- `POST /api/attendance/scan` - Mark attendance via QR scan
- `GET /api/attendance/today` - Get today's attendance
- `GET /api/attendance/month` - Get monthly attendance

## ✅ Quiz 1 Requirements Fulfilled

This project fulfills all Quiz 1 requirements:

1. ✅ **Registration Form Client-Side Validation**
   - HTML5 validation with required fields
   - Email format validation
   - Role-specific field validation (roll number for students)

2. ✅ **Registration Form Server-Side Validation**
   - Backend validation for required fields
   - Duplicate user checking
   - Role validation

3. ✅ **Database Data Saving**
   - MongoDB integration with Mongoose
   - User data stored with proper schema
   - Password hashing with bcryptjs

4. ✅ **Redirect to Login After Registration**
   - Success message display
   - Automatic tab switch to login form

5. ✅ **Login Page Design/Creation**
   - Modern UI with Three.js animations
   - Professional styling with TailwindCSS
   - Responsive design

6. ✅ **Login Client-Side Validation**
   - HTML5 form validation
   - Required field checking
   - Email format validation

7. ✅ **Login Server-Side Validation**
   - Backend credential validation
   - Proper error handling and responses

8. ✅ **Database Comparison & Token Generation**
   - Password comparison with bcrypt
   - JWT token generation
   - Role-based redirection

9. ✅ **Dashboard Page Specifications**
   - Complete Admin dashboard with full CRUD operations
   - Teacher dashboard with QR generation and attendance
   - Student dashboard with QR scanning and reports

10. ✅ **Logout Button on Dashboard**
    - Logout functionality on all dashboards
    - Session cleanup and redirection

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```bash
# Make sure MongoDB service is running
# Windows:
net start MongoDB

# macOS:
brew services start mongodb/brew/mongodb-community

# Linux:
sudo systemctl start mongod
```

#### 2. Port Already in Use
```bash
# Kill processes on ports 3000 or 5000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

#### 3. Dependencies Installation Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. Missing Frontend Dependencies Error
If you see errors like "Cannot find module 'react-helmet'" or similar:
```bash
cd Frontend
npm install react-helmet framer-motion lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge tailwindcss-animate
```

#### 5. Vite Build Errors
If Vite shows dependency resolution errors:
```bash
cd Frontend
npm install --force
# or
npm install --legacy-peer-deps
```

#### 4. Camera Access Issues (QR Scanner)
- Ensure you're accessing the app via `https://` or `localhost`
- Grant camera permissions when prompted
- Use a modern browser (Chrome, Firefox, Safari, Edge)

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Mobile Support
The application is fully responsive and works on:
- 📱 Mobile phones (iOS/Android)
- 📱 Tablets
- 💻 Desktop computers
- 💻 Laptops

## 🎓 Educational Value
This project demonstrates:
- Full-stack web development
- Modern React patterns and hooks
- RESTful API design
- Database design and operations
- Authentication and authorization
- Real-time features
- Mobile-responsive design
- Modern development tools and practices

## 📞 Support
If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed correctly
3. Verify MongoDB is running
4. Check console logs for error messages

---

**Built with ❤️ for educational purposes**

*This project showcases modern web development practices and fulfills all Quiz 1 requirements for the web development course.*
