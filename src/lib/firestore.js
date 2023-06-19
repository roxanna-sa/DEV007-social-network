// aqui exportaras las funciones que necesites

import { addDoc, collection, getDocs, doc, deleteDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

export const createPost = async (text) => {
  const newPost = await addDoc(collection(db, 'posts'), {
    postContent: text,
    user: auth.currentUser.email,
  });
  console.log('createPost....', newPost.path);
};

// const post = doc(db, 'posts/post');
// export async function writePost(text) {
//   const postData = {
//     postContent: text,
//     user: auth.currentUser.email,
//     path: newPost.path
//   };
//     addDoc(post, postData).then((a) => {
//       console.log('writePost',a);
//     }).catch ((error) => {
//       console.log(error);
//     });

// };

// export const readPost = async () => {
//   const mySnapshot = await getDoc(post);
//   if (mySnapshot.exists()) {
//     const postData = mySnapshot.data();
//     console.log(JSON.stringify(postData));
//   };
// }

export const getPosts = () => {
  return getDocs(collection(db, 'posts')).then((res) => {
    let postsArray = [];
    let allPosts = res.forEach((doc) => {
      //console.log(doc.data());
      postsArray.push(doc.data());
      return doc.data();
    })
    //console.log(postsArray);
    return postsArray;
  })
};

export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));