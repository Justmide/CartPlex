import { cart } from "../../../main.js";

export let finalOrderTotal = 0;


document.addEventListener('DOMContentLoaded', () => {
  
    const cartImg = document.getElementById('cartImg');
    const cartName = document.getElementById('cartName');
    const cartPrice = document.getElementById('cartPrice');
    const cartControl = document.getElementById('cartControl');
    const subAmount = document.getElementById('subAmount');
    const orderTotal = document.getElementById('orderTotal');
    const checkOut = document.getElementById('checkOut');

    console.log('Cart contents:', cart); // Debug cart contents

    // Verify cart exists and has items
    if (!cart || !cart.length) {
        console.log('Cart is empty');
        localStorage.setItem('orderTotal', '0');
        return;
    }

    // Calculate total amount
    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);
    console.log('Total Amount:', totalAmount); // Debug total amount

    
    const calculateOrder = [totalAmount, 15, 5.52];
    const orderCalc = calculateOrder.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    finalOrderTotal = orderCalc;
    localStorage.setItem('orderTotal', orderCalc.toString());

    if (subAmount) {
        subAmount.innerHTML = `$${totalAmount.toFixed(2)}`;
    }else{
        console.log('no total order');
    }
    
    if (orderTotal) {
        orderTotal.innerHTML = `$${orderCalc.toFixed(2)}`;
    }else{
        console.log('no total order');
        
    }

    // Only render cart items if all required elements exist
    if (cartImg && cartName && cartPrice && cartControl) {
        for (let i = 0; i < cart.length; i++) {
            const cartImgDiv = document.createElement('div');
            cartImgDiv.innerHTML = ` <img src="${cart[i].image}" alt="${cart[i].title}">`;
            cartImg.appendChild(cartImgDiv);

            const cartNameDiv = document.createElement('div');
            cartNameDiv.innerHTML = ` <p>${cart[i].title} </p>`;
            cartName.appendChild(cartNameDiv);

            const cartPriceDiv = document.createElement('div');
            cartPriceDiv.innerHTML = ` <p>$${cart[i].price} </p>`;
            cartPrice.appendChild(cartPriceDiv);

            const cartControlDiv = document.createElement('div');
            cartControlDiv.innerHTML = `
                <p class="quantity"> ${cart[i].quantity || 0}</p>
            `;
            cartControl.appendChild(cartControlDiv);
        }
    }

    // Add checkout event listener if element exists
    if (checkOut) {
        checkOut.addEventListener('click', () => {
            let timerInterval;
            Swal.fire({
                title: "CheckOut!",
                html: "Proceeding to payment in <b></b> milliseconds.",
                timer: 3000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                    const timer = Swal.getPopup().querySelector("b");
                    timerInterval = setInterval(() => {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }, 100);
                },
                willClose: () => {
                    clearInterval(timerInterval);
                }
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log("I was closed by the timer");
                }
                window.location.href = "../payment/payment.html";
            });
        });
    }
});