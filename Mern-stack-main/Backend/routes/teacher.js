const express = require('express');
const router = express.Router();
const { authMiddleware, permit } = require('../middleware/auth');
const ClassSession = require('../models/ClassSession');
const Course = require('../models/Course');
const User = require('../models/User');

router.use(authMiddleware, permit('teacher'));

// POST /api/teacher/generate - { courseId, durationMinutes }
router.post('/generate', async (req, res) => {
  const { courseId, durationMinutes } = req.body;
  const teacher = req.user;
  if (!courseId) return res.status(400).json({ message: 'courseId required' });

  const course = await Course.findOne({ code: courseId });
  const teacherUser = await User.findOne({ username: teacher.username });

  const duration = Number(durationMinutes) || 15;
  const expiry = Date.now() + duration * 60 * 1000;

  const session = new ClassSession({ courseId, teacherId: teacher.username, teacherName: teacherUser ? teacherUser.name : teacher.username, expiry, active: true });
  await session.save();

  const qrData = { courseId, teacherId: teacher.username, teacherName: teacherUser ? teacherUser.name : teacher.username, timestamp: new Date().toISOString(), expiry };

  res.json({ ok: true, qrString: JSON.stringify(qrData), session });
});

// GET /api/teacher/current?courseId=...
router.get('/current', async (req, res) => {
  const { courseId } = req.query;
  const now = Date.now();
  const q = { active: true };
  if (courseId) q.courseId = courseId;

  const session = await ClassSession.findOne(q).sort({ createdAt: -1 });
  if (!session) return res.json({ qr: null });
  if (now > session.expiry) {
    session.active = false;
    await session.save();
    return res.json({ qr: null });
  }

  const qrData = { courseId: session.courseId, teacherId: session.teacherId, teacherName: session.teacherName, timestamp: session.timestamp, expiry: session.expiry };
  res.json({ qrString: JSON.stringify(qrData), session });
});

// POST /api/teacher/no-class { courseId }
router.post('/no-class', async (req, res) => {
  const { courseId } = req.body;
  const teacher = req.user;
  if (!courseId) return res.status(400).json({ message: 'courseId required' });

  // Mark by creating an inactive session with noClass flag by expiry = 0 and active=false
  const session = new ClassSession({ courseId, teacherId: teacher.username, teacherName: teacher.name, expiry: 0, active: false });
  await session.save();
  res.json({ ok: true });
});

module.exports = router;
