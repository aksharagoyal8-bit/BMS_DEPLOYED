const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const replaceContent = (content, creds) => {
    Object.keys(creds).forEach(key => {
        content = content.replace(new RegExp(`#\\{${key}\\}`, 'g'), creds[key]);
    });
    return content;
}

// ✅ emailSubject added as parameter
async function EmailHelper(templateName, recieverEmail, creds, emailSubject) {
    try {
        // ✅ emailSubject removed from path.join
        const templatePath = path.join(__dirname, "email_templates", templateName);
        const content = await fs.promises.readFile(templatePath, "utf-8");
        const emailDetails = {
            to: recieverEmail,
            from: `"BookMyShow Clone" <${process.env.GMAIL_USER}>`,
            subject: emailSubject,
            text: `Hi ${creds.name}`,
            html: replaceContent(content, creds)
        }
        await transporter.sendMail(emailDetails);
    } catch(err) {
        console.log(err);
    }
}

module.exports = EmailHelper;