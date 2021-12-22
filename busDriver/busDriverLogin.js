//Check if bus driver
$.ajax({
  type: "POST",
  url: '/busDriver/loginValidation',
  complete: (response) => {
    if (response.responseText === 'success') {
      window.location.href = '/busdriver'
    }
  }
});

//Html Functions
function showMenuBar() {
  document.getElementById('menu-bar').classList.toggle('active');
}

function submitPassword() {
  givenPassword = document.getElementById('passwordEntry').value;
  var data = {password: givenPassword};
  console.log(data);

  $.ajax({
    type: "POST",
    url: '/busDriver/loginValidation',
    data: JSON.stringify({password: givenPassword}),
    contentType: 'application/json',
    complete: (response) => {
      if (response.responseText === 'success') {
        window.location.href = '/busdriver'
      } else {
        document.getElementById('passwordText').innerHTML = 'Incorrect Password. Please try again:';
        document.getElementById('passwordText').style.color = 'red';
      }
    }
  });

}