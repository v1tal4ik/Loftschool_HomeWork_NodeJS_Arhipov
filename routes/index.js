const express = require('express');
const router = express.Router();
const controllers =require('../controllers');


router.get('/',controllers.index);
router.post('/',controllers.indexMessage);
router.get('/login',controllers.login);
router.post('/login',controllers.auth);
router.get('/admin',controllers.admin);
router.post('/admin/skills',controllers.adminSkills);
router.post('/admin/upload',controllers.adminUpload);






module.exports = router;