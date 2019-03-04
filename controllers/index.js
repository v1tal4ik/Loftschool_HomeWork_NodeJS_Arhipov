const db = require ('../models/db');
const psw = require('../libs/password');
const config = require('../config');
const path = require('path');
const fs = require('fs');
const formidable = require('koa-formidable');
const validate = require('../libs/validate');
const sendMail = require('../libs/sendMail');



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

module.exports.indexMessage = async(ctx, next)=>{
    const {name,email,message} = ctx.request.body;

    if(name&& email && message){
       try {
        const status = await sendMail(ctx.request.body);
        ctx.flash('form',status);
        ctx.redirect('/#status');
       } catch (error) {
        ctx.flash('form',error.message);
        ctx.redirect('/#status');
       }
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
        msgfile: ''
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
    const {photo,name,price} = ctx.request.body;
    const file = ctx.request.files;
    console.log('ctx.request.body',ctx.request.body);
    console.log('ctx.request.files',ctx.request.files);
};





















/*
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

    */