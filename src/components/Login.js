
import { signIn, signInGoogle } from '../lib/auth.js'

//para login o mandar a registro
export const Login = (onNavigate) => {
  const LoginDiv = document.createElement('div');
  const loginButton = document.createElement('button');
  const registerButton = document.createElement('button');

  //Form Inicio Sesión
  const loginForm = document.createElement('form');
  const emailLabel = document.createElement('label');
  const emailInput = document.createElement('input');
  const passwordLabel = document.createElement('label');
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');

  const continueWithGoogle = document.createElement('button');
  continueWithGoogle.textContent = 'Continuar con Google';

  continueWithGoogle.addEventListener('click', () => {
    signInGoogle();
    onNavigate('/wall');

  });


  emailLabel.textContent = 'Email';
  passwordLabel.textContent = 'Contraseña';

  loginForm.appendChild(emailLabel);
  loginForm.appendChild(emailInput);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(passwordInput);

  registerButton.textContent = '¿No tienes cuenta? Únete';
  loginButton.textContent = 'Iniciar Sesión';

  LoginDiv.appendChild(loginForm);
  LoginDiv.appendChild(registerButton);
  LoginDiv.appendChild(loginButton);
  LoginDiv.appendChild(continueWithGoogle);


  registerButton.addEventListener('click', () => { onNavigate('/register') });

  loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    const userMail = emailInput.value;
    const userPass = passwordInput.value;
    signIn(userMail, userPass)
      .then((response) => {
        console.log(response.user);
        const objUsuario = {
          displayName: response.user.displayName,
          email: response.user.email,
          uid: response.user.uid
        }

        localStorage.setItem("usuario", JSON.stringify(objUsuario));
        onNavigate('/wall');
      })
  })

  //Agregando clases

  LoginDiv.classList.add('background');
  registerButton.classList.add('registerButton');
  emailInput.classList.add('inputEmail');
  passwordInput.classList.add('inputpassword');
  continueWithGoogle.classList.add('continueWithGoogle');
  loginButton.classList.add('loginButton');


  return LoginDiv;
}


//TO DO Verificación de Login
//al hacer login te diriga al Home Bienvenid@
