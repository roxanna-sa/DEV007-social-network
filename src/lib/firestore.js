// aqui exportaras las funciones que necesites

import { addDoc, collection, getDocs, doc, deleteDoc , serverTimestamp, query, orderBy} from "firebase/firestore"
import { auth, db } from "../firebase"

export const createPost = async (text) => {
  const newPost = await addDoc(collection(db, 'posts'), {
    postContent: text,
    user: auth.currentUser.email,
    userName: auth.currentUser.displayName,
    timestamp: serverTimestamp(),
  });
  console.log('createPost....', newPost.path);
};


export const getPosts = () => {
  const postRef = collection(db, 'posts');
  const q = query(postRef, orderBy("timestamp", "desc"));
  return getDocs(q).then((res) => {
    let postsArray = [];
    res.forEach((doc) => {
      //console.log(doc.data().user);
      postsArray.push(doc.data());
      return doc.data();
    })

    return postsArray;
  })
};


export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));