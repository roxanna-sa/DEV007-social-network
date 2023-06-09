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

  loginButton.addEventListener('click', ()=> { onNavigate('/home')});
  registerButton.addEventListener('click', ()=> { onNavigate('/register')});

  // loginButton.addEventListener('click',()=>{
  //   localStorage["usuario"] = "Roxana"
  // })

  //TO DO 
  return LoginDiv;
}

//TO DO Verificación de Login 
//al hacer login te diriga al Home Bienvenid@
