const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Better error logging
mongoose.set('debug', true);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr_attendance';

// Import routes
const authRoutes = require('./routes/auth');

// Connect to MongoDB with better error handling
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const attendanceRoutes = require('./routes/attendance');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => res.json({ ok: true, message: 'QR Attendance Backend' }));

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed minimal data if missing
    const User = require('./models/User');
    const Course = require('./models/Course');
    const bcrypt = require('bcryptjs');

    (async () => {
      const admin = await User.findOne({ username: 'admin' });
      if (!admin) {
        await new User({ username: 'admin', password: bcrypt.hashSync('admin123', 8), role: 'admin', name: 'System Administrator' }).save();
        console.log('Seeded admin user (admin/admin123)');
      }

      const t = await User.findOne({ username: 'teacher1' });
      if (!t) {
        await new User({ username: 'teacher1', password: bcrypt.hashSync('teacher123', 8), role: 'teacher', name: 'Ali Ahmed', courses: ['CS101'] }).save();
        console.log('Seeded teacher1 (teacher123)');
      }

      const s = await User.findOne({ username: 'student1' });
      if (!s) {
        await new User({ username: 'student1', password: bcrypt.hashSync('student123', 8), role: 'student', name: 'Student One', rollNo: '001', courses: ['CS101'] }).save();
        console.log('Seeded student1 (student123)');
      }

      const course = await Course.findOne({ code: 'CS101' });
      if (!course) {
        await new Course({ code: 'CS101', name: 'Introduction to Programming' }).save();
        console.log('Seeded course CS101');
      }

      app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    })();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });