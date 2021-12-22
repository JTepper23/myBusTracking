import nodemailer from 'nodemailer';

export default class emailModule {

  constructor() {

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'no-reply@myscarsdaleschoolbus.com',
        serviceClient: "101628973544778188588",
        privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCEgOaW+WSz8Umw\n1dT6FjaYtMf4amfxGjpHvixfb0Zjo1gu82kQVqBfJqOXuDgylOAyIyzcGjW/xNdh\n67x/FuElTeE0bN5daFokKfGXAN5YHeOkEQY/mqWoWuKYHe+Dz8QYtyhXH/729edr\npQpGAJovoGOnHmr4oW+mgo+OCaGWAl5t+swyqabnq6Y9zH9emvB7QuGvTamRTf2a\nWVudyA1ZMpzGoFV71S+GOdYOz3PXiyiFAFLdAtrEhKZVLQqhqKz7IzcgUEc4Wytk\nihIB3KZ6+8NWWFcYAZQo/jlaVV2l5vc79dBdUwoWXZ3evDpV9sW/47IuNxpMPFhq\nhWKhUgGXAgMBAAECggEACkNBmOfwGM/TeVLWkBgwWluGMYNsUYxKf0wHe8zOkuEP\n73MC7DUJbtU7ToECOUi2pKt8yf9tslC4rejoTJ+lCJKjor/b6Tgv4yUshRmYHxMR\nkp+O8FY2BngjnMyUxIzPD2sAQN9FjDM3nWrHBOz/BDlT/pmoh2FZmHf8TnAIh+nC\nhgVNwuvw4n7XjzWrzG3RNePKsFIVMNa9ZOFb9/5G+WLXawMwUH14Gee0aT9M+MFx\nh6qqdJcV4ymI09AfvWk7kflDgCrCJpi+WURIzAL+Sm3y7SXR6XmlKMHsH/w9V19F\nlCsi86L/Wj1HMvhdrsxGtrs4lbGs2dEebxRm3wZdIQKBgQC6/hoP17DR83ylMMdH\nEI/0fc4bV4xUGO8iUQNeTOIEyZbjSQWJDfpm3ADoPtVDJkfi/IoxZ+rPVlY0mJ/i\nE0hODok0v3TVkTOaawHhD4/Htr+YuBRVo6GqG0abDhdtKpW5P0iIAj/bEMWvEy38\nQd0ezJaxzAktpQvuh1B5Qw+hKwKBgQC1ZwKjVDqbVj1s3/jDMYRYZhr5YDBpsqzQ\nnR5EqVirlCgXNArLb8gxzLqG4VdHfElo+3CTrRkhTlYvs6CMIpoEYsaEoEoULpLX\nR0S1RNHl9QrgBbelf+VUPvyRFsOfM99qmS+lnlsNRRuXojjgUIWA327tX9iqG0nR\nxTUD0wAzRQKBgEhUXbRfFBBCBKbJFWwRpf1GZGEDHk6xTl6Rw6HIT2zWpTzJVBDN\njVwYIWm0VD2jIw9T7AhsT9FfbfzuRHnoR4GZ8cyref/aKIHEfneV02HG+JmUKplt\nr+zinA8CBmG9pSiAqAekBxsvg6fS3WjD+UoejPO9Hpe/Tbw4LxKYtAT9AoGBAKWk\n/p+uFiYqRcTZcAqteLBP7GmzEAI0ieGk1zLTgIiMrV8iwoip9iCjVeA8fLpmH5Kh\np1byRXRIWCMO35eXMRS4LZaF158+OBAkn/T2dsSJUfjmv598fijDq1XBd7g0Ydqx\nLvUI+RPQ+zUniNAsNvxLCrvvPaV3bZ0DezmWvyQRAoGAcptPRZNOJRYXlMhhzcIH\nJt/FzUyJFlZbinZrpl8QZGYJl53IX//2y8IU4V5UwSck331Wug98/cAvvP3QTCCF\nvpJPLPa2atIaFi6Tc0SSZrDj3rPV9jkppYeFZfpwg3GQO9bl1sY2cBva+Ln1FDjh\nsA4y1ufYENa8E96hyUv3o40=\n-----END PRIVATE KEY-----\n",
      }
    });
  }

  
  async emailVerification(email, tempPassword) {
    try {
      await this.transporter.sendMail({
        from: 'no-reply@myscarsdaleschoolbus.com',
        to: email,
        subject: 'My Scarsdale School Bus Verification',
        text: `Your temporary password is: ${tempPassword}`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
