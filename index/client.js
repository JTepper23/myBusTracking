var xhttp = new XMLHttpRequest();
const image = {
  url: '/icon.png',
  size: new google.maps.Size(38, 38),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(19, 19)
};

//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

var focusBusNumber;
function selectBusNumber() {
  document.getElementById('busNumber').style.visibility = 'hidden';
  document.getElementById('busNumberSubmit').style.visibility = 'hidden';
  document.querySelector('#busID h3').style.fontSize = '3vh';
  document.querySelector('#busID h3').innerHTML = 'There are 0 students on your bus out of 0 seats.';
  focusBusNumber = document.getElementById('busNumber').value;
}

// Set-up Map
let latlng1 = {lat: 40.995295, lng: -73.773774};

var map = new google.maps.Map(document.getElementById("map"), {
  center: latlng1,
  zoom: 13
});

// Handle Sockets

var schoolBusTrackers = {};

const socket = io();

socket.emit('user');

socket.on('newLocation', (location, numberOfStudentsOnBus, busNumber) => {

  if (schoolBusTrackers[busNumber] !== undefined) {
    schoolBusTrackers[busNumber].setPosition(location); 
  } else {
    schoolBusTrackers[busNumber] = new google.maps.Marker({
      position: location,
      title: busNumber,
      visible: true,
      label: busNumber,
      icon: image
    });
    schoolBusTrackers[busNumber].setMap(map);
  }

  if (busNumber === focusBusNumber) {
    document.querySelector('#busID h3').innerHTML = `There are ${numberOfStudentsOnBus} students on your bus out of 0 seats.`;
  }
});

socket.on('busDisconnect', (busNumber) => {
  schoolBusTrackers[busNumber].setMap(null);
  schoolBusTrackers[busNumber] = undefined;
});

