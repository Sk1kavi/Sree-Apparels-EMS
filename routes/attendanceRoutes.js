const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Mark Attendance
router.post('/', async (req, res) => {
  try {
    const { staffId, date, status } = req.body;
    const attendance = await Attendance.create({ staffId, date, status });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Attendance
router.get('/', async (req, res) => {
  try {
    const attendance = await Attendance.find().populate('staffId', 'name role');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Attendance by Staff ID
router.get('/staff/:staffId', async (req, res) => {
  try {
    const records = await Attendance.find({ staffId: req.params.staffId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Attendance by Date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));

    const records = await Attendance.find({
      date: { $gte: start, $lte: end }
    }).populate('staffId', 'name role');

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Attendance
router.put('/:id', async (req, res) => {
  try {
    const updated = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Attendance
router.delete('/:id', async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
