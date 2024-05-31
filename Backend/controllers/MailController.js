const userService = require("../services/UserService");
const QRService = require("../services/QRService");
const nodemailer = require('nodemailer');
const process = require('process');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',  // convert string to boolean
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: process.env.SMTP_TLS_REJECT_UNAUTHORIZED === 'true'  // convert string to boolean
    }
});

exports.sendmail = async (req, res) => {
    const { id } = req.query;

    try {
        const user = await userService.createUserIdentifier(id);
        const qr = await QRService.createQR(user);
        let cleanedBase64String = qr.replace("data:image/png;base64,", "");

        const mailData = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Beer Card QR',
            html: '<b>Hey there! </b>' +
                '<br>In the attachment an image is sent you can use to buy drinks at DoMiBo or other events of ADA<br/>' +
                "<br>If this isn't the first mail you recieve with QR code, old QR codes won't work!</br>",
            attachments: [
                {
                    filename: 'QR.png',
                    content: cleanedBase64String,
                    encoding: 'base64'
                },
            ]
        };

        await transporter.sendMail(mailData, function (err, info) {
            if(err) {
                console.log("Mail error:" + err)
                res.status(201).json({qr: qr, sentMail: false});
            }
            else {
                console.log("Mail sent to" + user.email);
                res.status(201).json({qr: qr, sentMail: true});
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Bad request' });
    }
};