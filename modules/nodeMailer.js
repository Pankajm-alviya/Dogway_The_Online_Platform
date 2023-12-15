import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "pankajmalviya364@gmail.com",
      pass: "vbru ihsb pheq tgqj",
    },
    secure: true,
});