import {createUser} from '../lib/auth.js'

//registro datos usuario

export const Register = () => {
  const RegisterDiv = document.createElement('div');
  RegisterDiv.textContent = 'Ingresa tus datos';

  //form
  const registerForm= document.createElement('form');
  const emailUser = document.createElement('input');
  const passwordInput = document.createElement('input');
  passwordInput.setAttribute('type','password');

  const joinButton = document.createElement('button');
  joinButton.textContent = 'Unirse';
  joinButton.setAttribute('type','submit');
 
  
  registerForm.appendChild(emailUser);
  registerForm.appendChild(passwordInput);
  registerForm.appendChild(joinButton);
  RegisterDiv.appendChild(registerForm);


  registerForm.addEventListener('submit', (e)=> {
    e.preventDefault(); //evitar que el formulario haga el proceso de submit
    const email = emailUser.value;
    const password = passwordInput.value;
    console.log(email,password);
    createUser(email,password);
  });
 

  //TO DO Inputs nombre, fecha nac, patologia 
  return RegisterDiv;
}

