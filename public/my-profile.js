const baseUrl = "http://localhost:8888/";

const getCookie = (name)=> {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};
let username = getCookie('username')
const getUserInfo = (username) =>{

    axios.get(`${baseUrl}api/userinfo/${username}`)
    .then(res =>{
        createUserCard(res.data[0])
    })
} ;
getUserInfo(username)

const createUserCard = (user) => {
 let userInfo = document.createElement('div');
 userInfo.classList.add('user-profile')
 userInfo.innerHTML = ` 
 <div class ='info-container'>
 <p class ="info">Firstname: ${user.firstname} </p>
 <p class='edit' onclick="editUser('${user.username}','firstname')">Edit</p>
 </div>

 <div class ='info-container'>
 <p class ="info">Lastname: ${user.lastname} </p>
 <p class='edit' onclick="editUser('${user.username}','lastname')">Edit</p>
 </div>

 <div class ='info-container'>
 <p class ="info">Email: ${user.email} </p>
 <p class='edit' onclick="editUser('${user.username}','email')">Edit</p>
 </div>

 <button class='delete' onclick="deleteUser('${user.username}')">Delete User</button>`
  document.querySelector('.user-info').appendChild(userInfo)
};
const signOut = () =>{
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    location.replace(`login.html`);
  }

