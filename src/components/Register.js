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

  //Botón Unirse 
  const joinButton = document.createElement('button');
  joinButton.textContent = 'Unirse';
  joinButton.className = 'join-button';
  joinButton.setAttribute('type', 'submit');

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

  registerForm.appendChild(divEmail);
  registerForm.appendChild(divPassword);
  registerForm.appendChild(divName);
  registerForm.appendChild(divBirthdate);
  registerForm.appendChild(divPathology);

  RegisterDiv.appendChild(welcome);
  RegisterDiv.appendChild(userIcon);
  RegisterDiv.appendChild(registerForm);
  RegisterDiv.appendChild(joinButton)

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault(); //evitar que el formulario haga el proceso de submit
    const email = emailUser.value;
    const password = passwordInput.value;
    console.log(email, password);

    if (email === '' || password === '') {
      alert('Ingresa datos')
    } else {
      createUser(email, password).then((response) => {
        console.log(response);
        const userObject = {
          displayName: response.displayName,
          email: response.email,
          uid: response.uid
        }
        localStorage.setItem('user', JSON.stringify(userObject));
        console.log(userObject);
        onNavigate('/wall');
      }).catch((error) => {
        //log error
        console.log(error);
        alert('Error');
        //onNavigate('/register');
      });
    }
  });

  return RegisterDiv;
};

//TO DO al terminar registro, verifica login y te diriga al home Bienvenid@
//cómo guardar los demás datos. investigar Firestore
//firebase correo y contraseña 