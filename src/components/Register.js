import { createUser } from '../lib/auth.js'

//registro datos usuario

export const Register = (onNavigate) => {
  const RegisterDiv = document.createElement('div');
  RegisterDiv.textContent = 'Ingresa tus datos';

  //Create form elements
  const registerForm = document.createElement('form');
  const emailLabel = document.createElement('label');
  const emailUser = document.createElement('input');
  const passwordLabel = document.createElement('label');
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type', 'password');
  const userNameLabel = document.createElement('label');
  const userName = document.createElement('input');
  const userBirthdateLabel = document.createElement('label');
  const userBirthdate = document.createElement('input');
  const userPathologyLabel = document.createElement('label');
  const userPathology = document.createElement('select');

  emailLabel.textContent = 'Email';
  passwordLabel.textContent = 'Contraseña';
  userNameLabel.textContent = 'Nombre';
  userBirthdateLabel.textContent = 'Fecha de nacimiento';
  userPathologyLabel.textContent = '¿Tienes alguna patología?'

  //Botón Unirse 
  const joinButton = document.createElement('button');
  joinButton.textContent = 'Unirse';
  joinButton.setAttribute('type', 'submit');

  registerForm.appendChild(emailLabel);
  registerForm.appendChild(emailUser);
  registerForm.appendChild(passwordLabel);
  registerForm.appendChild(passwordInput);
  registerForm.appendChild(userNameLabel);
  registerForm.appendChild(userName);
  registerForm.appendChild(userBirthdateLabel);
  registerForm.appendChild(userBirthdate);
  registerForm.appendChild(userPathologyLabel);
  registerForm.appendChild(userPathology);
  registerForm.appendChild(joinButton);
  RegisterDiv.appendChild(registerForm);

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); //evitar que el formulario haga el proceso de submit
    const email = emailUser.value;
    const password = passwordInput.value;
    console.log(email, password);
    createUser(email, password);

    joinButtonButton.addEventListener('click', () => { onNavigate('/home') });

  });

  return RegisterDiv;
}

//TO DO al terminar registro, verifica login y te diriga al home Bienvenid@
//cómo guardar los demás datos. localStorage 
//firebase correo y contraseña 