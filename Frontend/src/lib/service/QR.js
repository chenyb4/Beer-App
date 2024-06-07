import {t} from "$lib/translations/index.js";

export function handleSendMailResponse(sentMail = false, user, qr){
    if (!sentMail){
        downloadBase64File(qr, 'QR code of ' + user.username + '.png');
        return t.get("administration.noMailSent") + `<a href='mailto:${user.email}'>${user.email}</a>`;
    } else {
        return t.get("administration.mailSent") + user.username;
    }
}

export function downloadBase64File(base64 = "", fileName = "QR.png") {
    const link = document.createElement('a');
    link.href = base64;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}