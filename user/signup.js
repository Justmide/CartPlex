import { app } from "./index.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";


const auth = getAuth(app);


import { emailEl } from "./index.js";
import { passwordEl } from "./index.js";

const errMsgs = document.getElementById('err');
const remember = document.getElementById('remember');
const signupEl = document.getElementById('signup');
const firstNameEl = document.getElementById('firstName');
const lastNameEl = document.getElementById('lastName');

// GET USER DETAILS TO FIRESTORE
// const usersDetails = async (uid, firstName, lastName, email) => {
//   const userData = {
//     FirstName: firstName,
//     LastName: lastName,
//     EmailAddress: email,
//     createdAt: new Date().toISOString(),
//   };

//   console.log("Attempting to write user data:", userData);

//   try {
//     const userRef = doc(DB, "users", uid);
//     await setDoc(userRef, userData);
//     console.log("User document created successfully in Firestore!");
//     return true;
//   } catch (error) {
//     console.error("Error creating user document:", error.message);
//     errMsgs.textContent = 'Failed to save user data. Please try again.';
//     errMsgs.classList.add('error');
//     setTimeout(() => {
//       errMsgs.textContent = '';
//       errMsgs.classList.remove('error');
//     }, 3000);
//     throw error; // Rethrow to catch the error in registerUser
//   }
// };

// User registration

const registerUser = async () => {
  try {
    console.log("Starting user registration...");
    const userCredential  = await createUserWithEmailAndPassword(auth, emailEl.value, passwordEl.value);
    // Check if all required fields have values
    if (!emailEl.value || !passwordEl.value) {
      errMsgs.textContent = 'Please fill in all the fields.';
      errMsgs.classList.add('error');
      setTimeout(() => {
        errMsgs.textContent = '';
        errMsgs.classList.remove('error');
      }, 3000);
      throw new Error("Missing required user information");
    }

    // Call usersDetails to create user data in Firestore
    console.log("User registration complete!");
    window.location.href = "../dashboard/profile/settings.html";
  } catch (error) {
    console.error("Error in registration process:", error);
    errMsgs.textContent = error.message || 'Registration failed. Please try again.';
    errMsgs.classList.add('error');
    setTimeout(() => {
      errMsgs.textContent = '';
      errMsgs.classList.remove('error');
    }, 3000);
  }
};

signupEl.addEventListener('click', () => {
  if (emailEl.value === '' || passwordEl.value === '') {
    errMsgs.textContent = 'Please fill all details to sign up ';
    errMsgs.classList.add('error');

    setTimeout(() => {
      errMsgs.textContent = '';
      errMsgs.classList.remove('error');
    }, 3000);
    return;
  } else {
    signupEl.disabled = true; // Disable button to prevent multiple clicks
    registerUser().finally(() => {
      signupEl.disabled = false; // Re-enable button after registration attempt
    });
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Authenticated user:", user);
    window.location.href = '../dashboard/profile/settings.html';
  } else {
    console.log('You are not currently a user yet');
  }
});
