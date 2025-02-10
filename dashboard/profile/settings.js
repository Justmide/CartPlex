import { app } from "../../user/index.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; 

const DB = getFirestore(app);
const auth = getAuth(app);
console.log(auth);
console.log(DB);

const personalSec = document.getElementById('profileSettings');
const shippingSec = document.getElementById('shippingAddress');
const personalDetails = document.getElementById('personalRightDetails');
const shippingEL = document.getElementById('shippingSec');
export const firstName = document.getElementById('firstName');
export const lastName = document.getElementById('lastName');
export const phone = document.getElementById('phone');
const gender = document.getElementById('gender');
export const country = document.getElementById('country');
const state = document.getElementById('state');
const updateProfile = document.getElementById('updateProfile');
const errMsgs = document.getElementById('errMsgs'); 
export const emailDisplay = document.getElementById('emailDisplay')

if (personalSec && shippingSec && personalDetails && shippingEL && firstName && lastName && country && state && updateProfile && errMsgs && emailDisplay  ) {
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Authenticated user:', user);

    const fetchProfileDetails = async () => {
      try {
        console.log('Fetching user profile');
        const userId = user.uid;
        emailDisplay.textContent = user.email;
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(DB, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          firstName.value = userData.FirstName || '';
          lastName.value = userData.LastName || '';
          phone.value = userData.phone || '';
          const genderRadio = document.querySelector(`input[name="gender"][value="${userData.gender || ''}"]`);
          if (genderRadio) {
            genderRadio.checked = true;
          }
          country.textContent = 'Nigeria';
          state.value = userData.state || '';
          
          if (userData.FirstName) 
            firstName.disabled = true;
          if (userData.LastName) 
            lastName.disabled = true;
          if (userData.gender && genderRadio) 
            genderRadio.disabled = true;
          if (userData.phone) 
            phone.disabled = true;

        } else {
          // Create a new user document if it doesn't exist
          await setDoc(doc(DB, 'users', userId), {
            FirstName: firstName.value || '',
            LastName: lastName.value || '',
            phone: phone.value || '',
            createdAt: new Date()
          });
          console.log('New user profile created');
        }
      } catch (error) {
        console.error('Error fetching or creating user profile:', error);
      }
    };

    fetchProfileDetails();
  } else {
    console.log('No authenticated user. Redirecting to login.');
    window.location.href = '../../user/signup.html';
  }
});

// Update profile functionality
updateProfile.addEventListener('click', async () => {
  const selectedGender = document.querySelector('input[name="gender"]:checked');
  const selectedState = state.value

  if (!firstName.value || !lastName.value || !phone.value || !selectedGender || !selectedState) {
    // errMsgs.textContent = 'Please fill in all the fields.';
    errMsgs.classList.add('error');
    setTimeout(() => {
      errMsgs.textContent = '';
      errMsgs.classList.remove('error');
    }, 3000);
    return; // Exit if fields are missing
  }
  const genderValue = selectedGender.value;
  try {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      // Prepare data, ensuring no field is undefined
      const profileData = {
        FirstName: firstName.value || '',
        LastName: lastName.value || '',
        phone: phone.value || '',
        gender: genderValue|| '',
        country: 'Nigeria',
        state: selectedState || '',
        updatedAt: new Date(),
      };

      // Update user document in Firestore
      await setDoc(doc(DB, 'users', userId), profileData, { merge: true });
      console.log(); 
      errMsgs.textContent = 'Profile updated successfully'
      window.location.href = '../../dashboard/dashboard.html';  
    } else {
      console.log('No authenticated user found');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    errMsgs.textContent = error.message
  }
});
// Toggle between sections
shippingSec.addEventListener('click', () => {
  shippingEL.style.display = "block";
  personalDetails.style.display = "none";
});

personalSec.addEventListener("click", () => {
  personalDetails.style.display = "block";
  shippingEL.style.display = "none";
});




} else {
  console.warn("One or more required elements are not found in the DOM.");
}
