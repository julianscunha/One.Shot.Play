const express = require('express');
const router = express.Router();
const { ConfigService } = require('../services/config');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');

const configService = new ConfigService();

router.get('/schedules', auth, async (req, res) => {
  try {
    const schedules = await configService.listSchedules();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/schedules', auth, rateLimit.publish, async (req, res) => {
  try {
    const schedule = await configService.createSchedule(req.body);
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/schedules/:id', auth, rateLimit.publish, async (req, res) => {
  try {
    const schedule = await configService.updateSchedule(req.params.id, req.body);
    res.json({ success: true, schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/schedules/:id', auth, rateLimit.publish, async (req, res) => {
  try {
    await configService.deleteSchedule(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
