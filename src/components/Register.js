import { createUser } from '../lib/auth.js'

//registro datos usuario

export const Register = (onNavigate) => {
  const RegisterDiv = document.createElement('div');
  RegisterDiv.className = 'register-div';
  const welcome = document.createElement('h2');
  welcome.textContent = 'Ingresa tus datos';
  const userIcon = document.createElement('img');
  userIcon.className = 'user-icon';
  userIcon.src = './img/user.png';

  //Create form elements
  const registerForm = document.createElement('form');
  registerForm.className = 'register-form';
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

  emailLabel.textContent = 'Email:';
  passwordLabel.textContent = 'Contraseña:';
  userNameLabel.textContent = 'Nombre:';
  userBirthdateLabel.textContent = 'Fecha de nacimiento:';
  userPathologyLabel.textContent = '¿Tienes alguna patología?'

  const divEmail = document.createElement('div');
  divEmail.className = 'div-email';
  divEmail.appendChild(emailLabel);
  divEmail.appendChild(emailUser);

  const divPassword = document.createElement('div');
  divPassword.className = 'div-password';
  divPassword.appendChild(passwordLabel);
  divPassword.appendChild(passwordInput);

  const divName = document.createElement('div');
  divName.className = 'div-name';
  divName.appendChild(userNameLabel);
  divName.appendChild(userName);

  const divBirthdate = document.createElement('div');
  divBirthdate.className = 'div-birthdate';
  divBirthdate.appendChild(userBirthdateLabel);
  divBirthdate.appendChild(userBirthdate);

  const divPathology = document.createElement('div');
  divPathology.className = 'div-pathology';
  divPathology.appendChild(userPathologyLabel);
  divPathology.appendChild(userPathology);

  //Botón Unirse 
  const joinButton = document.createElement('button');
  joinButton.textContent = 'Unirse';
  joinButton.className = 'join-button';
  joinButton.setAttribute('type', 'submit');

  registerForm.appendChild(divEmail);
  registerForm.appendChild(divPassword);
  registerForm.appendChild(divName);
  registerForm.appendChild(divBirthdate);
  registerForm.appendChild(divPathology);
  registerForm.appendChild(joinButton);

  RegisterDiv.appendChild(welcome);
  RegisterDiv.appendChild(userIcon);
  RegisterDiv.appendChild(registerForm);

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); //evitar que el formulario haga el proceso de submit
    joinButton.setAttribute('disabled', true); // Bloquear botón submit para evitar doble registro
    const email = emailUser.value.trim();
    const password = passwordInput.value.trim();
    const displayName = userName.value.trim();
    console.log(email, password);

    if (email === '' || password === '' || displayName === '') {
      alert('Ingresa datos');
      joinButton.removeAttribute('disabled');
    } else {
      createUser(email, password, displayName).then((response) => {
        console.log(response);
        localStorage.setItem('user', response.email);
        localStorage.setItem('name', displayName);
        onNavigate('/wall');
      }).catch((error) => {
        //log error
        console.log(error);
        alert('Error');
        joinButton.removeAttribute('disabled');
        //onNavigate('/register');
      });
    }
  });

  return RegisterDiv;
};

//TO DO al terminar registro, verifica login y te diriga al home Bienvenid@
//cómo guardar los demás datos. investigar Firestore
//firebase correo y contraseña 