const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hardik.trionn@gmail.com",
    pass: "otms jfep tdab ygyj",
  },
});

const sendEmail = async (email, subject, content) => {
  const mailOptions = {
    from: "hardik.trionn@gmail.com",
    to: email,
    subject: subject,
    html: content,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
