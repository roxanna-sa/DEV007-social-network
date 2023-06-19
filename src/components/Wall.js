import { logOut } from "../lib/auth";
import { createPost, getPosts } from "../lib/firestore";
//muro personal
export const Wall = (onNavigate) => {
  const WallDiv = document.createElement('div');
  WallDiv.className = 'wall-div';

  const getUser = localStorage.getItem('user');
  //console.log("Obteniendo el usuario en local storage..", localStorage.getItem('user'));
  /* Cuando en localStorate["Usuario"] revisamos en firebase que esa id exista y traemos los datos del usuario, mostrandole el timeline  */
  if (getUser) {
    // Verificar con firebase...
    // Si no es válido eliminar todo localStorage con localStorage.clear() y enviar de nuevo a la misma página.npm s
    const divUserAndSearch = document.createElement('div');
    divUserAndSearch.className = 'divUserAndSearch';
    divUserAndSearch.innerHTML = `
    <img src='../img/user.png' class='userAccount'>
    <input placeholder="Buscar" type="search" class="searchInput">
    `

    // TODO añadir lupa a search input
    // const lupa = document.createElement('div');
    // lupa.className = 'lupa';
    // // lupa.src = '../img/lupa.png';

    const publishPostInputAndButton = document.createElement('div');
    publishPostInputAndButton.className = 'publishPostInputAndButton'
    publishPostInputAndButton.innerHTML = `
    <input class='postInput' id='postInput'></input>
    <button class='publishButton' id='publishButton'>Publicar</button>
    `;
    //Espacio para posts
    const divPost = document.createElement('div');
    divPost.className = 'divPost';

    document.addEventListener('DOMContentLoaded', () => {
      let publishButton = document.getElementById('publishButton');

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
      }
    });

    //Muestra todos los posts ya guardados en firestore
    async function showAllPosts() {
      let arrayPosts = await getAllPosts();
      divPost.innerHTML = '';
      arrayPosts.forEach(post => {
        const singlePost = document.createElement('div');

        singlePost.innerHTML = `
        <div class="userName">${post.userName}<button><img src='../img/menu.png'class='menuPost'></button></div>
        
        <p>${post.postContent}</p>
        `;

        divPost.appendChild(singlePost);
      });
    }

    showAllPosts();

    //Menu 
    const divMenu = document.createElement('div');
    divMenu.className = 'divMenu';

    divMenu.innerHTML = `
    <button><img src='../img/home.png'></button>
    <button><img src='../img/add-post.png' class='postIcon'></button>
    <button><img src='../img/friends.png'></button>
    `

    const logOutButton = document.createElement('div');
    logOutButton.innerHTML = `<button class='logout-button'>Cerrar sesión</button>`
    logOutButton.addEventListener('click', () => {
      logOut();
      onNavigate('/');
    });

    WallDiv.appendChild(divUserAndSearch);
    WallDiv.appendChild(publishPostInputAndButton);
    WallDiv.appendChild(divPost);
    WallDiv.appendChild(divMenu);
    WallDiv.appendChild(logOutButton);

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