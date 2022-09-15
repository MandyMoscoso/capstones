
const baseUrl = "http://localhost:8888/";
const getCookie = (name)=> {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
};
let username = getCookie('username')

const getUserInfo = async (username) =>{
    await axios.get(`${baseUrl}api/userinfo/${username}`)
     .then(res =>{
        createUserCard(res.data[0])
    })
    .catch(function (error) {
        if (error.response) {         
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {        
          console.log(error.request);
        } else {         
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
} ;
getUserInfo(username)

const signOut = () =>{
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "firstname=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "lastname=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  location.replace(`login.html`);
}

const createUserCard = (user) => {
 let userInfo = document.createElement('div');
 userInfo.classList.add('user-profile')
 userInfo.innerHTML = ` 
 <div class ='info-container' id ='firstname'>
 <p class ="info">Firstname: ${user.firstname} </p>
 <p class='edit' onclick="editUser('${user.username}','firstname')">Edit</p>
 </div>
 <div class ='info-container' id ='lastname'>
 <p class ="info">Lastname: ${user.lastname} </p>
 <p class='edit' onclick="editUser('${user.username}','lastname')">Edit</p>
 </div>
 <div class ='info-container' id ='email'>
 <p class ="info">Email:   ${user.email} </p>
 <p class='edit' onclick="editUser('${user.username}','email')">Edit</p>
 </div>
 <button class='delete' onclick="deleteUser('${user.username}')">Delete Account</button>`
  return document.querySelector('.user-info').appendChild(userInfo)
};

const editUser= (username,item) => {
    console.log("edit clicked main.js", username);
    const editForm = document.createElement("form");
    editForm.innerHTML= `<input type = "text" class="edit-form" placeholder = "Enter new ${item}"></input><input type="button" onclick="submitEdit('${username}', '${item}')" value="Submit" id='${username}'> </input>`;
    console.log(editForm)
    document.querySelector(`#${item}`).appendChild(editForm);
    return ;    
}

const submitEdit =(username,item) =>{
    const formInput = document.querySelector(".edit-form").value;
    let obj = {
        username,
        item,
        newvalue: formInput
    }
    console.log(obj)
    axios.put(`${baseUrl}api/edituser/`,obj)
    .then(res =>{
        document.querySelector('.user-info').innerHTML= "";
        createUserCard(res.data[0])
    }
        ) 
    .catch(function (error) {
        if (error.response) {         
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {        
          console.log(error.request);
        } else {         
          console.log('Error', error.message);
        }
        console.log(error.config);
      });   
};

const deleteUser = (username) =>{
    axios.delete((`${baseUrl}api/deleteuser/${username}`))
    .then(res =>{
        signOut();
    })
    .catch(function (error) {
      if (error.response) {         
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {        
        console.log(error.request);
      } else {         
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
}
