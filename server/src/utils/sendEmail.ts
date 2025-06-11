import nodemailer from "nodemailer";

// setup of nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "hardik.trionn@gmail.com",
    pass: process.env.EMAIL_PASS || "otms jfep tdab ygyj", // Ideally use environment variables for security
  },
});

// sendmail 
const sendEmail = async (
  email: string,
  subject: string,
  content: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER || "hardik.trionn@gmail.com",
    to: email,
    subject,
    html: content,
  };
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
