const router = require('express').Router();
const { Schedule, Appointment } = require('../../db/models');

router.post('/', async (req, res) => {
  const { scheduleId } = req.body;

  if (!scheduleId) {
    return res.status(400).json({ message: 'Не передан scheduleId' });
  }

  try {
    const schedule = await Schedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Слот в расписании не найден' });
    }
    if (schedule.isBooked) {
      return res.status(400).json({ message: 'Слот в расписании уже забронирован' });
    }

    const appointment = await Appointment.create({
      scheduleId,
      userId: res.locals.user.id,
    });
    schedule.isBooked = true;
    await schedule.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
