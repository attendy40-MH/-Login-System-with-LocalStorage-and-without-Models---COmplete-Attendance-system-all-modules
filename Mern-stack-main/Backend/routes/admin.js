const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const { authMiddleware, permit } = require('../middleware/auth');

// All admin routes require admin role
router.use(authMiddleware, permit('admin'));

// POST /api/admin/students - add student
router.post('/students', async (req, res) => {
  try {
    const { name, rollNo } = req.body;
    if (!rollNo || !name) return res.status(400).json({ message: 'name and rollNo required' });

    // Create username as lowercase version of name
    const username = name.toLowerCase().replace(/\s+/g, '');
    // Generate email based on roll number
    const email = `${username}${rollNo.replace(/[^0-9]/g, '')}@students.example.com`;

    const user = new User({ 
      username: username,
      email: email,
      password: 'student123',
      role: 'student', 
      name, 
      rollNo, 
      courses: [] 
    });
    
    const savedUser = await user.save();
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;
    
    res.json({ 
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.code === 11000 ? 'User already exists' : error.message 
    });
  }
});

// GET /api/admin/students - list students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .lean();
    res.json({ 
      success: true,
      students 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE /api/admin/students/:username
router.delete('/students/:username', async (req, res) => {
  const { username } = req.params;
  await User.deleteOne({ username });
  res.json({ ok: true });
});

// Teacher Management Routes
router.post('/teachers', async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and username are required' 
      });
    }

    const email = `${username}@gmail.com`;
    const teacher = new User({
      username,
      email,
      password: password || 'teacher123',
      role: 'teacher',
      name,
      courses: []
    });

    const savedTeacher = await teacher.save();
    const teacherWithoutPassword = savedTeacher.toObject();
    delete teacherWithoutPassword.password;

    res.json({
      success: true,
      teacher: teacherWithoutPassword
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.code === 11000 ? 'Username already exists' : error.message
    });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .lean();
    res.json({
      success: true,
      teachers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/teachers/:username', async (req, res) => {
  try {
    const { username } = req.params;
    await User.deleteOne({ username, role: 'teacher' });
    res.json({
      success: true,
      message: 'Teacher removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Courses
router.post('/courses', async (req, res) => {
  const { code, name } = req.body;
  if (!code || !name) return res.status(400).json({ message: 'code and name required' });
  const c = new Course({ code, name });
  await c.save();
  res.json({ ok: true, course: c });
});

router.get('/courses', async (req, res) => {
  const courses = await Course.find();
  res.json({ courses });
});

module.exports = router;
