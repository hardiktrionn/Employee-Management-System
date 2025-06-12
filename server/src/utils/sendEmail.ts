import nodemailer from "nodemailer";

// setup of nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "hardik.trionn@gmail.com",
    pass: process.env.EMAIL_PASS || "otms jfep tdab ygyj", // Ideally use environment variables for security
  },
});

/**
 * Function Name: sendEmail
 *
 * Description:
 * The function send mail in email address.
 *
 * Parameters:
 * - `email:the type is string to whom receive mail.
 * - `subject:the type is string of email subject.
 * - `content:the type is string of what we send message to email holder.
 *
 * Example Usage:
 * ```
 *   const response =  sendEmail("hardik@gmail.com","otp","123456");
 *   console.log(response); // 122545
 * ```
 */

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
