import mysql from 'mysql';
import bcrypt from 'bcrypt';

class sqlHandler {

  constructor() {
    this.con = mysql.createConnection({
      host: 'localhost',
      user: 'Client',
      password: '*password*',
      database: '*database*'
    });

    this.con.connect((err) => {
      if (err) throw err;
    });
  }

  async addUser(email, callback) {
    var password = Math.random().toString(36).substr(2,);
    bcrypt.hash(password, 10, (err, hash) => {

      this.con.query(`INSERT IGNORE INTO user (email, password) values ('${email}', '${hash}');`, (err, result) => {
        if (result.affectedRows === 0) {
          callback('userExists', null);
        } else {
          callback('userCreated', password);
        }

      });

    });
  }

  async forgotPassword(email, callback) {
    var password = Math.random().toString(36).substr(2,);
    bcrypt.hash(password, 10, (err, hash) => {

      this.con.query(`UPDATE user SET password='${hash}' where email='${email}';`, (err, result) => {
        if (result.affectedRows === 1) {
          callback('passwordSent', password);
        } else {
          callback('noUserExists', null);
        }

      });

    });
  }

  async checkLogin(email, password, callback) {
    this.con.query(`SELECT password FROM user WHERE email='${email}';`, (err, result) => {
      
      try {
        bcrypt.compare(password, result[0].password, (err, result) => {

          if (result == true) {
            callback('correctPassword');
          } else {
            callback('incorrectPassword');
          }

        });
      } catch (err) {
        callback('userNotFound');
      }

    });
  }

  async resetPassword(email, password, callback) {
    bcrypt.hash(password, 10, (err, hash) => {

      this.con.query(`UPDATE user SET password='${hash}' where email='${email}';`, (err, result) => {
        callback('passwordReset');
      });

    });
  }

  async addReservation(email, date, name, school, bus, time, maxSeats, callback) {
    this.con.query(`select * from ${'bus' + bus.toString()} where date='${date}' and time='${time}' and school='${school}';`, (err, result) => {
      if (result[0].seatsTaken < maxSeats) {

        if (result[0].people === null) {
          var peopleVar = JSON.stringify([name]);
          var seats = result[0].seatsTaken + 1;
          this.con.query(`update ${'bus' + bus.toString()} set seatsTaken=${seats}, people='${peopleVar}' where date='${date}' and time='${time}' and school='${school}';`)

        } else {

          var peopleVar = JSON.parse(result[0].people);
          peopleVar.push(name);
          peopleVar = JSON.stringify(peopleVar);
          var seats = result[0].seatsTaken + 1;
          this.con.query(`update ${'bus' + bus.toString()} set seatsTaken=${seats}, people='${peopleVar}' where date='${date}' and time='${time}' and school='${school}';`)

        }

        this.con.query(`select busses from user where email='${email}';`, (err, result) => {

          if (result[0].busses === null) {
            var busses = [{name: name, school: school, bus: bus, time: time}];
            busses = JSON.stringify(busses);
            this.con.query(`update user set busses='${busses}' where email='${email}';`);
          } else {
            var busses = JSON.parse(result[0].busses);
            busses.push({name: name, school: school, bus: bus, time: time});
            busses = JSON.stringify(busses);
            this.con.query(`update user set busses='${busses}' where email='${email}';`);
          }

        });

        callback('added');

       } else {

         callback('full');

       }

    });
  }

  async resetBusses(busRoutes, date) {

    this.con.query(`update user set busses=null;`);
    busRoutes.forEach(element => {
      this.con.query(`insert into ${'bus' + element.bus.toString()} (date, time, school) values ('${date}', '${element.time}', '${element.school}')`);
    }); 
  }

  async getReservations(email, callback) {
    this.con.query(`select busses from user where email='${email}';`, (err, result) => {
      callback(result[0].busses);
    })
  } 
}

export default sqlHandler;
