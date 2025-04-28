const express = require('express');
const router = express.Router();


const packegacon = require('../controllers/packegaController');


 
 
router.post('/packega', packegacon.PackegaCreate);
router.get('/packega/:id', packegacon.PackegaById);
  router.get('/allpackega', packegacon.PackegaAllshow);
  


module.exports = router;


