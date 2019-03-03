const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session');
const Pug = require('koa-pug');
const pug = new Pug({
    viewPath: './source/template',
    pretty: false,
    basedir: './source/template',
    noCache: true,
    app: app
});
const flash = require('koa-better-flash');
const router = require('./routes');
const config = require('./config');
const port = process.env.PORT || 3000;

app.use(static('./public'));
app.keys = ['keys'];
app.use(session(config.session, app))
    .use(flash())
    .use(router.routes())
    .use(router.allowedMethods());



app.listen(port,()=>{
    if(!fs.existsSync(config.upload)){
        fs.mkdirSync(config.upload);
    }
console.log('Server start in port: ',port);
});

/*

const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const config = require('./config');






app.set('views', path.join(__dirname,'./source/template'))
    .set('view engine', 'pug');

app.use(cookieParser());
app.use(session(config.session, app))
    .use(express.static(path.join(__dirname,'./public/')))
    .use(bodyParser.urlencoded({extended:false}))
    .use(bodyParser.json())
    .use(flash())
    .use('/', require('./routes/index'));

app.use((req,res,next)=>{
    let err = new Error('Not Found');

    err.status = 404;
    next(err);
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.render('pages/error',{status:res.statusCode, error: err.message});
})
    


app.listen(port,()=>{
    if(!fs.existsSync(config.upload)){
        fs.mkdirSync(config.upload);
    }
console.log('Server start in port: ',port);
});
*/