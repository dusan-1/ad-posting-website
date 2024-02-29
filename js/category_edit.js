const url = window.location.search;
const queryParams = new URLSearchParams(url);
const userId = queryParams.get('userId');
const categoryId = queryParams.get('categoryId');

async function showCategories() {
  const response = await fetch(
    `http://localhost:3000/categories/${categoryId}`
  );
  const category = await response.json();

  document.getElementById('name-input').value = category.name;
  document.getElementById('image-input').value = category.image;
}
showCategories();

const nameInput = document.getElementById('name-input');
const nameError = document.querySelector('.error-message');
const imageInput = document.getElementById('image-input');
const imageError = document.querySelectorAll('.error-message')[1];

async function editCategory() {
  const name = document.getElementById('name-input').value;
  const image = document.getElementById('image-input').value;
  //Provera da li nisu prazna polja
  nameInput.style.borderColor = '';
  imageInput.style.borderColor = '';
  nameError.style.display = 'none';
  imageError.style.display = 'none';

  if (name == '') {
    nameInput.style.borderColor = 'red';
    nameError.style.display = 'flex';
  }
  if (image == '') {
    imageInput.style.borderColor = 'red';
    imageError.style.display = 'flex';
  }
  if (name == '' || image == '') {
    return;
  }
  //Nastavak ukoliko nisu prazna polja
  await fetch(`http://localhost:3000/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      image: image,
    }),
  });
  window.open(`./admin.html?idKorisnika=${userId}`, '_self');
}
