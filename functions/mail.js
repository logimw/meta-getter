require("dotenv").config();
const mailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function mail(mailSubject, time) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = mailer.createTransport({
    //   host: "smtp.ethereal.email",
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" mateteuszw@gmail.com', // sender address
    to: "mateuszwojcik.ofc@gmail.com", // list of receivers
    subject: mailSubject, // Subject line
    text: "Hello world?", // plain text body
    html: `<b>Czas wykonywania zapytania: ${time} sekund.</b>`, // html body
    attachments: [{ filename: "wynik.csv", path: "files/wynik.csv" }]
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", mailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

  transporter
    .sendMail(info)
    .then(resp => {
      console.log(`Wysłano emiala. ${resp}`);
      console.log(file);
    })
    .catch(err => {
      console.log(`Błąd wysłki. ${err.message}`);
    });
}

module.exports = mail;
