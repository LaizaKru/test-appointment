const router = require('express').Router();
const { Schedule } = require('../../db/models');

router.get('/:id/schedules', async (req, res) => {
  const { id } = req.params;
  try {
    const schedules = await Schedule.findAll({ where: { doctorId: +id } });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/appointments', async (req, res) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    return res.status(400).json({ message: 'scheduleId is required' });
  }

  try {
    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
