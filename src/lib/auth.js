import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  // updateProfile,
} from 'firebase/auth';
import { app } from '../firebase.js';

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
/* eslint-disable-next-line */
export const createUser = (userMail, userPass, displayName) => createUserWithEmailAndPassword(auth, userMail, userPass)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user);
    sendEmailVerification(user);
    // Prueba: Actualizar usuario con nombre de usuario
    // updateProfile(getAuth().currentUser, {
    //   displayName,
    // });

    return user;

    /* Guardamos el id de usuario en localStorage y tal vez
    traemos los datos del usuario desde firebase.
    Como por ej el nombre (y si alcanzamos) la imágen para dejarla
    también en localStorage y poder mostrarla en las otras pantallas. */
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    // ..
  });

// INGRESAR CON USUARIO EXISTENTE
export const signIn = (userMail, userPass) => signInWithEmailAndPassword(auth, userMail, userPass);

// SignIn with Google
export const signInGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

// get logged in user
/* eslint-disable-next-line */
export const getLoggedUser = () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('inside getLoggedUser', user.email);
        resolve(user.email);
      } else {
        console.log('no user');
        resolve(null);
      }
    }, (error) => {
      console.log(error);
      reject(error);
    });
  });
};

export const logOut = () => {
  localStorage.clear();
  localStorage.removeItem('user');
  signOut(auth);
};
