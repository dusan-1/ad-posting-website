const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const username = document.getElementById('username');
const address = document.getElementById('adress');
const number = document.getElementById('phone-number');
const genderInput = document.getElementById('male').checked;
let gender = genderInput == true ? 'Male' : 'Female';
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
const isAdmin = document.getElementById('admin');

async function userCheck() {
  if (username.value.length < 5) {
    return;
  }
  //prettier-ignore
  const response = await fetch( `http://localhost:3000/users?username=${username.value}`);
  const userResponse = await response.json();
  if (userResponse.length > 0) {
    return true;
  }
  console.log(userResponse);
  return false;
}

async function registerCheck() {
  //Provera da li su inputi ispunjeni
  const inputs = document.getElementsByTagName('input');
  let emptyInput = false;
  for (const input of inputs) {
    input.style.borderColor = '';
    if (input.value.trim() == '') {
      input.style.borderColor = 'red';
      emptyInput = true;
    }
  }
  if (emptyInput == true) {
    return false;
  }

  //Provera da li su username i password duzi od 5 karaktera
  const lengthError = document.querySelectorAll('.length-error');
  lengthError.forEach((e) => e.classList.remove('length-error2'));
  if (username.value.length < 5) {
    lengthError[0].classList.add('length-error2');
  }
  if (password.value.length < 5) {
    lengthError[1].classList.add('length-error2');
  }
  if (username.value.length < 5 || password.value.length < 5) {
    return false;
  }

  //Provera da li korisnik vec postoji
  if (await userCheck()) {
    alert('Korisnik vec postoji');
    return false;
  }
  //Provera da li se lozinke podudaraju
  const passwordError = document.getElementsByClassName('not-same')[0];
  passwordError.style.display = 'none';
  if (password.value != confirmPassword.value) {
    passwordError.style.display = 'flex';
    return false;
  }
  return true;
}

async function register() {
  if (await registerCheck()) {
    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        username: username.value,
        password: confirmPassword.value,
        address: address.value,
        phoneNumber: number.value,
        gender: gender,
        admin: isAdmin.checked,
      }),
    });
    window.open(`./index.html`, '_self');
  }
}
