// less


//functions
// functions for log in page
const logIn = document.querySelector('.log-in')
const loginForm = document.querySelector('#login-form')
const registerForm = document.querySelector('#register-form')
let userid = '';
const signoutBtn = document.querySelector('#sign-out')
const baseURL = `http://localhost:8888/api`

const login = body => axios.post(`${baseURL}/login`, body).then( res => {  
  // console.log(res.data)
  loginSuccess(res.data)
}).catch(err => {
  console.log(err)
  alert('Please check your username and password')
})
const register = body => axios.post(`${baseURL}/register`, body).then(res => { 
  if(res.data ==='Username unvailable'){
    alert('Username unavailable')
  }else{
    registerSuccess(res.data)
  }
}).catch(err => {
  alert('Server error. Please try again.')
})

function loginSubmitHandler(e) {
    e.preventDefault()
    // console.log('login clicked')
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
    // document.querySelector("#register-form").innerHTML = ''
    document.querySelector("#register-form").remove()
}

function loginSuccess(data) {  
  document.cookie = `username=${data.username}`;
  document.cookie = `firstname=${data.firstname}`;
  document.cookie = `lastname=${data.lastname}`
  location.replace(`main.html`)
}
function myFunction(target) {
  location.replace(`${target}.html`)
}
if(loginForm){
  loginForm.addEventListener('submit', loginSubmitHandler)
}
if(registerForm){
  registerForm.addEventListener('submit', registerSubmitHandler)
}
// ------------------------------------------------------------------------------

const signOut = () =>{
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  location.replace(`login.html`);
}


