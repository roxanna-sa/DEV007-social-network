import { createUser } from '../lib/auth.js'

//registro datos usuario

export const Register = (onNavigate) => {
  const RegisterDiv = document.createElement('div');
  RegisterDiv.className = 'register-div';
  const welcome = document.createElement('h2');
  welcome.textContent = 'Ingresa tus datos';

  //Create form elements
  const registerForm = document.createElement('form');
  registerForm.className = 'register-form';
  registerForm.innerHTML = `
  <img src='./img/user.png' class='user-icon' id='user-icon'>
  <div class="div-email">
    <label for='email'>Email:</label>
    <input type='text' name='email' id='email'>
  </div>
  <div class="div-password">
    <label for='password'>Contraseña:</label>
    <input type='password' name='password' id='password'>
  </div>
  <div class="div-name">
    <label for='name'>Nombre:</label>
    <input type='text' name='name' id='name'>
  </div>
  <div class="div-birthdate">
    <label for='birthdate'>Fecha de nacimiento:</label>
    <input type='text' name='birthdate' id='birthdate'>
  </div>
  <div class="div-pathology">
    <label for='pathology'>¿Tienes alguna patología?:</label>
    <select name="select-pathology">
      <option value="value1">Value 1</option>
      <option value="value2" >Value 2</option>
      <option value="value3">Value 3</option>
    </select>
  </div>
  <button class='join-button' id='join-button' type='submit'>Unirse</button>
  <h3 class="h3Register"> Recetas para sentirte bien...</h3>
  `

  RegisterDiv.appendChild(welcome);
  RegisterDiv.appendChild(registerForm);

  registerForm.addEventListener('submit', (e) => {
    const joinButton = document.getElementById('join-button');
    const emailUser = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const userName = document.getElementById('name');

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