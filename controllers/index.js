const db = require ('../models/db');
const psw = require('../libs/password');
const config = require('../config');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const validate = require('../libs/validate');
const nodemailer = require('nodemailer');



module.exports.index = async(req,res, next)=>{
    const products = db.getState().product || [];
    const skills = db.getState().skills || [];
    const data = {
        items_products:products,
        items_skills:skills,
        msgsemail:req.flash('info')[0]
    }
    res.render('pages/index.pug',data);
};



module.exports.indexMessage = async(req,res, next)=>{
    const {name,email,message} = req.body;
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
                req.flash('info','На жаль виникла помилка :(');
                return res.redirect('/#status');
            }


            req.flash('info','Повідомлення успішно відправлено');
                return res.redirect('/#status');
        });
    }else{
        req.flash('info','Заповніть усі поля ');
                return res.redirect('/#status');
    }
};


module.exports.login = async(req,res, next)=>{
    const data = {
        msgslogin: req.flash('auth')[0]
    }
    if(req.session.auth){res.redirect('/admin')};
    res.render('pages/login',data);
};

module.exports.admin = async(req,res, next)=>{
    const data = {
        msgskill: req.flash('skill')[0],
        msgfile: req.flash('file')[0]
    }
    if (!req.session.auth){res.redirect('/login')};
    res.render('pages/admin',data);
};

module.exports.auth = async(req,res, next)=>{
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
};

module.exports.adminSkills = async(req,res, next)=>{
    const {age,concerts,cities,years} = req.body;
    const skills = db.getState().skills;
    if(age && concerts && cities && years){
        db.set('skills[0].number',age).write();
        db.set('skills[1].number',concerts).write();
        db.set('skills[2].number',cities).write();
        db.set('skills[3].number',years).write();
        req.flash('skill','Зміни збережено');
        res.redirect('/admin');
    }else{
        req.flash('skill','Заповніть усі поля');
        res.redirect('/admin');
    }
};

module.exports.adminUpload = async(req,res, next)=>{
    const form = new formidable.IncomingForm();

    form.uploadDir = path.join(process.cwd(),config.upload);

    form.parse(req,(err,fields,files)=>{
        if(err){console.log(err)};

        const {name,price} = fields;
        const result = validate(fields,files);
        if(!result ){
            req.flash('file','Виникла помилка :(');
            res.redirect('/admin');
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
            req.flash('file','Товар успішно завантажено');
            res.redirect('/admin');
        }
    });
};
