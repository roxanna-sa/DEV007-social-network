import { signIn, signInGoogle } from '../lib/auth.js'

//para login o mandar a registro
export const Login = (onNavigate) => {
  const LoginDiv = document.createElement('div');
  //Form login
  const loginForm = document.createElement('form');
  loginForm.className = 'login-form';
  loginForm.innerHTML = `
  <h2>¡Bienvenido a Nutrivid!</h2>
  <div class="div-email">
    <label for='email'>Email:</label>
    <input type='text' name='email' id='email'>
  </div>
  <div class="div-password">
    <label for='password'>Contraseña:</label>
    <input type='password' name='password' id='password'>
  </div>
  `;

  //buttons
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'button-div';
  buttonDiv.innerHTML = `
  <button class='loginButton' id='loginButton'>Iniciar sesión</button>
  <button class='registerButton'id='registerButton'>¿No tienes cuenta? \n Regístrate</button>
  <button class='continueWithGoogle' id='continueWithGoogle'>Continuar con Google<img src= './img/google.png'></button>
  <h3> Recetas para sentirte bien...</h3>
  `;

  LoginDiv.appendChild(loginForm);
  LoginDiv.appendChild(buttonDiv);

  document.addEventListener('DOMContentLoaded', () => {
    const parentElement = document.getElementById('root');
    parentElement.addEventListener('click', (event) => {
      const target = event.target;
      if (target.matches('#loginButton')) {
        event.preventDefault()
        const userMail = document.getElementById('email').value;
        const userPass = document.getElementById('password').value;

        if (userMail === '' || userPass === '') {
          alert('Ingresa email y contraseña')
        } else {
          signIn(userMail, userPass).then((response) => {
            localStorage.setItem('user', userMail);
            localStorage.setItem('name', response.user.displayName);
            onNavigate('/wall');
          }).catch(() => {
            alert('Email o contraseña incorrectos');
          });
        };
      } else if (target.matches('#registerButton')) {
        onNavigate('/register');
      } else if (target.matches('#continueWithGoogle')) {
        signInGoogle().then((googleResponse) => {
          console.log("Rpta de google:", googleResponse)
          localStorage.setItem("user", googleResponse.user.email);
          localStorage.setItem('name', googleResponse.user.displayName);

          onNavigate('/wall');
        });
      }
    });
  });

  return LoginDiv;
}