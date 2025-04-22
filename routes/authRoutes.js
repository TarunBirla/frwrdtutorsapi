const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authController = require('../controllers/authController');


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); // Define the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Define the filename for uploaded files
    },
  });
  
  // Create multer instance
  const upload = multer({ storage: storage });
router.post('/register',upload.single('profileImage'), authController.register);
router.post('/login', authController.login);
router.post('/forget_password', authController.forgetpassword);
router.post('/changepassword/:id', authController.changepassword);
  router.get('/contractors', authController.saveAllContractors);
  router.get('/contractorsalldata', authController.GetallContractors);
  router.get('/contractorsavailability/:id', authController.contractor_availabilityAPIGET);
  router.post('/clients', authController.clientAPIPOST);
  router.post('/enquiry', authController.enquiryAPIPOST);
  router.get('/subjects', authController.subjectsAPIGET);
  router.get('/subjectsalldata', authController.GetAlldatasubject);
  router.get('/location', authController.locationAPIGET);
  router.get('/locationalldata', authController.GetAlldatalocation);
  router.post('/appointments', authController.appointmentsAPIPOST);


module.exports = router;


