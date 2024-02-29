const url = window.location.search;
const queryParams = new URLSearchParams(url);
const userId = queryParams.get('userId');
const adId = queryParams.get('adId');
const select = document.getElementById('selectCategory');

async function showCategories() {
  const response = await fetch(`http://localhost:3000/categories`);
  const categories = await response.json();

  for (const category of categories) {
    const option = document.createElement('option');
    option.innerHTML = category.name;
    option.value = category.id;
    option.id = category.name.toLowerCase();
    select.appendChild(option);
  }
}
showCategories();

function validateInputs() {
  const inputs = document.querySelectorAll('.inputDiv > input');
  let state = true;

  inputs.forEach(function (input) {
    const errorId = `${input.id}Error`;
    const errorMessage = document.getElementById(errorId);
    errorMessage.innerHTML = '';
    input.classList.remove('error');

    if (input.value == '') {
      const fieldName = input.getAttribute('name');
      errorMessage.innerHTML = `${fieldName} polje ne sme biti prazno!`;
      input.classList.add('error');
      state = false;
    }
  });
  return state;
}

async function adAdd() {
  if (validateInputs()) {
    const title = document.getElementById('title').value;
    const text = document.getElementById('description').value;
    const price = Number(document.getElementById('price').value);
    const image = document.getElementById('image').value;
    const categoryOption = select.value;

    await fetch(`http://localhost:3000/ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        description: text,
        price: price,
        image: image,
        likes: 0,
        reviews: 0,
        rating: [],
        categoryId: categoryOption,
        userId: userId,
      }),
    });
    window.open(`./user.html?userId=${userId}`, '_self');
  }
}

async function inputsEdit() {
  if (queryParams.size > 1) {
    const response = await fetch(`http://localhost:3000/ads/${adId}`);
    const ad = await response.json();

    const title = (document.getElementById('title').value = ad.title);
    const text = (document.getElementById('description').value =
      ad.description);
    const price = (document.getElementById('price').value = ad.price);
    const image = (document.getElementById('image').value = ad.image);
    const showImage = (document.getElementById('slikaEdit').src = ad.image);
    const selectedOption = (select.value = ad.categoryId);
  }
}
inputsEdit();

async function adEdit() {
  if (validateInputs()) {
    const title = document.getElementById('title').value;
    const text = document.getElementById('description').value;
    const price = Number(document.getElementById('price').value);
    const image = document.getElementById('image').value;
    const categoryOption = select.value;

    await fetch(`http://localhost:3000/ads/${adId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        description: text,
        price: price,
        image: image,
        categoryId: categoryOption,
        userId: userId,
      }),
    });
    window.open(`./user.html?userId=${userId}`, '_self');
  }
}
