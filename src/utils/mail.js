import Mailgen from "mailgen"
import nodemailer from "nodemailer"

const sendemail = async (options) =>{
    const mailgenerator=new Mailgen({
        theme:"default",
        product:{
            name:"Task Manager",
            link:"https://taskmanagelink.com"
        }
    })
    const emailtextual = mailgenerator.generatePlaintext(options.mailgenContent)
    const emailhtml = mailgenerator.generate(options.mailgenContent)


    const transporter= nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })
    const mail = {
        from:"mdsameer159357@gmail.com",
        to: options.email,
        subject: options.subject,
        text : emailtextual,
        html: emailhtml
    }
    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("Email service failed")
        console.error("Error: ", error)
    }
    
}

const emailverificationcontent = (username, verificationurl) => {
    return{
        body:{
            name:username,
            intro:"Welcome to our App! We are excited to jave  you onboard",
            action:{
                instruction:"TO verify your email, please click on the following button",
                button:{
                    color: "#1aae5aff",
                    text:"verify your email",
                    link:verificationurl
                },
            },
            outro:"Need help? Just reply to this email. We'd love to help"
        },
    }
}

const forgotpasswordcontent = (username, passwordreseturl) => {
    return{
        body:{
            name:username,
            intro:"We got the request to reset the password of your account",
            action:{
                instruction:"TO reset the password, please click on the following button",
                button:{
                    color: "#1aae5aff",
                    text:"Reset Password",
                    link:passwordreseturl
                },
            },
            outro:"Need help? Just reply to this email. We'd love to help"
        },
    }
}

export {emailverificationcontent, forgotpasswordcontent,sendemail}