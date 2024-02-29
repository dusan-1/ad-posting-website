let currentIndex = 0;
const categoriesDiv = document.querySelector('.show-categories');

async function showCategories() {
  const response = await fetch(`http://localhost:3000/categories`);
  const categories = await response.json();

  const categoryDiv = document.createElement('div');
  categoryDiv.classList.add('categoryDiv');
  categoriesDiv.appendChild(categoryDiv);

  const imgDiv = document.createElement('div');
  imgDiv.classList.add('imgDiv');
  categoryDiv.appendChild(imgDiv);

  const img = document.createElement('img');
  img.src = categories[currentIndex].image;
  img.style.width = '100%';
  img.style.height = '100%';
  imgDiv.appendChild(img);

  const btnNext = document.createElement('button');
  btnNext.classList.add('btn-next');
  btnNext.innerHTML = '>';
  btnNext.addEventListener('click', function () {
    currentIndex++;
    if (currentIndex >= categories.length) {
      currentIndex = 0;
    }
    img.src = categories[currentIndex].image;
    description.innerHTML = categories[currentIndex].name;
  });
  imgDiv.appendChild(btnNext);

  const btnPrevious = document.createElement('button');
  btnPrevious.classList.add('btn-previous');
  btnPrevious.addEventListener('click', function () {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = categories.length - 1;
    }
    img.src = categories[currentIndex].image;
    description.innerHTML = categories[currentIndex].name;
  });
  btnPrevious.innerHTML = '<';
  imgDiv.appendChild(btnPrevious);

  const description = document.createElement('h4');
  description.classList.add('category-description');
  description.innerHTML = categories[currentIndex].name;
  categoryDiv.appendChild(description);
}
showCategories();

///// Provera Input polja
document.getElementById('btn-login').addEventListener('click', checkLogin);
function checkLogin() {
  const inputKorisnicko = document.getElementById('input-korisnicko').value;
  const inputLozinka = document.getElementById('input-lozinka').value;

  document.getElementById('input-korisnicko').style.borderColor = '';
  document.getElementById('input-lozinka').style.borderColor = '';
  //prettier-ignore
  document.querySelectorAll('.login-error').forEach((p) => (p.style.display = 'none'));

  if (inputKorisnicko == '' && inputLozinka == '') {
    document.getElementById('input-korisnicko').style.borderColor = 'red';
    document.getElementById('input-lozinka').style.borderColor = 'red';
    //prettier-ignore
    document.querySelectorAll('.login-error').forEach(p => p.style.display = 'flex');
    return;
  }
  if (inputKorisnicko == '') {
    document.getElementById('input-korisnicko').style.borderColor = 'red';
    document.querySelectorAll('.login-error')[0].style.display = 'flex';
    return;
  }
  if (inputLozinka == '') {
    document.getElementById('input-lozinka').style.borderColor = 'red';
    document.querySelectorAll('.login-error')[1].style.display = 'flex';
    return;
  }
  return true;
}
/// Nastavak ukoliko je sve u redu
async function login() {
  if (checkLogin()) {
    const inputKorisnicko = document.getElementById('input-korisnicko').value;
    const inputLozinka = document.getElementById('input-lozinka').value;
    //prettier-ignore
    const response = await fetch(`http://localhost:3000/users?username=${inputKorisnicko}&&password=${inputLozinka}`);
    const user = await response.json();

    if (user.length == 0) {
      alert('Pogresno korisnicko ime ili lozinka');
      return;
    }
    if (user[0].admin == true) {
      window.open(`./admin.html?userId=${user[0].id}`, '_self');
    } else {
      window.open(`./user.html?userId=${user[0].id}`, '_self');
    }
  }
}
