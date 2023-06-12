//muro personal
export const Wall = (onNavigate) => {
    const WallDiv = document.createElement('div');
    WallDiv.textContent = 'Ingresa tus datos';
  
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
    WallDiv.appendChild(registerForm);
  
    
  
    return WallDiv;
  }
  