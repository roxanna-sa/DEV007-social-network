//para login o mandar a registro
export const Login = () => {
  const LoginDiv = document.createElement('div');
  const registerButton = document.createElement('button');
  const loginButton = document.createElement('button');

  registerButton.textContent = 'Únete';
  loginButton.textContent = 'Iniciar';

  LoginDiv.appendChild(registerButton);
  LoginDiv.appendChild(loginButton);

  // loginButton.addEventListener('click',()=>{
  //   localStorage["usuario"] = "Roxana"
  // })

  // TO DO inputs de email y password
  return LoginDiv;
}