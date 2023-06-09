// Muro principal

export const Home = (onNavigate) => {

    const HomeDiv = document.createElement('div');

    /* Cuando en localStorate["Usuario"] revisamos en firebase que esa id exista y traemos los datos del usuario, mostrandole el timeline  */
    if (localStorage["usuario"] != undefined){
        // Verificar con firebase...

        // Si no es válido eliminar todo localStorage con localStorage.clear() y enviar de nuevo a la misma página.npm s

        const texto = document.createElement('p');
        texto.textContent = 'Hola soy home, bienvenid@ ' + localStorage["usuario"];

        HomeDiv.appendChild(texto);
    }else{
        /* El usuario NO está logueado, por lo tanto sólo ve una página estática en la qu le decimos que se registre o inicie sesión */
        const texto = document.createElement('p');
        texto.textContent = 'Hola soy home, no estás loguead@';
        const botonInicio = document.createElement('button');
        botonInicio.textContent = 'Inicio';
        const botonRegistro = document.createElement('button');
        botonRegistro.textContent = 'Register';

        HomeDiv.appendChild(texto);
        HomeDiv.appendChild(botonInicio);
        HomeDiv.appendChild(botonRegistro);

        botonInicio.addEventListener('click', ()=> {onNavigate('/login')});
        botonRegistro.addEventListener('click', ()=> {onNavigate('/register')});
    }
    // TO DO inputs de email y password
    return HomeDiv;
}