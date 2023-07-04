import { auth } from "../firebase";
import { getLoggedUser, logOut } from "../lib/auth";
import { createPost, getPosts, addLike, deletePost, removeLike, editPost } from "../lib/firestore";
//muro personal
export const Wall = (onNavigate) => {
  const WallDiv = document.createElement('div');
  WallDiv.className = 'wall-div';

  // Agregar el div del modal al final del wall-div
  const modal = document.createElement('div');
  modal.id = 'modal';
  modal.className = 'modalEdit';

  // Contenido del modal
  const modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modalContent.className = 'modal-content'

  modal.appendChild(modalContent);
  WallDiv.appendChild(modal);

  //const getUser = localStorage.getItem('user');

  getLoggedUser()
    .then((user) => {
      console.log(user);
      if (user) {
        const userNameLogged = localStorage.getItem('name');

        const divUserAndSearch = document.createElement('div');
        divUserAndSearch.className = 'divUserAndSearch';
        divUserAndSearch.innerHTML = `
        <div>
          <img src='../img/user.png' class='userAccount'>
          <p>${userNameLogged}</p>
        </div>
        `;
       
        //Espacio para posts
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
        `

        //Menu 
        const divMenu = document.createElement('div');
        divMenu.className = 'divMenu';
        divMenu.innerHTML = `
      <button><img src='../img/home.png'></button>
      <button><img src='../img/add-post.png' class='postIcon' id='createPostButton'></button>
      <button><img src='../img/friends.png'></button>
      `;

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
        })

        let publishButton = document.getElementById('publishButton'); //DOM traverse
        publishButton.addEventListener('click', async () => {
          const inputText = postInput.value;
          modalPost.classList.remove('show-modal');

          if (inputText.trim() === '') {
            alert('Debes escribir algo para publicar...');
          } else {
            // Obtener archivos, si es que hay.
            const files = document.getElementById('fileToUpload').files;

            await createPost(inputText, files);
            showAllPosts();
            clearInput();
          }
        });

        function clearInput() {
          document.getElementById("postInput").value = '';
          document.getElementById("fileToUpload").value = '';
        };
        //Muestra todos los posts ya guardados en firestore
        async function showAllPosts() {
          let arrayPosts = await getAllPosts();
          divPost.innerHTML = ''; // está vacío porque al recargar necesitamos escribir todos los post de nuevo
          arrayPosts.forEach(post => {
            const singlePost = document.createElement('div');

            let imgUrl = '../img/like.png';
            let isLiked = ''; // Used to check if a post was liked, nothing else.

            if (post.likedBy !== undefined) {
              post.likedBy.forEach(like => {
                if (like.id === auth.currentUser.uid) {
                  imgUrl = '../img/likeRed.png';
                  isLiked = 'liked';
                }
              });
            }

            let images = "";
            
            if(post.photos !== undefined) {
              post.photos.forEach(photo => {
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

              const editPostButton = document.getElementById(`editPost-${post.id}`); // Mover esta línea fuera del bloque de MenuButton.addEventListener

              MenuButton.addEventListener('click', () => {
                clickCount++;

                const menuEditDelete = document.getElementById(`menu-${post.id}`);

                if (clickCount % 2 === 1) {
                  menuEditDelete.classList.add('show');
                  menuEditDelete.classList.remove('hidden');

                  //Delete post
                  let deletePostButton = document.getElementById(`deletePost-${post.id}`);
                  deletePostButton.addEventListener('click', async (event) => {
                    //TODO pedir confirmación para eliminar post
                    const postId = deletePostButton.getAttribute('data-postid');
                    await deletePostFromFirestore(postId);
                  });

                  //Edit post 
                  editPostButton.addEventListener('click', async (event) => { // Corregir el nombre del evento de clic
                    const postId = event.target.getAttribute('data-postid'); // Utilizar event.target en lugar de editPostButton
                    const postContent = post.postContent;

                    // Obtener el modal y el contenido del modal
                    const modal = document.getElementById('modal');
                    const modalContent = document.getElementById('modal-content');
                    // Limpiar el contenido anterior del modal
                    modalContent.innerHTML = '';

                    // Crear los elementos del modal
                    const editInput = document.createElement('textarea');
                    editInput.id = `editInput-${post.id}`;
                    editInput.value = postContent;
                    const editButton = document.createElement('button');
                    editInput.className = 'inputEdit'
                    editButton.className = 'edit-button';
                    editButton.textContent = 'Terminar'
                    editButton.id = `editButton-${post.id}`;

                    // Agregar los elementos al contenido del modal
                    modalContent.appendChild(editInput);
                    modalContent.appendChild(editButton);

                    // Mostrar el modal
                    modal.style.display = 'block';

                    editButton.addEventListener('click', async () => {
                      await editPostFirestore(postId, editInput.value);

                      // Ocultar el modal después de editar el post
                      hideModal();
                    });
                  });

                  function showModal() {
                    const modal = document.getElementById('modal');
                    modal.style.display = 'block';
                  }

                  function hideModal() {
                    const modal = document.getElementById('modal');
                    modal.style.display = 'none';
                  }

                } else {
                  menuEditDelete.classList.add('hidden');
                  menuEditDelete.classList.remove('show');
                };
              });
            };
          });

          //Close modal (create) window clicking outside target
          modalPost.addEventListener('click', (event) => {
            if (event.target == modalPost) {
              modalPost.classList.remove('show-modal');
              clearInput();
            }
          });

          // Add event listener to every like button
          Array.from(document.getElementsByClassName("likeButton")).forEach((el) => { //el= elemento
            el.addEventListener('click', async (clickedElement) => {
              const currentTarget = clickedElement.currentTarget;
              const clickedElementId = currentTarget.id;
              const currentLikesIMG = currentTarget.children[0];
              const currentLikesP = currentTarget.children[1];
              // Check if post is already liked
              const wasLiked = currentTarget.classList.contains('liked');

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
            })
          });
        }

        showAllPosts();

        async function deletePostFromFirestore(postId) {
          try {
            await deletePost(postId);
            await showAllPosts(); // aquí listamos nuevamente el registro de todos los posts existentes
          } catch (error) {
            console.error(error);
          }
        };

        async function editPostFirestore(postId, editInput) {
          try {
            await editPost(postId, editInput);
            await showAllPosts();
          } catch (error) {
            console.error(error);
          }
        };

        const logOutButton = document.createElement('button');
        logOutButton.className = 'logout-button';
        logOutButton.id = 'logout-button';
        logOutButton.textContent = 'Cerrar sesión';

        // const logOutButton = document.getElementById('logout-button');
        logOutButton.addEventListener('click', () => {
          logOut();
          onNavigate('/');
        });

        if (window.location.pathname === '/wall') {

          const header = document.getElementById('logo');
          header.appendChild(logOutButton);
        };

      } else {
        const notLoggedUser = document.createElement('div')
        notLoggedUser.innerHTML = `
        <h2> Bienvenido a Nutrivid, inicia sesión o regístrate </h2>
        <div class='buttons-div'>
          <button id='logInButton'>Inicio</button>
          <button id='registerButton'>Registrar</button>
        </div>
      `;
        WallDiv.appendChild(notLoggedUser);
        document.getElementById('logInButton').addEventListener('click', () => { onNavigate('/') });
        document.getElementById('registerButton').addEventListener('click', () => { onNavigate('/register') })
        
      };

    }).catch((error) => {
      console.log('error:', error);
      return null;
    });


  return WallDiv;
};

async function getAllPosts() {
  //console.log(await getPosts());
  return await getPosts();
};