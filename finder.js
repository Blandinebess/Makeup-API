// Global variables for pagination and view state
var currentPage = 1;
var currentView = "cards";

async function fetchMakeupProducts() {
  const brand = document.getElementById("brandSelect").value;
  const category = document.getElementById("categorySelect").value;

  // Validate input selections
  if (!brand || !category) {
    alert("Please select both a brand and a category.");
    return;
  }

  try {
    document.getElementById("spinner").style.display = "block"; // Show spinner

    const response = await axios.get(
      `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}&product_type=${category}`
    );
    const products = response.data; // Full product list

    displayProducts(products.slice((currentPage - 1) * 10, currentPage * 10)); // Show 10 products per page
    updatePaginationButtons(products.length);
  } catch (error) {
    console.error("Error fetching makeup products:", error);
  } finally {
    document.getElementById("spinner").style.display = "none"; // Hide spinner
  }
}

// Function to update pagination buttons
function updatePaginationButtons(totalProducts) {
  document.getElementById("nextBtn").disabled =
    currentPage * 10 >= totalProducts;
  document.getElementById("prevBtn").disabled = currentPage === 1;
}

// Navigate to next page
function nextPage() {
  currentPage++;
  fetchMakeupProducts();
}

// Navigate to previous page
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMakeupProducts();
  }
}

// Function to display products dynamically
function displayProducts(products) {
  const sortType = document.getElementById("sortSelect").value;
  const productContainer = document.getElementById("product-list");
  const tableBody = document.getElementById("product-table-body");

  productContainer.innerHTML = ""; // Clear previous content
  tableBody.innerHTML = "";

  // Sorting logic
  if (sortType === "price-low") {
    products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortType === "price-high") {
    products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (sortType === "name-asc") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "name-desc") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  }

  products.forEach((product) => {
    // Create Bootstrap card
    const card = document.createElement("div");
    card.classList.add("col-md-4", "fade-in"); // Apply fade-in animation

    card.innerHTML = `
            <div class="card shadow-sm">
                <img src="${product.image_link}" class="card-img-top" alt="${
      product.name
    }">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${
                      product.description
                        ? product.description.slice(0, 100)
                        : "No description available."
                    }</p>
                    <span class="badge bg-info">${product.price} ${
      product.currency
    }</span>
                    <a href="${
                      product.product_link
                    }" target="_blank" class="btn btn-primary mt-2">View Product</a>
                </div>
            </div>
        `;
    productContainer.appendChild(card);

    // Create table row
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price} ${product.currency}</td>
            <td>${product.product_type}</td>
            <td><a href="${product.product_link}" target="_blank">View</a></td>
        `;
    tableBody.appendChild(row);
  });
}

// Function to toggle between Card and Table views
function toggleView() {
  if (currentView === "cards") {
    document.getElementById("product-list").style.display = "none";
    document.getElementById("product-table").style.display = "table";
    currentView = "table";
  } else {
    document.getElementById("product-list").style.display = "flex";
    document.getElementById("product-table").style.display = "none";
    currentView = "cards";
  }
}
