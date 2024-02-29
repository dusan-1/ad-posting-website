const url = window.location.search;
const queryParams = new URLSearchParams(url);
const userId = queryParams.get('userId');

async function adminInfo() {
  const adminDiv = document.getElementById('admin-inf');
  const response = await fetch(`http://localhost:3000/users/${userId}`);
  const userData = await response.json();

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

  adminDiv.appendChild(userCard);
}
adminInfo();

const searchInput = document.getElementById('search-input');
let categories;

searchInput.addEventListener('change', function (e) {
  const inputValue = e.target.value.toLowerCase();
  if (inputValue == '') {
    fetchCategories(categories);
  } else {
    categories = categories.filter((c) =>
      c.name.toLowerCase().includes(inputValue)
    );
  }
  showCategories(categories);
});

function showCategories(categories) {
  const categoriesDiv = document.getElementById('categories');
  categoriesDiv.innerHTML = '';

  for (const category of categories) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoriesDiv.appendChild(categoryDiv);

    const name = document.createElement('h3');
    name.innerHTML = category.name;
    categoryDiv.appendChild(name);

    const imgDiv = document.createElement('div');
    imgDiv.classList.add('imgDiv');
    categoryDiv.appendChild(imgDiv);

    const img = document.createElement('img');
    img.src = category.image;
    imgDiv.appendChild(img);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = 'X';
    deleteBtn.addEventListener('click', async function () {
      this.parentNode.remove();
      /*await fetch(`http://localhost:3000/categories/${category.id}`, {
        method: 'DELETE',
      });*/
    });
    categoryDiv.appendChild(deleteBtn);

    const update = document.createElement('a');
    update.innerHTML = 'Update Category';
    update.href = `./category-edit.html?categoryId=${category.id}&&userId=${userId}`;
    categoryDiv.appendChild(update);
  }
}
async function fetchCategories() {
  const response = await fetch(`http://localhost:3000/categories`);
  categories = await response.json();
  showCategories(categories);
}
fetchCategories();

document.getElementById('aTag').href = `./category-add.html?userId=${userId}`;
