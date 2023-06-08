// Este es el punto de entrada de tu aplicacion
import {Login} from './components/Login'
import {Register} from './components/Register'

const rootDiv = document.getElementById('root');

const routes = {
  '/': Home,
  '/login': Login,
  '/register': Register,
  '/profile': profile, //sólo para editar perfil
  '/wall': wall //muro personal
  // '/friends': 'friends'
};


const callComponent = routes[window.location.pathname];
rootDiv.appendChild(callComponent());