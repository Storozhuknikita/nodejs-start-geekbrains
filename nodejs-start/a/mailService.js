const nodemailer = require('nodemailer')

const smtpConfig = nodemailer.createTransport({
    host: "localhost",
    port: 1080,
    secure: false, // https => port 465
    auth: {

    }
});

smtpConfig.sendMail({
    from: 'User <username@mail.localdomain',
    to: 'ann-ivanova@localdomain.local',
    subject: 'Subject',
    text: 'Привет. Проверка работы почты!',
}, (err, info) => {
    if(err){
        throw err
    }
    console.log('Письмо успешно было отправлено', info)
    smtpConfig.close();
})


