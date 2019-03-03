const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const config = require('./config');
const port = process.env.PORT || 3000;

const app = express()




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