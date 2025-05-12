// Global variables for pagination and view state
let currentPage = 1;
let currentView = "cards";

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  fetchMakeupProducts();
});

// Fetch Makeup Products
async function fetchMakeupProducts() {
  const brand = document.getElementById("brandSelect").value;
  const category = document.getElementById("categorySelect").value;
  const sortType = document.getElementById("sortSelect").value;

  // Validate input selections
  if (!brand || !category) {
    alert("Please select both a brand and a category.");
    return;
  }

  try {
    document.getElementById("spinner").style.display = "block";
    const productContainer = document.getElementById("product-list");
    if (productContainer) {
      productContainer.innerHTML = "<p>Product Data</p>";
    } else {
      console.error(
        "Error: productContainer is null. Check if it exists in HTML."
      );
    }
let products = []; // Instead of const
products = await fetch("http://makeup-api.herokuapp.com/api/v1/products.json")
.then((response) => response.json());


    // Apply Sorting
    products = sortProducts(products, sortType);

    displayProducts(products.slice((currentPage - 1) * 10, currentPage * 10));
    // Show 10 products per page
      

  
    updatePaginationButtons(products.length);
  } catch (error) {
    console.error("Error fetching makeup products:", error);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
}

// Sorting Function
function sortProducts(products, sortType) {
  if (sortType === "price-low") {
    return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (sortType === "price-high") {
    return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (sortType === "name-asc") {
    return products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortType === "name-desc") {
    return products.sort((a, b) => b.name.localeCompare(a.name));
  }
  return products; // Default case
}

// Pagination Buttons
function updatePaginationButtons(totalProducts) {
  document.getElementById("nextBtn").disabled =
    currentPage * 10 >= totalProducts;
  document.getElementById("prevBtn").disabled = currentPage === 1;
}

// Navigate Pages
function nextPage() {
  currentPage++;
  fetchMakeupProducts();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchMakeupProducts();
  }
}

// Display Products in Cards and Table
function displayProducts(products) {
  const productContainer = document.getElementById("product-list");
  const tableBody = document.getElementById("product-table-body");

  productContainer.innerHTML = "";
  if (tableBody) {
    tableBody.innerHTML = "";
  } else {
    console.warn("Warning: tableBody is null. Check if it exists in HTML.");
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("col-md-4", "fade-in");

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

// Toggle Card & Table View
function toggleView() {
  const productList = document.getElementById("product-list");
  const productTable = document.getElementById("product-table");

  if (currentView === "cards") {
    productList.style.display = "none";
    productTable.style.display = "table";
    currentView = "table";
  } else {
    productList.style.display = "flex";
    productTable.style.display = "none";
    currentView = "cards";
  }
}
