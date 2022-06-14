import nodemailer from 'nodemailer';

export default class emailModule {

  constructor() {

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: '*email*',
        serviceClient: "*client*",
        privateKey: "*key*",
      }
    });
  }

  
  async emailVerification(email, tempPassword) {
    try {
      await this.transporter.sendMail({
        from: '*email*',
        to: email,
        subject: 'My School Bus Verification',
        text: `Your temporary password is: ${tempPassword}`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
