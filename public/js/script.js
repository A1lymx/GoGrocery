const productList = document.getElementById('product-list');
const cart = document.getElementById('cart');
let products = []; // Define products array
let cartJson = [];
let serverAlive = true;

// Get product list from server
fetch('/api/products')
  .then((response) => response.json())
  .then((data) => {
    products = data; // Assign data to products array
    displayProducts(products); // Display all products initially
  });

// Get cart data from server
fetch('/api/cart')
  .then((response) => response.json())
  .then((cartData) => {
    updateCart(cartData);
  });

setInterval(() => {
  fetch('api/alive')
    .then((response) => response.json())
    .then((data) => {
      if (!serverAlive) {
        location.reload();
      }
      console.log(data)
    })
    .catch((err) => {
      console.log(err);
      serverAlive = false;
      var htmlBody = document.getElementsByTagName('body')[0];
      htmlBody.innerHTML = '<h1>Server is down, please wait</h1>'
    });
}, 10000)

function createProductElement(product) {
  const element = document.createElement('div');
  element.classList.add('product');
  element.innerHTML = `
    <h2>${product.name}</h2>
    <img src="${product.pic}" width="175px">
    <p>£${product.price}/${product.weight}G</p>

    <button type="button" class="btn btn-info" onclick="addToCart('${product.id}')">Add to cart</button>
  `;
  return element;
}

function updateCart(cartData) {
  cartJson = cartData;
  cart.innerHTML = `
    <p><h2>Total: £${Math.abs(cartData.total).toFixed(2)}</h2></p>
    <ul>
      ${cartData.items.map((item) => `
        <li>
          <span>${item.name}:</span>
          <span>${item.quantity} x £${item.price}</span>
          <button type="button" class="btn btn-outline-info btn-sm " onclick="removeFromCart('${item.productId}')">x</button>
        </li>
      `).join('')}
    </ul>
    <button type="button" class="btn btn-outline-light" onclick="clearcart()">Clear All </button><button type="button" class="btn btn-info" onclick="checkout()">Check Out</button>
  `;
}

// eslint-disable-next-line no-unused-vars
function addToCart(productId) {
  fetch(`/api/cart/items/${productId}`, { method: 'POST' })
    .then((response) => response.json())
    .then((cartData) => {
      console.log(cartData);
      updateCart(cartData);
    });
}

// eslint-disable-next-line no-unused-vars
function removeFromCart(productId) {
  fetch(`/api/cart/items/${productId}`, { method: 'DELETE' })
    .then((response) => response.json())
    .then((cartData) => {
      updateCart(cartData);
    });
}

// eslint-disable-next-line no-unused-vars
function checkout() {
  const deliverOptionsDiv = document.getElementById('deliver-options');
  let totalWeight = 0;
  cartJson.items.forEach((item) => {
    totalWeight += item.weight * item.quantity;
  });
  if (cartJson.total < 40 && deliverOptionsDiv.value == 2) {
    alert('Only available for total price higher than £40');
  } else if (totalWeight > 7000 && deliverOptionsDiv.value == 1) {
    alert('Only available for total weight less than 7kg');
  } else {
    fetch('/api/cart/checkout', { method: 'POST' })
      .then((response) => response.json())
      .then((cartData) => {
        updateCart(cartData);
      })
      .then(() => {
        alert('Thank you for your purchase!');
      });
  }
}

function clearcart() {
  fetch('/api/cart/checkout', { method: 'POST' })
    .then((response) => response.json())
    .then((cartData) => {
      updateCart(cartData);
    })


}

window.addEventListener('load', () => {
  const addProductDiv = document.getElementById('add-product');
  const addProductBtn = document.getElementById('add-product-button');

  addProductBtn.addEventListener('click', () => {
    addProductDiv.innerHTML = `
    <form id="add-product-form">
      <div class="form-group">
        <label for="name">Item</label>
        <input type="text" class="form-control" id="name" placeholder="Enter name of the item">
      </div>
      <div class="form-group my-3">
        <label for="price">Price</label>
        <input type="text" class="form-control" id="price" placeholder="Enter price in pounds (£)">
      </div>
      <div class="form-group my-3">
        <label for="category">Category</label>
        <select class="form-control" id="category">
          <option value="fruit">Fruit</option>
          <option value="vegetable">Vegetable</option>
          <option value="dairy">Dairy</option>
          <option value="dairy">Other</option>
        </select>
      </div>
      <div class="form-group my-3">
        <label for="weight">Weight</label>
        <input type="text" class="form-control" id="weight" placeholder="Enter weight in grams (g):">
      </div>
      <div class="form-group my-3">
        <label for="pic">OrderNotes</label>
        <input type="text" class="form-control" id="pic" placeholder="The store's address and other helpful notes for delivery">
      </div>
      <button type="button" onClick="addNewItem()" class="btn btn-primary">Submit</button>
    </form>
  `;
  });
});

// eslint-disable-next-line no-unused-vars
function addNewItem() {
  const addProductDiv = document.getElementById('add-product');
  const name = document.getElementById('name').value + ' - Personalised';
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const weight = parseFloat(document.getElementById('weight').value);
  const pic = document.getElementById('pic').value;
  const newProduct = { productId: '99', name, price, category, weight, pic, quantity: 1 };

  console.log(newProduct);
  fetch('/api/cart/items/addItems', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newProduct)
  })
    .then((res) => res.json())
    .then((cartData) => {
      console.log('Success:', cartData);
      updateCart(cartData);
    })
    .then(() => {
      addProductDiv.innerHTML = 'Successfully added new product!';
    })
    .catch((err) => {
      console.log(err);
      alert('Error adding new product!');
    });
}

window.addEventListener('load', () => {
  const deliverOptionsDiv = document.getElementById('deliver-options');
  fetch('/api/delivery')
    .then((response) => response.json())
    .then((deliveryOpts) => {
      var opts = '';
      deliveryOpts.map((oneOpt) => {
        opts += `<option value="${oneOpt.id}">${oneOpt.deliverOption}</option>`;
      });
      deliverOptionsDiv.innerHTML = opts;
    });
});

const categoryFilter = document.getElementById('category-filter');

categoryFilter.addEventListener('change', () => {
  const selectedCategory = categoryFilter.value;
  if (selectedCategory) {
    filterProductsByCategory(selectedCategory);
  } else {
    displayProducts(products);
  }
});

function filterProductsByCategory(category) {
  const filteredProducts = products.filter(product => product.category === category);
  displayProducts(filteredProducts);
}

function displayProducts(products) {
  productList.innerHTML = ''; // Clear the product list
  products.forEach((product) => {
    const productElement = createProductElement(product);
    productList.appendChild(productElement);
  });
}
