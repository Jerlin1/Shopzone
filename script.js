let allProducts = []; 

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (el) el.textContent = getCart().length;
}

function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  showToast("✔️ Product added to cart");
}

function showToast(message) {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}
function loadCategories() {
  fetch("https://dummyjson.com/products/categories")
    .then(res => res.json())
    .then(categories => {
      const select = document.getElementById("categoryFilter");
      if (!select) return;
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
      });
    });
}

function renderProducts(products) {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.thumbnail}" alt="">
      <h3>${product.title}</h3>
      <p>₹${product.price}</p>
      <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function applyFilters() {
  let filtered = [...allProducts];
  const searchVal = document.getElementById("searchInput")?.value?.toLowerCase();
  const categoryVal = document.getElementById("categoryFilter")?.value;
  const sortVal = document.getElementById("sortBy")?.value;

  if (searchVal)
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchVal) ||
      p.description.toLowerCase().includes(searchVal)
    );

  if (categoryVal)
    filtered = filtered.filter(p => p.category === categoryVal);

  if (sortVal === "asc")
    filtered.sort((a, b) => a.price - b.price);
  else if (sortVal === "desc")
    filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
}

if (document.getElementById("products-container")) {
  fetch("https://dummyjson.com/products?limit=100")
    .then(res => res.json())
    .then(data => {
      allProducts = data.products;
      renderProducts(allProducts);
      loadCategories();

      // Add filter events
      document.getElementById("searchInput")?.addEventListener("input", applyFilters);
      document.getElementById("categoryFilter")?.addEventListener("change", applyFilters);
      document.getElementById("sortBy")?.addEventListener("change", applyFilters);
    });
}

if (document.getElementById("featured-products")) {
  fetch("https://dummyjson.com/products?limit=4")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("featured-products");
      data.products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <img src="${product.thumbnail}" alt="">
          <h3>${product.title}</h3>
          <p>₹${product.price}</p>
          <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        `;
        container.appendChild(card);
      });
    });
}

if (document.getElementById("cart-items")) {
  const cart = getCart();
  const ul = document.getElementById("cart-items");
  const totalEl = document.getElementById("total");
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.title} - ₹${item.price}
      <button onclick="removeItem(${index})">Remove</button>
    `;
    ul.appendChild(li);
    total += item.price;
  });

  totalEl.textContent = total.toFixed(2);
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  location.reload();
}

function placeOrder() {
  localStorage.removeItem("cart");
  window.location.href = "success.html";
}

updateCartCount();
