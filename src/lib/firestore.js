import {
  addDoc,
  collection,
  getDocs,
  doc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from '../firebase';


export const createPost = async (text, files) => { // files viene del input type file
  // Create post / newPost is the reference to the post in DB
  const newPost = await addDoc(collection(db, 'posts'), {
    postContent: text,
    user: auth.currentUser.email,
    userName: auth.currentUser.displayName,
    timestamp: serverTimestamp(),
  });

  const photosPublicURL = [];

 
  // Upload files if any
  /* eslint-disable */
  for (const file of Array.from(files)) {
    const imageRef = ref(storage, `images/${newPost.id}/${file.name}`);

    // 'file' comes from the Blob or File API
    await uploadBytes(imageRef, file);// sube los bytes de la imagen

    // Get download URL
    const downloadURL = await getDownloadURL(imageRef);
    photosPublicURL.push(downloadURL);
  }
  /* eslint-enable */

  // Updates photos in post.
  await updateDoc(newPost, { //Actualizar un doc que ya existe en Firebase
    photos: photosPublicURL, // <- que url publica tiene la foto?
  }).then((res) => {
    console.log(res);
  });

  console.log('createPost....', newPost.path);
  console.log('newPost: ', newPost);
};

export const addLike = async (postId) => {
  const postRef = doc(db, 'posts', postId);
  const userRef = doc(db, 'users', auth.currentUser.uid);

  try {
    await updateDoc(postRef, {
      likedBy: arrayUnion(userRef),
    });
    console.log('Like added successfully');
  } catch (error) {
    console.error('Failed to add like:', error);
    throw error;
  }
};

export const removeLike = async (postId) => {
  const postRef = doc(db, 'posts', postId); // Reference to /posts
  const userRef = doc(db, 'users', auth.currentUser.uid); // Reference to /users

  // actualiza el like en el post
  updateDoc(postRef, {
    likedBy: arrayRemove(userRef), // <- de quién es el like?
  }).then((res) => {
    console.log(res);
  });
};

export const getPosts = () => {
  const postRef = collection(db, 'posts');
  const q = query(postRef, orderBy('timestamp', 'desc'));
  return getDocs(q).then((res) => {
    const postsArray = [];
    console.log("res", res);
    res.forEach((doc) => { // res es el querySnapshot
      /* creamos un objeto data que tendrá el contenido y le agregamos
      por nuestra parte la ID que NO viene dentro de doc.data() */
      const data = doc.data();
      data['id'] = doc.id;
      postsArray.push(data);
      return doc.data();
    });
    // console.log(postsArray);
    return postsArray;
  });
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));

  // TODO: Eliminar las imagenes relacionadas al post del Storage
};

export const editPost = async (postId, editInput) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    postContent: editInput,
  });
};
