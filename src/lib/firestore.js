// aqui exportaras las funciones que necesites

import { addDoc, collection } from "firebase/firestore"
import { auth, db } from "../firebase"

export const createPost = (text) => {
  return addDoc(collection(db, 'posts'), {
    postContent: text,
    user: auth.currentUser.email
  });
};

export const getPosts = () => {
  return getDocs(collection(db, 'posts'));
};