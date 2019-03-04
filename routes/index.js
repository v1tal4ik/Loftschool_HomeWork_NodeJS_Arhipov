const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const config = require('../config');
const path = require('path');
const controllers =require('../controllers');


router.get('/',controllers.index);
router.post('/',koaBody(),controllers.indexMessage);
router.get('/login',controllers.login);
router.post('/login',koaBody(),controllers.auth);
router.get('/admin',controllers.admin);
router.post('/admin/skills',koaBody(),controllers.adminSkills);
router.post('/admin/upload',koaBody({
    multipart: true,
    urlencoded:true,
    formidable: {
        uploadDir:path.join(process.cwd(),config.upload)
    },
}),controllers.adminUpload);






module.exports = router;