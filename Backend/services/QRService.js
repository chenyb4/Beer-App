const {QRCodeCanvas} = require('@loskir/styled-qr-code-node');

exports.createQR = async (user) => {
    let data = user.qr_identifier;
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
    return await qrCode.toDataUrl()
}