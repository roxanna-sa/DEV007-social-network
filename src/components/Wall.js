//muro personal
export const Wall = (onNavigate) => {
    const WallDiv = document.createElement('div');

    console.log('localStorageUsuario', localStorage.getItem("usuario"));

    /* Cuando en localStorate["Usuario"] revisamos en firebase que esa id exista y traemos los datos del usuario, mostrandole el timeline  */
    if (localStorage.getItem("usuario") != undefined){
        const objUsuario = JSON.parse(localStorage["usuario"]);
        // Verificar con firebase...

        // Si no es válido eliminar todo localStorage con localStorage.clear() y enviar de nuevo a la misma página.npm s

        const texto = document.createElement('p');
        texto.textContent = 'Hola soy home/wall, bienvenid@ ' + objUsuario.email;

        WallDiv.appendChild(texto);
    } else {
        /* El usuario NO está logueado, por lo tanto sólo ve una página estática en la que le decimos que se registre o inicie sesión */
        const texto = document.createElement('p');
        texto.textContent = 'Hola soy home, no estás loguead@';
        const botonInicio = document.createElement('button');
        botonInicio.textContent = 'Inicio';
        const botonRegistro = document.createElement('button');
        botonRegistro.textContent = 'Register';

        WallDiv.appendChild(texto);
        WallDiv.appendChild(botonInicio);
        WallDiv.appendChild(botonRegistro);

        botonInicio.addEventListener('click', ()=> {onNavigate('/')});
        botonRegistro.addEventListener('click', ()=> {onNavigate('/register')});
    }
    // TO DO inputs de email y password
    return WallDiv;
    
  
   
  }
  