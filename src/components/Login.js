import { signIn, signInGoogle } from '../lib/auth.js'

//para login o mandar a registro
export const Login = (onNavigate) => {
  const LoginDiv = document.createElement('div');

  //Form login
  const loginForm = document.createElement('form');
  const welcome = document.createElement('h2');
  welcome.textContent = 'Bienvenido a Nutrivid';
  //Div input email
  const divEmail = document.createElement('div');
  const emailLabel = document.createElement('label');
  const emailInput = document.createElement('input');
  // Div password
  const divPassword = document.createElement('div');
  const passwordLabel = document.createElement('label');
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');

  // TO DO focus email input
  // document.getElementById("myTextField").focus();
  emailLabel.textContent = 'Email:';
  passwordLabel.textContent = 'Contraseña:';

  //buttons
  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'button-div';
  const loginButton = document.createElement('button');
  const registerButton = document.createElement('button');

  //TO DO Acomodar logo google
  const continueWithGoogle = document.createElement('button');
  const googleLogo = document.createElement('img');
  continueWithGoogle.textContent = 'Continuar con Google';
  googleLogo.src = './img/google.png';
  continueWithGoogle.appendChild(googleLogo);

  registerButton.textContent = '¿No tienes cuenta? \n Únete';
  loginButton.textContent = 'Iniciar Sesión';

  LoginDiv.appendChild(welcome);

  divEmail.appendChild(emailLabel);
  divEmail.appendChild(emailInput);
  loginForm.appendChild(divEmail);
  
  divPassword.appendChild(passwordLabel);
  divPassword.appendChild(passwordInput);
  loginForm.appendChild(divPassword);

  buttonDiv.appendChild(loginButton);
  buttonDiv.appendChild(registerButton);
  buttonDiv.appendChild(continueWithGoogle);

  LoginDiv.appendChild(loginForm);
  LoginDiv.appendChild(buttonDiv);

  //Agregando clases

  loginForm.className = 'login-form'
  registerButton.classList.add('registerButton');
  emailInput.classList.add('inputEmail');
  passwordInput.classList.add('inputpassword');
  continueWithGoogle.classList.add('continueWithGoogle');
  loginButton.classList.add('loginButton');

  registerButton.addEventListener('click', () => { onNavigate('/register') });

  loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    const userMail = emailInput.value;
    const userPass = passwordInput.value;

    if (userMail === '' || userPass === '') {
      alert('Ingresa email y contraseña')
    } else {
      signIn(userMail, userPass).then(() => {
        localStorage.setItem('user', userMail);
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

      onNavigate('/wall');
    });
  });

  return LoginDiv;
}