//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function resetPassword() {
  document.getElementById('resetPassword').setAttribute('onclick', '');
  const givenPassword = document.getElementById('password').value;
  const givenVerifyPassword = document.getElementById('verifyPassword').value;

  if (givenPassword !== givenVerifyPassword) {
    document.querySelector('#login h6').innerHTML = "Your passwords don't match.";
    document.querySelector('#login h6').style.visibility = 'visible';
    document.getElementById('resetPassword').setAttribute('onclick', 'resetPassword()');
  } else if (givenPassword.length < 8) {
    document.querySelector('#login h6').innerHTML = 'Your password is not 8 characters long.';
    document.querySelector('#login h6').style.visibility = 'visible';
    document.getElementById('resetPassword').setAttribute('onclick', 'resetPassword()');
  } else {
    $.ajax({
      type: "POST",
      url: '/reservation/resetpasswordvalidation',
      data: JSON.stringify({password: givenPassword}),
      contentType: 'application/json',
      complete: (response) => {
        
        if (response.responseText === 'passwordReset') {
          document.querySelector('#login h6').innerHTML = 'Your password has been reset. Redirecting...';
          document.querySelector('#login h6').style.visibility = 'visible';
          setTimeout(() => {
            window.location.href = '/reservation';
          }, 5000);
        } else {
          document.querySelector('#login h6').innerHTML = 'You are not logged in. Redirecting...';
          document.querySelector('#login h6').style.visibility = 'visible';
          setTimeout(() => {
            window.location.href = '/reservation/login';
          }, 5000);
        }

      }
    });

  }

}