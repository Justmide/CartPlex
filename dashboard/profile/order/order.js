import { cart } from "../../../main.js";

const cartName = document.getElementById('cartName');
const cartPrice = document.getElementById('cartPrice');



if (cartName && cartPrice) {
    for (let i = 0; i < cart.length; i++) {
        const cartNameDiv = document.createElement('div');
        cartNameDiv.innerHTML = ` <p>${cart[i].title} </p>`;
        cartName.appendChild(cartNameDiv);

        const cartPriceDiv = document.createElement('div');
        cartPriceDiv.innerHTML = ` <p>$${cart[i].price} </p>`;
        cartPrice.appendChild(cartPriceDiv);

    }
}
