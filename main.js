

// Get the cart from localStorage or initialize an empty cart
export let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsNames = cart?.map(item => item.title);

console.log(cartItemsNames); // To verify cart data

const timeEl = document.getElementById('todayTime');
const webYear = document.getElementById('websiteYear');
const productEl = document.getElementById('productView');
const sellingProductEl = document.getElementById('sellingProduct');
const productSort = document.getElementById('productList');
const productBtn = document.querySelector('.productList');
export const cartNumEL = document.getElementById('cartNum');
const cartNum2 = document.getElementById('cartNum2'); // Added missing element

import { app } from "./user/index.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const auth = getAuth(app)


onAuthStateChanged(auth, (user) => {
    if (user) {
    //   window.location.href = '../../dashboard/dashboard.html';
    } else {
      console.log('No authenticated user. Redirecting to login.');
    }
  });
  
// Update cart count function
export const updateCartCount = () => {
    let cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0); // Handle undefined quantity
    if (cartNumEL) cartNumEL.textContent = cartCount;
    if (cartNum2) cartNum2.textContent = cartCount;
};


// Call immediately to display cart count on page load
updateCartCount();

if ( cart && timeEl && webYear && productEl && sellingProductEl && productSort && productBtn && cartNumEL) {
    // Set up the current time and year
    const dateEL = new Date().toLocaleString();
    timeEl.textContent = dateEL;
    timeEl.style.color = '#DB4444';
    timeEl.style.fontWeight = 'bold';

    const webYearEl = new Date().getFullYear();
    webYear.textContent = webYearEl;

    const baseUrl = 'https://fakestoreapi.com';

    // Fetch product list
    const productList = async () => {
        console.log('Fetching data');
        try {
            const res = await fetch(`${baseUrl}/products/category/electronics?limit=8`);
            const data = await res.json();

            data.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('productItem');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p> $${product.price}</p>
                    <h5 class="Indicator"><i class="fa-regular fa-star"></i> ${product.rating.rate} <span>(${product.rating.count})</span></h5>
                    ${
                        cartItemsNames.includes(product.title)
                            ? `<div class="quantityControl">
                                  <button class="decreaseBtn">-</button>
                                  <span class="quantity">Quantity: ${cart.find(item => item.title === product.title)?.quantity || 0}</span>
                                  <button class="increaseBtn">+</button>
                              </div>`
                            : '<button class="addToCart">Add to Cart</button>'
                    }
                `;
                productEl.appendChild(productDiv);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    productList();

    // Fetch products for selling section
    const sellingProductList = async () => {
        console.log('Fetching CartItems');
        try {
            const productList = await fetch(`${baseUrl}/products/?limit=4`);
            const result = await productList.json();

            result.forEach(product => {
                const itemCartEl = document.createElement('div');
                itemCartEl.classList.add('itemCart');
                itemCartEl.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p> $${product.price}</p>
                    <h5><i class="fa-regular fa-star"></i> ${product.rating.rate} <span>(${product.rating.count})</span></h5>
                    ${
                        cartItemsNames.includes(product.title)
                            ? `<div class="quantityControl">
                                  <button class="decreaseBtn">-</button>
                                  <span class="quantity">Quantity: ${cart.find(item => item.title === product.title)?.quantity || 0}</span>
                                  <button class="increaseBtn">+</button>
                              </div>`
                            : '<button class="addToCart">Add to Cart</button>'
                    }
                `;
                sellingProductEl.appendChild(itemCartEl);
            });
        } catch (error) {
            console.error('Error fetching selling products:', error);
        }
    };

    sellingProductList();

    // Sort products
    const productSortList = async () => {
        try {
            const res = await fetch(`${baseUrl}/products?limit=12`);
            const data = await res.json();

            data.forEach(product => {
                const productSortDiv = document.createElement('div');
                productSortDiv.classList.add('productSortList');
                productSortDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p> $${product.price}</p>
                    <h5><i class="fa-regular fa-star"></i> ${product.rating.rate} <span>(${product.rating.count})</span></h5>
                    ${
                        cartItemsNames.includes(product.title)
                            ? `<div class="quantityControl">
                                  <button class="decreaseBtn">-</button>
                                  <p class="quantity">Quantity: ${cart.find(item => item.title === product.title)?.quantity || 0}</p>
                                  <button class="increaseBtn">+</button>
                              </div>`
                            : '<button class="addToCart">Add to Cart</button>'
                    }
                `;
                productSort.appendChild(productSortDiv);
            });
        } catch (error) {
            console.error('Error fetching sorted products:', error);
        }
    };

    productSortList();

    // Event listener for adding to the cart
    const handleAddToCart = (productElement) => {
        const title = productElement.querySelector('h3').textContent;
        const price = parseFloat(productElement.querySelector('p').textContent.replace('$', ''));
        const image = productElement.querySelector('img').src;

        // Check if the item is already in the cart
        const existingItem = cart.find(item => item.title === title);

        if (existingItem) {
            existingItem.quantity++;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Update quantity display
            const quantityElement = productElement.querySelector('.quantity');
            if (quantityElement) {
                quantityElement.textContent = `Quantity: ${existingItem.quantity}`;
            }
            return;
        }

        const cartItem = { title, price, image, quantity: 1 };
        cart.push(cartItem);

      
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        // cart control button 
        const addToCartBtn = productElement.querySelector('.addToCart');
        const quantityControl = document.createElement('div');
        quantityControl.classList.add('quantityControl');
        quantityControl.innerHTML = `
            <button class="decreaseBtn">-</button>
            <span class="quantity">Quantity: 1</span>
            <button class="increaseBtn">+</button>
        `;
        addToCartBtn.replaceWith(quantityControl);
    };

    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('addToCart')) {
            const productElement = event.target.closest('.productSortList, .productItem, .itemCart');
            if (productElement) {
                handleAddToCart(productElement);
            }
        }

        if (event.target.classList.contains('increaseBtn') || event.target.classList.contains('decreaseBtn')) {
            const productElement = event.target.closest('.productSortList, .productItem, .itemCart');
            if (!productElement) return;

            const title = productElement.querySelector('h3')?.textContent;
            const item = cart.find(cartItem => cartItem.title === title);

            if (item) {
                if (event.target.classList.contains('increaseBtn')) {
                    item.quantity++;
                } else if (event.target.classList.contains('decreaseBtn') && item.quantity > 0) {
                    item.quantity--;
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();

                const quantityElement = productElement.querySelector('.quantity');
                if (quantityElement) {
                    quantityElement.textContent = `Quantity: ${item.quantity}`;
                }

                // If quantity reaches 0, replace with Add to Cart button
                if (item.quantity === 0) {
                    const index = cart.findIndex(cartItem => cartItem.title === title);
                    if (index > -1) {
                        cart.splice(index, 1);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        
                        const quantityControl = productElement.querySelector('.quantityControl');
                        const addToCartBtn = document.createElement('button');
                        addToCartBtn.classList.add('addToCart');
                        addToCartBtn.textContent = 'Add to Cart';
                        quantityControl.replaceWith(addToCartBtn);
                    }
                }
            }
        }
    });

} else {
    console.warn("some JS are not available to be display.");
}
