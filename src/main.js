// Este es el punto de entrada de tu aplicacion
import { Login } from './components/Login.js';
import { Register } from './components/Register.js';
import { Wall } from './components/Wall.js';

const rootDiv = document.getElementById('root');
let routes = {};

export const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname,
  );
  while (rootDiv.firstChild) {
    rootDiv.removeChild(rootDiv.firstChild); // ¿Por qué no son rootDiv?
  }

  rootDiv.appendChild(routes[pathname](onNavigate));
};

routes = {
  '/': Login,
  '/register': Register,
  '/wall': Wall,
  // '/profile': Profile(onNavigate),
  // '/404': NotFound(onNavigate)
};

// Obtener el componente correspondiente a la ruta actual
const component = routes[window.location.pathname];

window.onpopstate = () => {
  while (rootDiv.firstChild) { // Remover todos los hijos del elemento raíz
    rootDiv.removeChild(rootDiv.firstChild);
  }
  // Agregar el componente correspondiente a la ruta actual
  rootDiv.append(component(onNavigate));
};

// Llamadas al entrar al sitio.
rootDiv.appendChild(component(onNavigate)); // Porqué manda onNavigate a la constante component?
