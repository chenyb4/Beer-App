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
            html: "<b>Hey there!</b>\n" +
                "<br>In the attachment an image can be found. With this you can buy drinks at DoMiBo or other events of ADA<br/>\n" +
                "<br>If this isn't the first mail you receive with a QR code, old QR codes won't work!</br>" +
                "<br/>" +
                "<h3>Explanation on Saving a QR Code for easy access</h3>\n" +
                "<br />" +
                "<h4>Android Phones</h4>\n" +
                "<p>On Android phones, you can easily save and use the QR code via Google Wallet. Follow these steps:</p>\n" +
                "<ol>" +
                "    <li><b>Download the image</b> by tapping and holding on the image in the email, then selecting \"Save image\".</li>" +
                "    <li><b>Open the Google Wallet app</b></li>\n" +
                "    <li><b>Add the QR code</b> to your Google Wallet by navigating to the option to add a new card or ticket, select \"Image\" and select the saved image.</li>" +
                "</ol>" +
                "<br />" +
                "<h4>iPhone</h4>\n" +
                "<p>On an iPhone, it is not possible to save the QR code directly to Apple Wallet. Here are two alternative methods to easily access the QR code:</p>" +
                "<h5>Option 1: Save the Image</h5>\n" +
                "<ol>" +
                "    <li><b>Download the image</b> by tapping and holding on the image in the email, then selecting \"Save Image\".</li>" +
                "    <li><b>Open the Photos app</b> and select the heart to add to favorites</li>" +
                "    <li><b>Select the favorites tab</b> in the Photos app when you need the QR code</li>" +
                "</ol>" +
                "<br/>" +
                "<h5>Option 2: Create a Widget</h5>\n" +
                "<ol>" +
                "    <li><b>Download the image</b> by tapping and holding on the image in the email, then selecting \"Save Image\".</li>" +
                "    <li><b>Open the Photos app</b> on your iPhone and add the QR code to an album or mark it as a favorite</li>" +
                "    <li><b>Go to your home screen</b> and press and hold on an empty space until the apps start to jiggle</li>" +
                "    <li><b>Tap the plus icon</b> (+) in the top left corner of the screen to add a new widget</li>" +
                "    <li><b>Search for the Photos widget</b> and select it.</li>" +
                "    <li><b>Choose the size of the widget</b> and tap \"Add Widget\".</li>" +
                "    <li><b>Press and hold the new widget and choose \"Edit Widget\"</b> to select a specific album or favorite photos</li>" +
                "</ol>\n" +
                "<br>" +
                "<p>With these methods, you can easily save the QR code and quickly access it for DoMiBo or other ADA events.</p>",
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