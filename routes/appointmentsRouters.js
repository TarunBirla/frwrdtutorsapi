const express = require('express');
const router = express.Router();


const Appointmentcontrollers = require('../controllers/appointmentsControllers');
router.get('/appointment', Appointmentcontrollers.saveAllAppointments);
  router.get('/allappointment', Appointmentcontrollers.GetallAppointments);
  


module.exports = router;


