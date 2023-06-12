import { getAuth, createUserWithEmailAndPassword, sendEmailVerification} from "firebase/auth";
import {app} from "../firebase.js"

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export const createUser = (userMail, userPass) => createUserWithEmailAndPassword(auth, userMail, userPass)
.then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log(user);
    sendEmailVerification(user);

    // Prueba: Actualizar usuario con nombre de usuario 
    // updateProfile(getAuth().currentUser, {
    //     displayName: "TEST",
    // });

    // Guardamos el id de usuario en localStorage y tal vez traemos los datos del usuario desde firebase. 
    // Como por ej el nombre (y si alcanzamos) la imágen para dejarla también en localStorage y poder mostrarla en las otras pantallas.
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode,errorMessage);
    // ..
  });

