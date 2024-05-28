const {QRCodeCanvas} = require('@loskir/styled-qr-code-node');
const fs = require('fs');

exports.createQR = async (user) => {
    let data = user.password;
    const qrCode = new QRCodeCanvas({
        "width": 300,
        "height": 300,
        "data": data,
        "margin": 0,
        "qrOptions": {"typeNumber": 7, "mode": "Byte", "errorCorrectionLevel": "H"},
        "imageOptions": {"hideBackgroundDots": false, "imageSize": 1, "margin": 0},
        "dotsOptions": {"type": "classy-rounded", "color": "#000000", "gradient": null},
        "image": "public/images/solid-ada-logo.png",
        "cornersSquareOptions": {"type": "extra-rounded", "color": "#009c82"},
    });

    await qrCode.toFile('output.svg', 'svg');

    fs.readFile('output.svg', (err, data) => {
        if (err) {
            return 'Error generating QR code';
        }
        return data;
    });
}