//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function requestPassword() {
  document.getElementById('requestPassword').setAttribute('onclick', '');
  const givenEmail = document.getElementById('email').value;

  $.ajax({
    type: "POST",
    url: '/reservation/forgotpasswordValidation',
    data: JSON.stringify({email: givenEmail}),
    contentType: 'application/json',
    complete: (response) => {
      
      if (response.responseText === 'emailSent') {
        document.querySelector('#login h6').innerHTML = 'Check you email for a temporary password. Please return to the login screen.';
        document.querySelector('#login h6').style.visibility = 'visible';
      } else {
        document.querySelector('#login h6').innerHTML = 'A user with this email does not exist. Try signing up.';
        document.querySelector('#login h6').style.visibility = 'visible';
      }

    }
  });

}