//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function signup() {
  document.getElementById('signup').setAttribute('onclick', '');
  const givenEmail = document.getElementById('email').value;

  $.ajax({
    type: "POST",
    url: '/reservation/signupValidation',
    data: JSON.stringify({email: givenEmail}),
    contentType: 'application/json',
    complete: (response) => {
      
      if (response.responseText === 'emailSent') {
        document.querySelector('#login h6').innerHTML = 'Check your email for a temporary password. Please return to the login screen.';
        document.querySelector('#login h6').style.visibility = 'visible';
      } else{
        document.querySelector('#login h6').innerHTML = 'A user with this email already exists.';
        document.querySelector('#login h6').style.visibility = 'visible';
      }

    }
  });

}