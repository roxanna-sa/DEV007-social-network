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
  `

  LoginDiv.appendChild(loginForm);
  LoginDiv.appendChild(buttonDiv);

  document.addEventListener('DOMContentLoaded', () => {

  const registerButton = document.getElementById('registerButton');
  registerButton.addEventListener('click', () => { onNavigate('/register') });

  const loginButton = document.getElementById('loginButton')
  loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    const userMail = emailInput.value;
    const userPass = passwordInput.value;

    if (userMail === '' || userPass === '') {
      alert('Ingresa email y contraseña')
    } else {
      signIn(userMail, userPass).then((response) => {
        localStorage.setItem('user', userMail);
        localStorage.setItem('name', response.user.displayName);
        onNavigate('/wall');
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Email o contraseña incorrectos');
        console.log(errorCode, errorMessage);
      });
    };
  });

  continueWithGoogle.addEventListener('click', () => {

    signInGoogle().then((googleResponse) => {
      console.log("Rpta de google:", googleResponse)
      localStorage.setItem("user", googleResponse.user.email);
      localStorage.setItem('name', googleResponse.user.displayName);

      onNavigate('/wall');
    });
  });
  });

  return LoginDiv;
}