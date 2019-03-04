const nodemailer = require('nodemailer');
const config = require('../config');


module.exports = ({name,email,message})=>{
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: `"${name}"`,
        to: config.mail.smtp.auth.user,
        subject:config.mail.subject,
        text:`${message} from <${email}>`
    };

    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
                return reject(new Error('На жаль виникла помилка :('));
            }
            return resolve('Повідомлення успішно відправлено');
        });
    });
};