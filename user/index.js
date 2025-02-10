import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
// named export, ddfault export
 // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  
  // Your web app's Firebase configuration
  const firebaseConfiguration = {
    apiKey: "AIzaSyDtYLeRUREXO20_46wl0dyt3JtgHQUrlOg",
    authDomain: "blog-8d884.firebaseapp.com",
    projectId: "blog-8d884",
    storageBucket: "blog-8d884.firebasestorage.app",
    messagingSenderId: "1063843610606",
    appId: "1:1063843610606:web:9b31fcc0f3dc52476d58ff"
  };

  export const app = initializeApp(firebaseConfiguration)
  const auth = getAuth(app)
 export const emailEl = document.getElementById('emailInp');
  export const passwordEl = document.getElementById('passInp');


  console.log(auth);


 


