const url = window.location.search;
const queryParams = new URLSearchParams(url);
const userId = queryParams.get('userId');

const adsDiv = document.getElementById('all-ads');
let allAds;
let categories;
let userData;

loadData();
async function loadData() {
  await loadCategories();
  await loadUserData();
  await loadAllAds();
}

async function loadAllAds() {
  const response = await fetch(`http://localhost:3000/ads`);
  allAds = await response.json();
  showAds(allAds);
}

async function loadUserData() {
  const response = await fetch(`http://localhost:3000/users`);
  userData = await response.json();
}

async function loadCategories() {
  const response = await fetch(`http://localhost:3000/categories`);
  categories = await response.json();

  selectOptions(categories);
}

function showAds(ads) {
  adsDiv.innerHTML = '';

  for (const ad of ads) {
    const adDiv = document.createElement('div');
    adDiv.classList.add('adDiv');
    adsDiv.appendChild(adDiv);
    //prettier-ignore
    const category = categories.find((category) => category.id == ad.categoryId);
    const user = userData.find((user) => user.id == ad.userId);

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

    const adView = document.createElement('a');
    adView.innerHTML = 'View AD';
    adView.href = `./ad-info.html?adId=${ad.id}&&userId=${userId}`;
    adView.addEventListener('click', async function () {
      await fetch(`http://localhost:3000/ads/${ad.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviews: ++ad.reviews,
        }),
      });
    });
    adDiv.appendChild(adView);

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
    const averageRating = calculateAverage(ad.rating);
    //prettier-ignore
    const numberRating = (averageRating % 1 === 0) ? averageRating.toFixed(0): averageRating.toFixed(1);
    rating.innerHTML = 'Rating: ' + numberRating;
    rating.classList.add('rating');
    adDiv.appendChild(rating);

    const userName = document.createElement('h4');
    userName.innerHTML = `User: ${user.firstName} ${user.lastName}`;
    userName.classList.add('userName');
    adDiv.appendChild(userName);
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
  ///Filtriranje po kategoriji
  const categoryValue = selectCategory.value;
  let filteredAds = allAds;

  if (categoryValue != 'all') {
    //prettier-ignore
    filteredAds = allAds.filter( (ad) => ad.categoryId == categoryValue);
  }

  //Filtriranje po ceni
  const minPrice = document.getElementById('price-min').value;
  const maxPrice = document.getElementById('price-max').value;
  if (minPrice != '' && isNaN(minPrice) == false) {
    const min = Number(minPrice);
    filteredAds = filteredAds.filter((ad) => ad.price >= min);
  }
  if (maxPrice != '' && isNaN(maxPrice) == false) {
    const max = Number(maxPrice);
    filteredAds = filteredAds.filter((ad) => ad.price <= max);
  }

  //Filtriranje po atributima
  const sortOrder = document.getElementById('select-asc-desc').value;
  const sortAttribute = document.getElementById('select-attributes').value;

  let order;
  if (sortOrder == 'desc') {
    order = -1;
  } else {
    order = 1;
  }
  //prettier-ignore
  if (sortOrder != 'none' && sortAttribute != 'none') { 
    if (sortAttribute === 'rating') {
      filteredAds = filteredAds.sort((a, b) => (calculateAverage(a.rating) - calculateAverage(b.rating)) * order)
    } else { 
    filteredAds = filteredAds.sort((a, b) => (a[sortAttribute] - b[sortAttribute]) * order); 
    }

    asdhjsad;
    ashfjadhgjda;
  }

  //Prikazivanje filtriranih oglasa
  showAds(filteredAds);
}

function calculateAverage(ratingArray) {
  const averageRating =
    ratingArray.reduce((sum, currentValue) => sum + currentValue, 0) /
    ratingArray.length;
  return averageRating;
}
