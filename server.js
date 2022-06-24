import fs from 'fs';
import express from 'express';
import cookieSession from 'cookie-session';
import path from 'path';
import socketio from 'socket.io';
import https from 'https';
import http from 'http';
import { v4 as uuid } from 'uuid';
import emailModule from './emailServer.js';
import sql from './mysqlInterface.js';
import schedule from 'node-schedule';

date = '2020-08-28';

process.on('uncaughtException', (err) => {
  console.log('Caught exception: ', err);
});

const sqlHandler = new sql();
const emailHandler = new emailModule();
const busDriverPassword = 'beans';
var authenticationManager = {};
var loginManager = {};

//Route to https

const httpRouter = express();
const httpServer = http.createServer(httpRouter);

httpRouter.get('*', (req, res) => {
  res.redirect('https://' + req.headers.host + req.url);
});


//Create https express server
const httpsRouter = express();

const options = {
  key: fs.readFileSync({path}),
  cert: fs.readFileSync({path})
};

const httpsServer = https.createServer(options, httpsRouter);

httpsRouter.use(express.static(path.resolve() + '/index'));
httpsRouter.use(express.static(path.resolve() + '/busDriver'));
httpsRouter.use(express.static(path.resolve() + '/reservation'));
httpsRouter.use(express.json());

const cookieSessionConfig = cookieSession(
  {
    name: 'session',
    keys: ['jadenskey1', 'jadenskey2'],
    maxAge: 24 * 60 * 60 * 1000
  }
);
httpsRouter.use(cookieSessionConfig);

//Setup express routing
httpsRouter.get('/', (req, res, next) => {
  res.sendFile(path.join(path.resolve(), 'index', 'index.html'));
  console.log(req.session.token);
});

httpsRouter.get('/weather', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'index', 'weather.html'));
});

httpsRouter.get('/busdriver', (req, res, next) => {
  res.sendFile(path.join(path.resolve(), 'busDriver', 'busDriver.html'));
});

httpsRouter.get('/busdriver/login', (req, res, next) => {
  res.sendFile(path.join(path.resolve(), 'busDriver', 'busDriverLogin.html'));
});

httpsRouter.get('/reservation', (req, res) => {
  if (loginManager[req.session.token] !== undefined) {
    res.sendFile(path.join(path.resolve(), 'reservation', 'reservation.html'));
  } else {
    res.redirect('/reservation/login');
  }
});

httpsRouter.get('/reservation/resetpassword', (req, res) => {
  if (loginManager[req.session.token] !== undefined) {
    res.sendFile(path.join(path.resolve(), 'reservation', 'reservationResetPassword.html'));
  } else {
    res.redirect('/reservation/login');
  }
});

httpsRouter.get('/reservation/newreservation', (req, res) => {
  if (loginManager[req.session.token] !== undefined) {
    res.sendFile(path.join(path.resolve(), 'reservation', 'reservationNew.html'));
  } else {
    res.redirect('/reservation/login');
  }
});

httpsRouter.get('/reservation/login', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'reservation', 'reservationLogin.html'));
});

httpsRouter.get('/reservation/signup', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'reservation', 'reservationSignup.html'));
});

httpsRouter.get('/reservation/forgotpassword', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'reservation', 'reservationForgotPassword.html'));
});

//Authentication Routing

httpsRouter.post('/busDriver/loginValidation', (req, res) => {

  if(authenticationManager[req.session.token] === 'busdriver') {
    res.end('success');
  } else {

    if (req.body.password === busDriverPassword) {

      if (req.session.token === undefined) {
        req.session.token = uuid();
      }

      authenticationManager[req.session.token] = 'busdriver';

      setTimeout((token) => {
        authenticationManager[token] = undefined;
      }, (24 * 60 * 60 * 1000), (req.session.token));

      res.end('success');
    } else {
      res.end('failure');
    }
  }

});

httpsRouter.post('/reservation/signupValidation', (req, res) => {
  
  sqlHandler.addUser(req.body.email, (status, password) => {

    if (status === 'userExists') {
      res.end('userExists');
    } else if (status === 'userCreated') {
      emailHandler.emailVerification(req.body.email, password);
      res.end('emailSent');
    }

  });

});

