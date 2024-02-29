const url = window.location.search;
const queryParams = new URLSearchParams(url);
const userId = queryParams.get('userId');
const userDiv = document.getElementById('user-inf');
const adsDiv = document.getElementById('ads-div');
loadCategories();
let userData;
let userAds;
let categories;

const aside = document.querySelector('#href');
const adAdd = document.createElement('a');
adAdd.innerHTML = 'Dodaj Oglas';
adAdd.href = `./ad-Add.html?userId=${userId}`;
aside.appendChild(adAdd);
const allAds = document.createElement('a');
allAds.innerHTML = 'Svi oglasi';
allAds.href = `./ads.html?userId=${userId}`;
aside.appendChild(allAds);

async function loadUserData() {
  const response = await fetch(`http://localhost:3000/users/${userId}`);
  userData = await response.json();
  showUserInfo(userData);
}
loadUserData();

async function loadUserAds() {
  const response = await fetch(`http://localhost:3000/ads?userId=${userId}`);
  userAds = await response.json();
  showUserAds(userAds);
}
loadUserAds();

async function loadCategories() {
  const response = await fetch(`http://localhost:3000/categories`);
  categories = await response.json();

  selectOptions(categories);
}

function showUserInfo(userData) {
  const userCard = document.createElement('div');
  userCard.classList.add('user-card');

  userCard.innerHTML = `
    <h3>${userData.firstName} ${userData.lastName}</h3>
    <p>Username: ${userData.username}</p>
    <p>Password: ${userData.password}</p>
    <p>Address: ${userData.address}</p>
    <p>Phone Number: ${userData.phoneNumber}</p>
    <p>Gender: ${userData.gender}</p>
  `;

  userDiv.appendChild(userCard);
}

function showUserAds(userAds) {
  adsDiv.innerHTML = '';

  for (const ad of userAds) {
    const adDiv = document.createElement('div');
    adDiv.classList.add('adDiv');
    adsDiv.appendChild(adDiv);
    //prettier-ignore
    const category = categories.find((category) => category.id == ad.categoryId);

    const categoryName = document.createElement('h5');
    categoryName.innerHTML = category.name;
    categoryName.classList.add('categoryName');
    adDiv.appendChild(categoryName);

    const title = document.createElement('h3');
    title.innerHTML = ad.title;
    title.classList.add('title');
    adDiv.appendChild(title);

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgDiv');
    adDiv.appendChild(imgDiv);

    const img = document.createElement('img');
    img.src = ad.image;
    imgDiv.appendChild(img);

    const dltBtn = document.createElement('button');
    dltBtn.innerHTML = 'X';
    dltBtn.addEventListener('click', async function () {
      this.parentNode.remove();
      /*await fetch(`http://localhost:3000/ads/${ad.id}`, {
        method: 'DELETE',
      });*/
    });
    adDiv.appendChild(dltBtn);

    const adEdit = document.createElement('a');
    adEdit.innerHTML = 'Edit AD';
    adEdit.href = `./ad-Edit.html?adId=${ad.id}&&userId=${ad.userId}`;
    adDiv.appendChild(adEdit);

    const description = document.createElement('p');
    description.innerHTML = ad.description;
    description.classList.add('description');
    adDiv.appendChild(description);

    const price = document.createElement('h4');
    price.innerHTML = 'Price: ' + ad.price;
    price.classList.add('price');
    adDiv.appendChild(price);

    const likes = document.createElement('p');
    likes.innerHTML = 'Likes: ' + ad.likes;
    likes.classList.add('likes');
    adDiv.appendChild(likes);

    const reviews = document.createElement('p');
    reviews.innerHTML = 'Reviws: ' + ad.reviews;
    reviews.classList.add('reviews');
    adDiv.appendChild(reviews);

    const rating = document.createElement('p');
    //prettier-ignore
    const averageRating =ad.rating.reduce((sum, currentValue) => sum + currentValue, 0) /ad.rating.length;
    //prettier-ignore
    const numberRating = (averageRating % 1 === 0)? averageRating.toFixed(0): averageRating.toFixed(1);
    rating.innerHTML = 'Rating: ' + numberRating;
    rating.classList.add('rating');
    adDiv.appendChild(rating);
  }
}

const selectCategory = document.getElementById('selectCategory');
function selectOptions(categories) {
  for (const category of categories) {
    const option = document.createElement('option');
    option.innerHTML = category.name;
    option.value = category.id;
    selectCategory.appendChild(option);
  }
}

function filterAds() {
  const categoryValue = selectCategory.value;

  let filteredAds = userAds;
  if (categoryValue != 'all') {
    //prettier-ignore
    filteredAds = userAds.filter( (ad) => ad.categoryId == categoryValue);
  }
  showUserAds(filteredAds);
}
