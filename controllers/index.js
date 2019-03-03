const db = require ('../models/db');
const psw = require('../libs/password');
const config = require('../config');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const validate = require('../libs/validate');
const nodemailer = require('nodemailer');


//flash
module.exports.index = async(ctx, next)=>{
    const products = db.getState().product || [];
    const skills = db.getState().skills || [];
    const data = {
        items_products:products,
        items_skills:skills,
        msgsemail:ctx.flash('form')[0]
    }
    ctx.render('pages/index.pug',data);
};

// true redirect
module.exports.indexMessage = async(ctx, next)=>{
    const {name,email,message} = ctx.request.body;
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${name}"`,
        to: config.mail.smtp.auth.user,
        subject:config.mail.subject,
        text:`${message}`
    }
    if(name&& email && message){
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                ctx.flash('form','На жаль виникла помилка :(');
                return ctx.redirect('/#status');
            }
                ctx.flash('form','Повідомлення успішно відправлено');
                return ctx.redirect('/#status');
        });
    }else{
          ctx.flash('form','Заповніть усі поля ');
                return ctx.redirect('/#status');
    }
};


module.exports.login = async(ctx, next)=>{
    const data = {
        msgslogin: ctx.flash('login')[0]
    }
    if(ctx.session.auth){ctx.redirect('/admin')};
    ctx.render('pages/login',data);
};
//flash
module.exports.admin = async(ctx, next)=>{
    const data = {
        msgskill: ctx.flash('skill')[0],
        msgfile: ctx.flash('file'[0])
    }
    if(!ctx.session.auth){ctx.redirect('/login')}
    ctx.render('pages/admin',data);
};

module.exports.auth = async(ctx, next)=>{
   const {email,password} = ctx.request.body;
    const user = db.getState().user;
    if(!email && !password){
        ctx.flash('login','Заповніть усі поля');
        ctx.redirect('/login');
    }
    if(user.email === email && psw.validPassword(password)){
        ctx.session.auth= true;
        ctx.redirect('/admin');
    }else{
        ctx.flash('login','Невірний логін або пароль');
        ctx.redirect('/login');
    }
};

module.exports.adminSkills = async(ctx, next)=>{
    const {age,concerts,cities,years} = ctx.request.body;
    const skills = db.getState().skills;
    if(!ctx.session.auth){ctx.redirect('/login')};
    if(age && concerts && cities && years){
        db.set('skills[0].number',age).write();
        db.set('skills[1].number',concerts).write();
        db.set('skills[2].number',cities).write();
        db.set('skills[3].number',years).write();
        ctx.flash('skill','Зміни збережено');
        ctx.redirect('/admin');
    }else{
        ctx.flash('skill','Заповніть усі поля');
        console.log("Заопвніть усі поля");
        ctx.redirect('/admin');
    }
};

//bodyParser,flash,
module.exports.adminUpload = async(ctx, next)=>{
    const {name,price} = ctx.request.body;
    const form = new formidable.IncomingForm();

    form.uploadDir = path.join(process.cwd(),config.upload);

    form.parse(ctx.request,(err,fields,files)=>{
        if(err){console.log(err)};

        const {name,price} = fields;
        const result = validate(fields,files);
        if(!result){
            ctx.flash('file','Виникла помилка :(');
            ctx.redirect('/admin');
        }else{
            old_path = files.photo.path;
            new_path = path.join(process.cwd(),config.upload,files.photo.name);
            fs.renameSync(old_path,new_path);
            let obj = {
                src: `./upload/${files.photo.name}`,
                price: price,
                name: name
            }
            db.get('product').push(obj).write();
            ctx.flash('file','Товар успішно завантажено');
            ctx.redirect('/admin');
        }
    });
};





















/*
 const {email,password} = req.body;
    const user = db.getState().user;
    if(!email && !password){
        req.flash('auth','Заповніть усі поля');
        res.redirect('/login');
    }
    if(user.email === email && psw.validPassword(password)){
        req.session.auth= true;
        res.redirect('/admin');
    }else{
        req.flash('auth','Невірний логін або пароль');
        res.redirect('/login');
    }

    */