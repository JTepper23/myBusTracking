var busNumber;
var socket;

//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function confirmBusNumber() {
  document.getElementById("busNumberSubmit").setAttribute('onclick', '');
  document.getElementById("busNumber").style.backgroundColor = 'green';
  document.getElementById("busNumber").setAttribute('readonly', true);
  busNumber = document.getElementById("busNumber").value;
  
  //Create Socket Connection and begin location loop
  socket = io({
    query: {
      busNumber: busNumber
    }
  });
  setInterval(sendLocation, 1000);

  marker.setLabel(busNumber);
  marker.setMap(map);

}

var numberOfPeopleOnBus = 0;

function addPeople() {
  numberOfPeopleOnBus = numberOfPeopleOnBus + 1;
  document.querySelector('#numberPeople h2').innerHTML = numberOfPeopleOnBus;
}

function subtractPeople() {
  numberOfPeopleOnBus = numberOfPeopleOnBus - 1;
  if (numberOfPeopleOnBus < 0) {
    numberOfPeopleOnBus = 0;
  }
  document.querySelector('#numberPeople h2').innerHTML = numberOfPeopleOnBus;
}

//Initialize Map

let scarsdale = {lat: 40.995295, lng: -73.773774};

var map = new google.maps.Map(document.getElementById("map"), {
  center: scarsdale,
  zoom: 13
});


//Create Tracking Function
function sendLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      socket.emit('sendLocation', currentLocation, numberOfPeopleOnBus);
    });
  }
}


//Set up marker



