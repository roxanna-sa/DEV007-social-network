import { auth } from "../firebase";
import { getLoggedUser, logOut } from "../lib/auth";
import { createPost, getPosts, addLike, deletePost, removeLike, editPost } from "../lib/firestore";
//muro personal
export const Wall = (onNavigate) => {
  const WallDiv = document.createElement('div');
  WallDiv.className = 'wall-div';

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
        <input placeholder="Buscar" type="search" class="searchInput">
        `;

        // TODO añadir lupa a search input
        // const lupa = document.createElement('div');
        // lupa.className = 'lupa';
        // // lupa.src = '../img/lupa.png';

        const publishPostInputAndButton = document.createElement('div');
        publishPostInputAndButton.className = 'publishPostInputAndButton'
        publishPostInputAndButton.innerHTML = `
      <input class='postInput' id='postInput' placeholder= "Crear Publicación"></input>
      <button class='publishButton' id='publishButton'>Publicar</button>
      `;
        //Espacio para posts
        const divPost = document.createElement('div');
        divPost.className = 'divPost';

        //Menu 
        const divMenu = document.createElement('div');
        divMenu.className = 'divMenu';
        divMenu.innerHTML = `
      <button><img src='../img/home.png'></button>
      <button><img src='../img/add-post.png' class='postIcon'></button>
      <button><img src='../img/friends.png'></button>
      `;

        WallDiv.appendChild(divUserAndSearch);
        WallDiv.appendChild(publishPostInputAndButton);
        WallDiv.appendChild(divPost);
        WallDiv.appendChild(divMenu);

        // let currentUserEmail = getLoggedUser();
        // console.log('currentUserEmail', currentUserEmail);

        let publishButton = publishPostInputAndButton.lastElementChild; //DOM traverse
        publishButton.addEventListener('click', async () => {
          const inputText = postInput.value;

          if (inputText.trim() === '') {
            alert('Debes escribir algo para publicar...');
          } else {
            await createPost(inputText);
            showAllPosts();
            clearInput();
          }
        });

        function clearInput() {
          document.getElementById("postInput").value = '';
        };
        //Muestra todos los posts ya guardados en firestore
        async function showAllPosts() {
          let arrayPosts = await getAllPosts();
          divPost.innerHTML = '';
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

            singlePost.innerHTML = `
          <div class="userName">${post.userName}<button id="menuPost-${post.id}" class='hidden'><img src='../img/menu.png' class='menuPost' >
          <ul class="menu hidden" id='menu-${post.id}'>
                <li id='editPost-${post.id}' data-postid="${post.id}">Editar</li>
                <hr></hr>
                <li id='deletePost-${post.id}' data-postid="${post.id}">Eliminar</li>
          </ul>
          </button>
          </div>
          
          <p>${post.postContent}</p>
          <button id="${post.id}" class="likeButton ${isLiked}"><img src='${imgUrl}'class='iconLike'><p class="likedAmmount">${post.likedBy != null ? post.likedBy.length : 0}</p></button>
          `;

            divPost.appendChild(singlePost);

            if (user === post.user) {
              console.log('user verified');
              const MenuButton = document.getElementById(`menuPost-${post.id}`);
              MenuButton.classList.add('show-menu');
              MenuButton.classList.remove('hidden');

              let clickCount = 0;

              MenuButton.addEventListener('click', () => {
                clickCount++;

                const menuEditDelete = document.getElementById(`menu-${post.id}`);
                if (clickCount % 2 === 1) {
                  menuEditDelete.classList.add('show');
                  menuEditDelete.classList.remove('hidden');
                  //Delete post
                  let deletePostButton = document.getElementById(`deletePost-${post.id}`);
                  deletePostButton.addEventListener('click', async (event) => {
                    const postId = deletePostButton.getAttribute('data-postid');
                    await deletePostFromFirestore(postId);
                  });

                  //Edit post 
                  let editPostButton = document.getElementById(`editPost-${post.id}`);
                  editPostButton.addEventListener('click', () => {
                    console.log('editar post');
                    const postId = editPostButton.getAttribute('data-postid');
                    const editInput = document.createElement('input');
                    editInput.id = `editInput-${post.id}`;
                    const editButton = document.createElement('button');
                    editButton.className = 'edit-button';
                    editButton.textContent = 'Terminar'
                    editButton.id = `editButton-${post.id}`;
                    singlePost.appendChild(editInput);
                    singlePost.appendChild(editButton);

                    editButton.addEventListener('click', async () => {
                      await editPostFirestore(postId, editInput.value);
                    });
                  });

                } else {
                  menuEditDelete.classList.add('hidden');
                  menuEditDelete.classList.remove('show');
                };
              });
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

        document.addEventListener('DOMContentLoaded', () => {
          document.getElementById('logInButton').addEventListener('click', () => { onNavigate('/') });
          document.getElementById('registerButton').addEventListener('click', () => { onNavigate('/register') });
        });
        WallDiv.appendChild(notLoggedUser);
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