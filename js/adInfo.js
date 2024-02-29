const url = window.location.search;
const queryParams = new URLSearchParams(url);
const userId = queryParams.get('userId');
const adId = queryParams.get('adId');
let ad;
let userData;
let categories;
let comments;

loadData();
async function loadData() {
  await loadCategories();
  await loadUserData();
  await loadAd();
  await loadComments();
}

async function loadAd() {
  const response = await fetch(`http://localhost:3000/ads/${adId}`);
  ad = await response.json();
  showAd(ad);
}

async function loadUserData() {
  const response = await fetch(`http://localhost:3000/users`);
  userData = await response.json();
}

async function loadCategories() {
  const response = await fetch(`http://localhost:3000/categories`);
  categories = await response.json();
}

async function loadComments() {
  const response = await fetch(`http://localhost:3000/comments?adId=${adId}`);
  comments = await response.json();
  showComments(comments);
}

function likeAdd() {
  const likeDiv = document.getElementById('like-icon');
  const numberOfLikes = document.getElementById('like-count');
  const heart = document.getElementsByClassName('fa-heart')[0];
  likeDiv.addEventListener('click', async function () {
    heart.classList.add('active');
    ad.likes++;
    numberOfLikes.innerText = ad.likes;
    await fetch(`http://localhost:3000/ads/${adId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likes: ad.likes,
      }),
    });
  });
}
likeAdd();

function showAd(ad) {
  const description = document.getElementById('description');
  const title = document.getElementById('title');
  const imageAd = document.getElementById('product-image');
  const price = document.getElementById('price');
  const categoryP = document.getElementById('category');
  const userName = document.getElementById('posted-by');
  const reviewsCount = document.getElementById('reviews-count');
  const likeCount = document.getElementById('like-count');
  const averageRatingDiv = document.getElementById('average-rating');

  //prettier-ignore
  const category = categories.find((category) => category.id == ad.categoryId);
  const user = userData.find((user) => user.id == ad.userId);

  imageAd.src = ad.image;
  description.innerHTML = ad.description;
  title.innerHTML = ad.title;
  price.innerHTML = ad.price + ' din';
  categoryP.innerHTML = category.name;
  userName.innerHTML = `User: ${user.firstName} ${user.lastName}`;
  reviewsCount.innerHTML = `(${ad.rating.length} ocena)`;
  likeCount.innerHTML = ad.likes;
  const averageRating = calculateAverage(ad.rating);
  //prettier-ignore
  const numberRating =averageRating % 1 === 0 ? averageRating.toFixed(0) : averageRating.toFixed(1);
  averageRatingDiv.innerHTML = `${numberRating} prosek`;
}

function calculateAverage(ratingArray) {
  const averageRating =
    ratingArray.reduce((sum, currentValue) => sum + currentValue, 0) /
    ratingArray.length;
  return averageRating;
}

//Rating zvezdicama
let selectedStarIndex = -1;
function rateByStars() {
  const stars = document.querySelectorAll('.fa-star');

  stars.forEach((star, index1) => {
    star.addEventListener('click', () => {
      selectedStarIndex = index1;
      stars.forEach((star, index2) => {
        index1 >= index2
          ? star.classList.add('active')
          : star.classList.remove('active');
      });
    });
  });
}
rateByStars();

async function submitRating() {
  const errorM = document.getElementById('error');
  errorM.style.display = '';
  if (selectedStarIndex < 0) {
    errorM.style.display = 'flex';
    return;
  }
  const currentRatingArray = ad.rating;
  currentRatingArray.push(selectedStarIndex + 1);

  await fetch(`http://localhost:3000/ads/${adId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rating: currentRatingArray,
    }),
  });
}

function showComments(comments) {
  const commentUL = document.getElementById('comment-list');

  for (const comment of comments) {
    const user = userData.find((user) => user.id == comment.userId);

    const li = document.createElement('li');
    li.innerHTML = `<i>${user.firstName} ${user.lastName}</i> : ${comment.text}`;
    commentUL.appendChild(li);
  }
}

//Provera da li je komentar input ispunjen
const textAreaInput = document.getElementById('new-comment-input');
function commentCheck() {
  let state = true;
  textAreaInput.style.borderColor = '';
  const errorM = document.getElementById('error2');
  errorM.style.display = 'none';

  if (textAreaInput.value.trim() == '') {
    textAreaInput.style.borderColor = 'red';
    errorM.style.display = 'flex';
    state = false;
  }
  return state;
}

/////Unos komentara tipkom Enter
textAreaInput.addEventListener('keypress', function (event) {
  if (event.key == 'Enter' && commentCheck()) {
    addComment();
  }
});

//Unos komentara na dugme
async function addComment() {
  if (commentCheck()) {
    await fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textAreaInput.value,
        adId: adId,
        userId: userId,
      }),
    });
    const user = userData.find((user) => user.id == userId);
    const commentList = document.getElementById('comment-list');
    const newComment = document.createElement('li');
    newComment.innerHTML = `<i> ${user.firstName} ${user.lastName}: </i> ${textAreaInput.value}`;
    commentList.appendChild(newComment);
    textAreaInput.value = '';
  }
}
