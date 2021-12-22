//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function reserve() {
  document.getElementById('reserve').setAttribute('onclick', '');
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const school = document.getElementById('school').value;
  var busNumber = document.getElementById('bus').value;
  const time = document.getElementById('time').value;
  if (firstName === undefined || lastName === undefined) {
    document.querySelector('#newReservation h6').innerHTML = 'Please enter a valid name.'
    document.getElementById('reserve').setAttribute('onclick', 'reserve()');
  } else if (school === 'none') {
    document.querySelector('#newReservation h6').innerHTML = 'Please choose your school.'
    document.getElementById('reserve').setAttribute('onclick', 'reserve()');
  } else if (busNumber === 'none') {
    document.querySelector('#newReservation h6').innerHTML = 'Please choose your bus number.'
    document.getElementById('reserve').setAttribute('onclick', 'reserve()');
  } else if (time === 'none') {
    document.querySelector('#newReservation h6').innerHTML = 'Please choose your time.'
    document.getElementById('reserve').setAttribute('onclick', 'reserve()');
  } else {
    const name = firstName + ' ' + lastName;
    $.ajax({
      type: "POST",
      url: '/reservation/newreservationvalidation',
      data: JSON.stringify({name: name, school: school, busNumber: busNumber, time: time}),
      contentType: 'application/json',
      complete: (response) => {
        if (response.responseText == 'full') {
          document.querySelector('#newReservation h6').innerHTML = 'Sorry. All seats on this bus are filled.';
        } else {
          document.querySelector('#newReservation h6').innerHTML = 'Spot reserved. Redirecting...';
          setTimeout(() => {
            window.location.href = '/reservation';
          }, 5000);
        }
      }

    });

  }
  
}

