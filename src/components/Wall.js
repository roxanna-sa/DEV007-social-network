import { auth } from '../firebase.js';
import { getLoggedUser, logOut } from '../lib/auth.js';
import {
  createPost,
  getPosts,
  addLike,
  deletePost,
  removeLike,
  editPost,
} from '../lib/firestore.js';

// muro personal
export const Wall = (onNavigate) => {
  const WallDiv = document.createElement('div');
  WallDiv.className = 'wall-div';

  // Modal para editar
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.className = 'modalEdit';

  // Contenido del modal
  const modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modalContent.className = 'modal-content';

  modal.appendChild(modalContent);
  WallDiv.appendChild(modal);

  function clearInput() {
    document.getElementById('postInput').value = '';
    document.getElementById('fileToUpload').value = '';
  }

  // const getUser = localStorage.getItem('user');

  getLoggedUser()
    .then((user) => {
      console.log(user);
      if (user) {

        // Header
        const header = document.createElement('header');
        header.classList.add('logo');
        header.id = 'logo';

        const headerImage = document.createElement('img');
        headerImage.src = './img/logoNutriVid.png';
        header.appendChild(headerImage);

        const headerLogOut = document.createElement('button');
        headerLogOut.id = 'logout-buton';
        headerLogOut.innerHTML = 'Cerrar sesión';
        headerLogOut.classList.add('logout-button');
        header.appendChild(headerLogOut);
        

        const userNameLogged = localStorage.getItem('name');

        const divUserAndSearch = document.createElement('div');
        divUserAndSearch.className = 'divUserAndSearch';
        divUserAndSearch.innerHTML = `
        <div>
          <img src='../img/user.png' class='userAccount'>
          <p>${userNameLogged}</p>
        </div>
        `;

        // Espacio para posts
        const divPost = document.createElement('div');
        divPost.className = 'divPost';

        const modalPost = document.createElement('div');
        modalPost.className = 'modal-post';
        modalPost.id = 'modal-post';
        modalPost.innerHTML = `
        <div class='modal-content'>
          <textarea class='postInput ph-center' id='postInput' placeholder= "¿Qué cocinas hoy?"></textarea>
          <div class='modal-btns'>
          <input class='upload-file' type="file" id="fileToUpload" accept="image/*" multiple  />
          <button class='publishButton' id='publishButton'>Publicar</button>
          </div>
        </div>
        `;

        // Menu
        const divMenu = document.createElement('div');
        divMenu.className = 'divMenu';
        divMenu.innerHTML = `
      <button><img src='../img/home.png'></button>
      <button><img src='../img/add-post.png' class='postIcon' id='createPostButton'></button>
      <button><img src='../img/friends.png'></button>
      `;

        WallDiv.appendChild(header);
        WallDiv.appendChild(divUserAndSearch);
        // WallDiv.appendChild(publishPostInputAndButton);
        WallDiv.appendChild(divPost);
        WallDiv.appendChild(modalPost);
        WallDiv.appendChild(divMenu);

        // let currentUserEmail = getLoggedUser();
        // console.log('currentUserEmail', currentUserEmail);

        const createPostButton = document.getElementById('createPostButton');
        createPostButton.addEventListener('click', () => {
          modalPost.classList.add('show-modal');
        });

        const publishButton = document.getElementById('publishButton'); // DOM traverse
        publishButton.addEventListener('click', async () => {
          // eslint-disable-next-line
          const inputText = postInput.value;
          modalPost.classList.remove('show-modal');

          if (inputText.trim() === '') {
            alert('Debes escribir algo para publicar...');
          } else {
            // Obtener archivos, si es que hay.
            const files = document.getElementById('fileToUpload').files;

            await createPost(inputText, files);
            /* eslint-disable */
            showAllPosts();
            clearInput();
            /* eslint-enable */
          }
        });
        /* eslint-disable */
        async function deletePostFromFirestore(postId) {
          try {
            await deletePost(postId);
            // aquí listamos nuevamente el registro de todos los posts existentes
            // eslint-disable-next-line
            await showAllPosts();
          } catch (error) {
            console.error(error);
          }
        }

        async function editPostFirestore(postId, editInput) {
          try {
            await editPost(postId, editInput);
            // eslint-disable-next-line
            await showAllPosts();
          } catch (error) {
            console.error(error);
          }
        }
        /* eslint-enable */

        // Muestra todos los posts ya guardados en firestore
        // eslint-disable-next-line
        async function showAllPosts() {
          const arrayPosts = await getPosts();
          divPost.innerHTML = ''; // está vacío porque al recargar necesitamos escribir todos los post de nuevo
          arrayPosts.forEach((post) => {
            const singlePost = document.createElement('div');
            let imgUrl = '../img/like.png';
            let isLiked = ''; // Used to check if a post was liked, nothing else.

            if (post.likedBy !== undefined) { // el post tiene likes?
              post.likedBy.forEach((like) => {
                if (like.id === auth.currentUser.uid) {
                  imgUrl = '../img/likeRed.png';  
                  isLiked = 'liked';  // dale el valor like
                }
              });
            }

            let images = '';

            if (post.photos !== undefined) { //Array de URL pública con la cantidad de fotos subidas
              post.photos.forEach((photo) => {
                images += `<img src='${photo}' class="postPhoto" />`;
              });
            }

            singlePost.innerHTML = `
          <div class="userName">${post.userName}
          <button id="menuPost-${post.id}" class='hidden'><img src='../img/menu.png' class='menuPost' >
            <ul class="menu hidden" id='menu-${post.id}'>
              <li id='editPost-${post.id}' data-postid="${post.id}">Editar</li>
                <hr></hr>
              <li id='deletePost-${post.id}' data-postid="${post.id}">Eliminar</li> 
            </ul>
          </button>
          </div>
          
          <p class= 'postContent'>${post.postContent}</p>
          ${images}                                                                  
          <button id="${post.id}" class="likeButton ${isLiked}"><img src='${imgUrl}'class='iconLike'><p class="likedAmmount">${post.likedBy != null ? post.likedBy.length : 0}</p></button>
          `;

            divPost.appendChild(singlePost);

            if (user === post.user) {
              console.log('user verified');
              const MenuButton = document.getElementById(`menuPost-${post.id}`);
              MenuButton.classList.add('show-menu');
              MenuButton.classList.remove('hidden');

              let clickCount = 0;

              const editPostButton = document.getElementById(`editPost-${post.id}`);

              MenuButton.addEventListener('click', () => {
                // eslint-disable-next-line
                clickCount++;

                const menuEditDelete = document.getElementById(`menu-${post.id}`); // la id se reemplaza por la del post.

                if (clickCount % 2 === 1) { // si es impar
                  menuEditDelete.classList.add('show');
                  menuEditDelete.classList.remove('hidden');

                  // Delete post
                  const deletePostButton = document.getElementById(`deletePost-${post.id}`);
                  deletePostButton.addEventListener('click', (event) => {
                    const postId = event.target.getAttribute('data-postid'); // data-algo lee un atributo creado

                    // Check if deletePostModal already exists
                    let deletePostModal = document.getElementById('delete-post-modal-container');
                    if (!deletePostModal) {
                      // Create the deletePostModal if it doesn't exist
                      deletePostModal = document.createElement('div');
                      deletePostModal.id = 'delete-post-modal-container';
                      deletePostModal.className = 'delete-post-modal-container';
                      deletePostModal.innerHTML = `
                      <div class="delete-modal-content" id='delete-modal-content'>
                        <p>¿Deseas eliminar el post?</p>
                        <div class='modal-btns'>
                            <button id="cancel-delete">Cancelar</button>
                            <button id="accept-button">Aceptar</button>
                        </div>
                      </div>
                      `;

                      WallDiv.appendChild(deletePostModal);
                    }

                    deletePostModal.classList.add('show-modal');

                    // TO DO arreglar modal para eliminar
                    const acceptDelete = document.getElementById('accept-button');
                    acceptDelete.addEventListener('click', async () => {
                      await deletePostFromFirestore(postId);
                      await showAllPosts();
                      deletePostModal.classList.add('hidden');
                    });

                    const cancelDelete = document.getElementById('cancel-delete');
                    cancelDelete.addEventListener('click', async () => {
                      deletePostModal.classList.add('hidden');
                    });
                  });

                  // Edit post
                  editPostButton.addEventListener('click', async (event) => { // Corregir el nombre del evento de clic
                    const postId = event.target.getAttribute('data-postid'); // Utilizar event.target en lugar de editPostButton
                    const postContent = post.postContent;

                    // Obtener el modal y el contenido del modal
                    /* eslint-disable */
                    const modal = document.getElementById('modal');
                    const modalContent = document.getElementById('modal-content');
                    // Limpiar el contenido anterior del modal
                    modalContent.innerHTML = '';
                    /* eslint-enable */

                    // Crear los elementos del modal
                    const editInput = document.createElement('textarea');
                    editInput.id = `editInput-${post.id}`;
                    editInput.value = postContent;
                    const editButton = document.createElement('button');
                    editInput.className = 'inputEdit';
                    editButton.className = 'edit-button';
                    editButton.textContent = 'Terminar';
                    editButton.id = `editButton-${post.id}`;

                    // Agregar los elementos al contenido del modal
                    modalContent.appendChild(editInput);
                    modalContent.appendChild(editButton);

                    // Mostrar el modal
                    modal.style.display = 'block';

                    editButton.addEventListener('click', async () => {
                      await editPostFirestore(postId, editInput.value);

                      // Ocultar el modal después de editar el post
                      // eslint-disable-next-line
                      hideModal();
                    });
                  });
                  /* eslint-disable */
                  function hideModal() {
                    const modal = document.getElementById('modal');
                    modal.style.display = 'none';
                  }
                  /* eslint-enable */
                } else {
                  menuEditDelete.classList.add('hidden');
                  menuEditDelete.classList.remove('show');
                }
              });
            }
          });

          // Close modal (create) window clicking outside target
          modalPost.addEventListener('click', (event) => {
            if (event.target === modalPost) {
              modalPost.classList.remove('show-modal');
              clearInput();
            }
          });

          // Add event listener to every like button
          Array.from(document.getElementsByClassName('likeButton')).forEach((el) => { // el= elemento
            el.addEventListener('click', async (clickedElement) => {
              const currentTarget = clickedElement.currentTarget;
              const clickedElementId = currentTarget.id;
              const currentLikesIMG = currentTarget.children[0]; // IMG
              const currentLikesP = currentTarget.children[1]; // Parrafo
              // Check if post is already liked
              const wasLiked = currentTarget.classList.contains('liked'); // devuelve si es que tiene la clase liked o no

              /* eslint-disable */
              if (wasLiked) {
                // remove like, count -1
                currentLikesP.innerHTML = parseInt(currentLikesP.innerHTML) - 1;
                currentTarget.classList.remove('liked');
                // Remove filled heart
                currentLikesIMG.src = '../img/like.png';
                await removeLike(clickedElementId);
              } else {
                currentLikesP.innerHTML = parseInt(currentLikesP.innerHTML) + 1;
                currentTarget.classList.add('liked');
                // Add filled heart
                currentLikesIMG.src = '../img/likeRed.png';
                await addLike(clickedElementId);
              }
              /* eslint-enable */
            });
          });
        }

        showAllPosts();

        // const logOutButton = document.getElementById('logout-button');
        headerLogOut.addEventListener('click', () => {
          logOut();
          onNavigate('/');
        });
      } else {
        const notLoggedUser = document.createElement('div');
        notLoggedUser.innerHTML = `
        <h2> Bienvenido a Nutrivid, inicia sesión o regístrate </h2>
        <div class='buttons-div'>
          <button id='logInButton'>Inicio</button>
          <button id='registerButton'>Registrar</button>
        </div>
      `;
        WallDiv.appendChild(notLoggedUser);
        document.getElementById('logInButton').addEventListener('click', () => {
          onNavigate('/');
        });
        document.getElementById('registerButton').addEventListener('click', () => {
          onNavigate('/register');
        });
      }
    }).catch((error) => {
      console.log('error:', error);
      return null;
    });

  return WallDiv;
};
