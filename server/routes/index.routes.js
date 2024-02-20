const router = require('express').Router();
const authRouter = require('./api/auth.routes');
const doctorRouter = require('./api/doctor.routes');
const appointmentRouter = require('./api/appointment.routes');
const rejectIfNotAuthorized = require('../middlewares/rejectIfNotAuthorized');

router.use('/api/auth', authRouter);
router.use('/api/doctors', rejectIfNotAuthorized, doctorRouter);
router.use('/api/appointments', rejectIfNotAuthorized, appointmentRouter);

module.exports = router;
