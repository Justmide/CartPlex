import { app } from "../user/index.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const DB = getFirestore(app);
const auth = getAuth(app);
const displayUserName = document.getElementById('displayName');
const logoutEl = document.getElementById('logOut');
const logoutElMobile = document.getElementById('logOut2'); // For mobile
const cart_Check_Out = document.getElementById('cartLogo')
const cart_Logo_Res = document.getElementById('cartLogoRes')

if (!displayUserName || !logoutEl) {
  console.error('Required elements not found in DOM.');
}


const fetchUserName = async (userId) => {
  try {
    const userDoc = await getDoc(doc(DB, 'users', userId));
    if (userDoc.exists()) {
      const user = userDoc.data();
      const firstName = user.FirstName;
      displayUserName.textContent = `Hi, ${firstName}`;
      displayUserName.style.color = 'Red';
    } else {
      console.log('No user document found. Displaying guest.');
      displayUserName.textContent = 'Guest';
      displayUserName.style.color = 'Gray';
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log('Authenticated user:', user);
    displayUserName.textContent = 'Loading...'; 
    fetchUserName(user.uid);
  } else {
    console.log('No authenticated user. Redirecting to login.');
    window.location.href = '../user/signup.html'; 
  }
});

const signedOut = async () => {
  try {
    await signOut(auth);
    window.location.href = '../index.html'; 
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

if (logoutEl) {
  logoutEl.addEventListener('click', () => {
    signedOut();
  });
}

if (logoutElMobile) {
  logoutElMobile.addEventListener('click', () => {
    signedOut();
  });
}

if (cart_Check_Out) {
  cart_Check_Out.addEventListener('click', ()=>{
    
    if (window.location.href.includes('/profile/settings')) {
      window.location.href = 'cart/cart.html';
    } else {
      window.location.href = './profile/cart/cart.html';
    }
  })
}
if (cart_Logo_Res) {
  cart_Logo_Res.addEventListener('click', ()=>{
   
    if (window.location.href.includes('/profile/settings')) {
      window.location.href = '../cart/cart.html';
    } else {
      window.location.href = './profile/cart/cart.html';
    }
  })
}

