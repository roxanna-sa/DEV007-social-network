// aqui exportaras las funciones que necesites

import { addDoc, collection, getDocs, doc, deleteDoc, serverTimestamp, query, orderBy, arrayUnion, updateDoc, arrayRemove } from "firebase/firestore"
import { auth, db, storage } from "../firebase"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const createPost = async (text, files) => {
  // Create post / newPost is the reference to the post in DB
  const newPost = await addDoc(collection(db, 'posts'), {
    postContent: text,
    user: auth.currentUser.email,
    userName: auth.currentUser.displayName,
    timestamp: serverTimestamp(),
  });

  const photosPublicURL = [];

  // Upload files if any
  for (const file of Array.from(files)) {
    const imageRef = ref(storage, `images/${newPost.id}/${file.name}`);

    // 'file' comes from the Blob or File API
    await uploadBytes(imageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(imageRef);
    photosPublicURL.push(downloadURL);
  }

  // Updates photos in post.
  await updateDoc(newPost, {
    photos: photosPublicURL, // <- que url publica tiene la foto?
  }).then((res) => {
    console.log(res);
  });

  console.log('createPost....', newPost.path);
  console.log('newPost: ', newPost);
};

export const addLike = async (postId) => {
  const postRef = doc(db, 'posts', postId); // Reference to /posts
  const userRef = doc(db, 'users', auth.currentUser.uid); // Reference to /users

  // actualiza el like en el post
  updateDoc(postRef, {
    likedBy: arrayUnion(userRef), // <- de quién es el like?
  }).then((res) => {
    console.log(res);
  });
}

export const removeLike = async (postId) => {
  const postRef = doc(db, 'posts', postId); // Reference to /posts
  const userRef = doc(db, 'users', auth.currentUser.uid); // Reference to /users

  // actualiza el like en el post
  updateDoc(postRef, {
    likedBy: arrayRemove(userRef), // <- de quién es el like?
  }).then((res) => {
    console.log(res);
  });
}

export const getPosts = () => {
  const postRef = collection(db, 'posts');
  const q = query(postRef, orderBy("timestamp", "desc"));
  return getDocs(q).then((res) => {
    let postsArray = [];
    res.forEach((doc) => {
      // creamos un objeto data que tendrá el contenido y le agregamos por nuestra parte la ID que NO viene dentro de doc.data()
      let data = doc.data();
      data["id"] = doc.id;
      postsArray.push(data);
      return doc.data();
    })
    // console.log(postsArray);
    return postsArray;
  })
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));

  // TODO: Eliminar las imagenes relacionadas al post del Storage
};

export const editPost = async (postId, editInput) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    postContent: editInput
  });

};