// functions for log in page
const logIn = document.querySelector('.log-in')
const loginForm = document.querySelector('#login-form')
const registerForm = document.querySelector('#register-form')
let userid = ''
const baseURL = `http://localhost:8888/api`

const login = body => axios.post(`${baseURL}/login`, body).then( res => {  
  // console.log(res.data)
  loginSuccess(res.data)
}).catch(err => {
  console.log(err)
  alert('Please check your username and password')
})
const register = body => axios.post(`${baseURL}/register`, body).then(res => {
  console.log("registered")
  registerSuccess(res.data)
}).catch(err => {
  console.log(err)
  alert('Uh oh. Your request did not work.')
})

function loginSubmitHandler(e) {
    e.preventDefault()

    let username = document.querySelector('#login-username')
    let password = document.querySelector('#login-password')

    let bodyObj = {
        username: username.value,
        password: password.value
    }

    login(bodyObj)

    username.value = ''
    password.value = ''
}

function registerSubmitHandler(e) {
  e.preventDefault()

  let username = document.querySelector('#register-username')
  let email = document.querySelector('#register-email')
  let firstName = document.querySelector('#register-firstName')
  let lastName = document.querySelector('#register-lastName')
  let password = document.querySelector('#register-password')
  let password2 = document.querySelector('#register-password-2')

  if (password.value !== password2.value) {
    alert("Your passwords need to match.")
    return
  }

  let bodyObj = {
      username: username.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      password: password.value
  }

  register(bodyObj)

  username.value = ''
  email.value = ''
  firstName.value = ''
  lastName.value = ''
  password.value = ''
  password2.value = ''
}

function registerSuccess(data) {
  document.querySelector('h1').innerHTML = `<p class = "welcome" >Welcome ${data.firstName} ${data.lastName}`
    document.querySelector(".register").innerHTML = ''
}

function loginSuccess(data) {
  document.cookie = data;
  
  logIn.innerHTML = ''
  const newLogIn = document.createElement('div')  
  newLogIn.innerHTML = `<
  <nav class ='menu'> 
      <div class = "menu-btn" id="my-profile">My Profile</div>
      <div class="menu-btn" id ="sign-out">Sign Out</div>
  </nav>
  <div class="container">
  <div class = "fit"><a href="befit.html">BE FIT</a></div>
      <div class = "full">BE FULL</div>
      <div class = "fine">BE FINE</div>
  </div>  
  `
  logIn.appendChild(newLogIn)
}

loginForm.addEventListener('submit', loginSubmitHandler)
registerForm.addEventListener('submit', registerSubmitHandler)
// ------------------------------------------------------------------------------

