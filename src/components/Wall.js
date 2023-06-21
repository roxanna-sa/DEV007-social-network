import { auth } from "../firebase";
import { logOut } from "../lib/auth";
import { createPost, getPosts } from "../lib/firestore";
//muro personal
export const Wall = (onNavigate) => {
  const WallDiv = document.createElement('div');
  WallDiv.className = 'wall-div';

  const getUser = localStorage.getItem('user');
  console.log("Obteniendo el usuario en local storage..", localStorage.getItem('user'));

  if (getUser) {
    // Verificar con firebase...
    // Si no es válido eliminar todo localStorage con localStorage.clear() y enviar de nuevo a la misma página.npm s
    const userNameLogged = document.createElement('p');
    userNameLogged.textContent = localStorage.getItem('name');

    const divUserAndSearch = document.createElement('div');
    divUserAndSearch.className = 'divUserAndSearch';
    divUserAndSearch.innerHTML = `
    <img src='../img/user.png' class='userAccount'>
    <input placeholder="Buscar" type="search" class="searchInput">
    <p id='userNameLogged' class='userNameLogged'>${userNameLogged.textContent}</p>
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

    let publishButton = publishPostInputAndButton.lastElementChild; //DOM traverse
    //console.log(publishButton);
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
      //console.log('borrando el input');
      document.getElementById("postInput").value = '';
    };
    //Muestra todos los posts ya guardados en firestore
    async function showAllPosts() {
      let arrayPosts = await getAllPosts();
      divPost.innerHTML = '';
      arrayPosts.forEach(post => {
        const singlePost = document.createElement('div');

        singlePost.innerHTML = `
        <div class="userName">${post.userName}<button><img src='../img/menu.png'class='menuPost'></button></div>
        
        <p>${post.postContent}</p>
        <button class="likeButton"><img src='../img/like.png'class='iconLike'></button>
        `;

        divPost.appendChild(singlePost);
      });
    }

    showAllPosts();

    const logOutButton = document.createElement('button');
    logOutButton.className = 'logout-button';
    logOutButton.id = 'logout-button';
    logOutButton.textContent = 'Cerrar sesión';

    // const logOutButton = document.getElementById('logout-button');
    console.log(logOutButton);
    logOutButton.addEventListener('click', () => {
      logOut();
      onNavigate('/');
    });

    if (window.location.pathname === '/wall') {
      console.log(getUser);

      const header = document.getElementById('logo');
      console.log(header);
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
  // TO DO inputs de email y password
  return WallDiv;
};

async function getAllPosts() {
  //console.log(await getPosts());
  return await getPosts();
};