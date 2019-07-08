import nodeMailer from 'nodemailer';

let adminEmail      = 'opeypie1992@gmail.com';
let adminPassword   = '776041164';
let mailHost        = 'smtp.gmail.com';
let mailPort        = '587';

let sendMail = (toEmail,subject,contentHtml) => {
    let transporter = nodeMailer.createTransport({
        host    : mailHost,
        port    : mailPort,
        secure  : false , //use SSL , TLS,
        auth    : {
            user : adminEmail,
            pass : adminPassword
        } 
    });
    let options = {
        from    : adminEmail,
        to      : toEmail,
        subject : subject,
        html    : contentHtml
    }
    return transporter.sendMail(options); // this default return a Promise
};
module.exports = sendMail;