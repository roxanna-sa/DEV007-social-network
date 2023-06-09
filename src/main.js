// Este es el punto de entrada de tu aplicacion
import {Login} from './components/Login.js'
import {Register} from './components/Register.js'
import {Home} from './components/Home.js'


const rootDiv = document.getElementById('root');
let routes = {};

export const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname,
  );
  rootDiv.removeChild(rootDiv.firstChild);
  rootDiv.appendChild(routes[pathname]);
};

routes = {
  '/': Login(onNavigate),
  '/register': Register(onNavigate),
  '/home': Home(onNavigate),
  //'/profile': Profile(onNavigate),
  //'/wall': Wall(onNavigate),
  //'/404': NotFound(onNavigate)
  
};

export const components = () => routes[window.location.pathname];

window.onpopstate = () => {
  rootDiv.removeChild(rootDiv.firstChild);
  rootDiv.append(components());
};

// Llamadas al entrar al sitio.
rootDiv.appendChild(components());