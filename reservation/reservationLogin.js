$.ajax({
  type: "POST",
  url: '/reservation/loginValidation',
  complete: (response) => {
    
    if (response.responseText === 'loggedIn') {
      window.location.href = '/reservation';
    }

  }
});


//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function login() {
  document.getElementById('loginbutton').setAttribute('onclick', '');
  const givenEmail = document.getElementById('email').value;
  const givenPassword = document.getElementById('password').value;

  $.ajax({
    type: "POST",
    url: '/reservation/loginValidation',
    data: JSON.stringify({email: givenEmail, password: givenPassword}),
    contentType: 'application/json',
    complete: (response) => {
      
      if (response.responseText === 'loggedIn') {
        window.location.href = '/reservation';
      } else if (response.responseText === 'incorrectPassword') {
        document.querySelector('#login h6').innerHTML = 'Incorrect Password. Please try again.';
        document.getElementById('loginbutton').setAttribute('onclick', 'login()');
      } else if (response.responseText === 'userNotFound') {
        document.querySelector('#login h6').innerHTML = 'User not found. Please try again.';
        document.getElementById('loginbutton').setAttribute('onclick', 'login()');
      }

    }
  });
}