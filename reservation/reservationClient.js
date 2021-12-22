//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function logout() {
  $.ajax({
    type: "POST",
    url: '/reservation/logout',
    complete: () => {
      window.location.href = '/reservation/login';
    }
  });
}

$.ajax({
  type: "POST",
  url: '/reservation/loadreservation',
  complete: (response) => {
    var reservations = JSON.parse(response.responseText);
    reservations.forEach(element => {
      
      var table = document.getElementById('busReservations');
      var row = table.insertRow(1);

      var name = row.insertCell(0);
      var school = row.insertCell(1);
      var bus = row.insertCell(2);
      var time = row.insertCell(3);

      var button = document.createElement("BUTTON");
      var cancel = row.insertCell(4);
      cancel.appendChild(button);

      name.innerHTML = element.name;
      school.innerHTML = element.school;
      bus.innerHTML = element.bus;
      time.innerHTML = element.time;
      button.innerHTML = 'Cancel Reservation';
      button.setAttribute('id', 'cancelButton');
      // button.setAttribute('onclick', `cancel(${element.name}, ${element.school}, ${element.bus}, ${element.time})`);

    });
  }

});