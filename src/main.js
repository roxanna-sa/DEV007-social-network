// Este es el punto de entrada de tu aplicacion
import { Login } from './components/Login.js';
import { Register } from './components/Register.js';
import { Wall } from './components/Wall.js';

const rootDiv = document.getElementById('root');
let routes = {};

export const onNavigate = (pathname) => { // onNavigate toma ruta como arg.
  window.history.pushState( // cambia la ruta en la barra de direcciones del nav.
    {},
    pathname,
    window.location.origin + pathname,
  );

  while (rootDiv.firstChild) { //ELiminar todos los hijos de rootDiv en ciclo
    rootDiv.removeChild(rootDiv.firstChild); 
  }

  rootDiv.appendChild(routes[pathname](onNavigate)); // llama a la ruta y lo ejecuta con el arg onNavigate

};

routes = {
  '/': Login,
  '/register': Register,
  '/wall': Wall,
  // '/profile': Profile(onNavigate),
  // '/404': NotFound(onNavigate)
};

// Obtener el componente correspondiente a la ruta actual cuando entro al sitio (llamada inicial para que cargue la vista en la que user entró)
const component = routes[window.location.pathname]; // este pathname es propiedad de la ventana del navegador

window.onpopstate = () => { // Evento triggereado al cuando se realiza un retroceso en el sitio
  while (rootDiv.firstChild) { // Remover todos los hijos del elemento raíz
    rootDiv.removeChild(rootDiv.firstChild);
  }
  // Agregar el componente correspondiente a la nueva ruta 
  rootDiv.append(component(onNavigate));
};

// Llamadas al entrar al sitio.
rootDiv.appendChild(component(onNavigate)); 
