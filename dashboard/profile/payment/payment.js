import {
  getFirestore,
  getDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { app } from "../../../user/index.js";
import {
  emailDisplay,
  firstName,
  lastName,
  phone,
  country,
} from "../settings.js";
import { finalOrderTotal } from "../cart/cart.js";

const DB = getFirestore(app);
const auth = getAuth(app);

console.log(auth);
console.log(DB);

const orderTotal = document.getElementById("orderTotal");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Authenticated user:", user);

    const fetchProfileDetails = async () => {
      try {
        console.log("Fetching user profile");
        const userId = user.uid;
        emailDisplay.textContent = user.email;
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(DB, "users", userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          firstName.textContent = userData.FirstName;
          lastName.textContent = userData.LastName;
          phone.textContent = userData.phone;

          // Get order total from localStorage
          const storedTotal = localStorage.getItem("orderTotal");
          if (orderTotal && storedTotal) {
            orderTotal.textContent = `$${parseFloat(storedTotal).toFixed(2)}`;
            // Update finalOrderTotal for use in payment processing
            // finalOrderTotal = parseFloat(storedTotal);
          }
          // country.textContent = 'Nigeria';
        } else {
          // Create a new user document if it doesn't exist
          await setDoc(doc(DB, "users", userId), {
            FirstName: firstName.value || "",
            LastName: lastName.value || "",
            phone: phone.value || "",
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Error fetching or creating user profile:", error);
      }
    };

    fetchProfileDetails();
  } else {
    console.log("No authenticated user. Redirecting to login.");
    window.location.href = "../../user/signup.html";
  }
});

// Payment Form Submission
const paymentForm = document.getElementById("paymentForm");
if (paymentForm) {
  paymentForm.addEventListener("submit", payWithPaystack);
}

function payWithPaystack(e) {
  e.preventDefault();

  const emailDisplay = document.getElementById("emailDisplay");
  const orderTotal = document.getElementById("orderTotal");

  // Get the latest total from localStorage
  const storedTotal = localStorage.getItem("orderTotal");
  const amountToCharge = storedTotal ? parseFloat(storedTotal) : 0;

  console.log("Order total in USD:", amountToCharge);

  const usdToNairaRate = 1620;
  const amountInNaira = amountToCharge * usdToNairaRate;

  // Convert amount to integer (remove decimals)
  const amountInKobo = Math.round(amountInNaira * 100);

  console.log("Amount in Naira:", amountInNaira);
  console.log("Amount in Kobo (integer):", amountInKobo);

  if (isNaN(amountInKobo) || amountInKobo <= 0) {
    alert("Invalid payment amount. Please try again.");
    return;
  }

  let handler = PaystackPop.setup({
    key: "pk_test_107cb3d92b38e8b45e2e88b89380a2caf514cb92", // Replace with your actual Paystack public key
    email: emailDisplay.textContent,
    amount: amountInKobo, // Pass a valid integer
    currency: "NGN",
    ref: "" + Math.floor(Math.random() * 1000000000 + 1),
    onClose: function () {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });
    },
    callback: function (response) {
      Swal.fire({
        title: "Payment Successful!",
        text: `Reference: ${response.reference}`,
        icon: "success",
        draggable: true,
      });
      // Clear only the cart data
      localStorage.removeItem("cart");
      localStorage.removeItem("orderTotal"); // Optional, clear total as well
      window.location.href = "../order/order.html";
    },
  });

  handler.openIframe();
}
