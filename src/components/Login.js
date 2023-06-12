import {signIn} from '../lib/auth.js'

//para login o mandar a registro
export const Login = (onNavigate) => {
  const LoginDiv = document.createElement('div');
  const registerButton = document.createElement('button');
  const loginButton = document.createElement('button');

  //Form Inicio Sesión
  const loginForm = document.createElement('form');
  const emailLabel = document.createElement('label');
  const emailInput = document.createElement('input');
  const passwordLabel = document.createElement('label');
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  
  const continueWithGoogle = document.createElement('button');
  continueWithGoogle.textContent = 'Continuar con Google';

  emailLabel.textContent = 'Email';
  passwordLabel.textContent = 'Contraseña';

  loginForm.appendChild(emailLabel);
  loginForm.appendChild(emailInput);
  loginForm.appendChild(passwordLabel);
  loginForm.appendChild(passwordInput);

  registerButton.textContent = '¿No tienes cuenta? Únete';
  loginButton.textContent = 'Iniciar';

  LoginDiv.appendChild(loginForm);
  LoginDiv.appendChild(registerButton);
  LoginDiv.appendChild(loginButton);
  LoginDiv.appendChild(continueWithGoogle);

  loginButton.addEventListener('click', ()=> { onNavigate('/wall')});
  registerButton.addEventListener('click', ()=> { onNavigate('/register')});

  // loginButton.addEventListener('click',()=>{
  //   localStorage["usuario"] = "Roxana"
  // })

  //TO DO 

  loginButton.addEventListener('submit', (e) => {
    e.preventDefault(); //evitar que el formulario haga el proceso de submit
    const email = emailUser.value;
    const password = passwordInput.value;
    console.log(email, password);


    if (email === '' || password === '') {
      alert('ingresa datos')
    } else {
      signIn(email, password).then(() => {
        onNavigate('/wall');
      }).catch((error) => {
        //log error
        alert('email ya registrado')
      });
    }
  });

  return LoginDiv;
}

//TO DO Verificación de Login 
//al hacer login te diriga al Home Bienvenid@
