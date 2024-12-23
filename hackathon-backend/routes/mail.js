const nodemailer =require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport(
    {
        secure:true,
        host:'smtp.gmail.com',
        port:'465',
        auth:{
            user:'gotomail.cc@gmail.com',
            pass:process.env.password
        }
    }
)

async function sendMail(to,subject,message){
    try {
        const mailOptions={
            to:to,
            subject:subject,
            html:message,
        }
        const info = await transporter.sendMail(mailOptions);
        console.log('error');
        
    } catch (error) {
        console.log('Email Sent:', info.response);
    }
  
}
module.exports = { sendMail };