httpsRouter.post('/reservation/forgotpasswordvalidation', (req, res) => {
  
  sqlHandler.forgotPassword(req.body.email, (status, password) => {

    if (status === 'noUserExists') {
      res.end('noUserExists');
    } else if (status === 'passwordSent') {
      emailHandler.emailVerification(req.body.email, password);
      res.end('emailSent');
    }

  });

});

httpsRouter.post('/reservation/resetpasswordvalidation', (req, res) => {
  if (loginManager[req.session.token] !== undefined) {

    sqlHandler.resetPassword(loginManager[req.session.token], req.body.password, (result) => {
      res.end('passwordReset');
    });

  } else {
    res.end('notLoggedIn');
  }

});

httpsRouter.post('/reservation/loginvalidation', (req, res) => {
  
  if (loginManager[req.session.token] !== undefined) {
    res.end('loggedIn');
  } else {

    sqlHandler.checkLogin(req.body.email, req.body.password, (result) => {

      if (result === 'userNotFound') {
        res.end('userNotFound');
      } else if (result === 'correctPassword') {

        if (req.session.token === undefined) {
          req.session.token = uuid();
        }

        loginManager[req.session.token] = req.body.email;

        setTimeout((token) => {
          loginManager[token] = undefined;
        }, (24 * 60 * 60 * 1000), (req.session.token));

        res.end('loggedIn');

      } else if (result === 'incorrectPassword') {
        res.end('incorrectPassword');
      }

    });

  }

});

httpsRouter.post('/reservation/logout', (req, res) => {
  loginManager[req.session.token] = undefined;
  res.end();
});

httpsRouter.post('/reservation/newreservationvalidation', (req, res) => {
  if (loginManager[req.session.token] !== undefined) {

    sqlHandler.addReservation(loginManager[req.session.token], date, req.body.name, req.body.school, req.body.busNumber, req.body.time, 100, (status) => {
      if (status === 'full') {
        res.end('full');
      } else {
        res.end('added');
      }
    });

  } else {
    res.end('notLoggedIn');
  }

});

httpsRouter.post('/reservation/loadreservation', (req, res) => {
  if (loginManager[req.session.token] !== undefined) {
    sqlHandler.getReservations(loginManager[req.session.token], (result) => {
      res.end(result);
    });
  }
});

//Create socket server
const io = socketio(httpsServer, {});

io.use((socket, next) => {
  cookieSessionConfig(socket.request, socket.request.res || {}, next);
});

//Setup socket routes
io.on('connect', socket => {

  let credential = authenticationManager[socket.request.session.token];
//Run if Bus Driver
  if (credential === 'busdriver') {
    var busNumber = socket.handshake.query.busNumber;

    socket.on('sendLocation', (location, numberOfPeopleOnBus) => {
      io.to('users').emit('newLocation', location, numberOfPeopleOnBus, busNumber);
    });
    
  } else {

    socket.on('sendLocation', () => {
      socket.disconnect();
    });
  }

  socket.on('user', () => {
    socket.join('users');
  });

  //Disconect handler
  socket.on('disconnect', () => {
    if (credential === 'busdriver') {
      socket.to('users').emit('busDisconnect', busNumber)
    }

  });

});

const busTables = JSON.parse(fs.readFileSync('./busRoutes.json'));
var date;

httpServer.listen(8080);
httpsServer.listen(8443);

var resetBusses = schedule.scheduleJob('0 0 17 * * *', () => {
  var tomorrow = new Date();
  tomorrow.setDate(new Date().getDate()+1);
  
  var dd = tomorrow.getDate();

  var mm = tomorrow.getMonth()+1; 
  var yyyy = tomorrow.getFullYear();
  if(dd<10) 
  {
      dd='0'+dd;
  } 

  if(mm<10) 
  {
      mm='0'+mm;
  } 
  date = yyyy+'-'+mm+'-'+dd;

  sqlHandler.resetBusses(busTables, date)
});
