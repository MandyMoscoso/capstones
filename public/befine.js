// select html elements for use later
const myFave = document.querySelector(".favourite");
const signoutBtn = document.querySelector('#sign-out')
const placesContainer = document.querySelector('.places-container')
const checkBox=document.querySelector('.checkbox')
const favouriteBtn ={}
//baseurl - switch when deploy to heroku
const baseUrl = "http://localhost:8888/";
//default location when user doesn't allow access to location
const uluru = { lat: -25.344, lng: 131.031 };
//Maps API for nearby place - function
const nearBy = () =>{
placesContainer.innerHTML=""
if (window.navigator.geolocation) {
  // Geolocation available    
  navigator.geolocation.getCurrentPosition(function (position) {  
      uluru.lat = position.coords.latitude;
      uluru.lng = position.coords.longitude;
      initialize(uluru)
  });
} else (initialize(uluru))
};
//Maps API function to start map
function initialize(uluru) {
  var map;
  var service;
  var infowindow;
  var pyrmont = new google.maps.LatLng(uluru.lat,uluru.lng);
  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });
  var request = {
    location: pyrmont,
    radius: '10',
    query: 'pharmacies'
  };
  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  //function to put marker on map
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
};

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      // console.log( place.photos[0].getUrl({maxWidth:640}))
      if(checkBox.checked === true){
        if(place.business_status =='OPERATIONAL' && place.opening_hours!=undefined && place.opening_hours.isOpen){         
            placesContainer.appendChild((createPlaceCard(place)))  ;}
        } else{
          if(place.business_status =='OPERATIONAL' ){          
            placesContainer.appendChild((createPlaceCard(place)))   
      }
      }
    }
  }
}
//create new place from nearby Maps APM. this is different from favourite place cards receive from server
function createPlaceCard(place) {  
  let placeCard = document.createElement('div');
  placeCard.classList.add('place-card')
  var placePhotoUrl;
  if(place.photos===undefined){
    placePhotoUrl="https://images.unsplash.com/photo-1612178537253-bccd437b730e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Ymxhbmt8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
  }else{ placePhotoUrl = place.photos[0].getUrl(); }
  placeCard.innerHTML = ` <img src= ${placePhotoUrl}>
  <h3 class ="name">${place.name} </h3>
  <p class = "rating">Rating: ${place.rating}  <button class='favourite-button' id=${place.place_id} onclick="addToFavourite('${place.place_id}','${placePhotoUrl}')">Add to Favourite</button type="button"></p>
  <p class = "address">Address: ${place.formatted_address}</p>
  <button class='direction' onclick="directionStart('${place.formatted_address}')">Let's Go</button type="button">`  
  return placeCard
};
// this function will be called when the page start. It will check if user logged in. If yes then get favourite places from server and add to html elements
function pageStarter(){  
  let firstname = getCookie('firstname');
  let lastname = getCookie('lastname');
  let user = "Welcome back,<br> "+firstname + " " + lastname;
  // console.log(user)
  document.createElement('div')
  document.querySelector('.name')

  let userCard = document.createElement('div');
        document.querySelector(".user").innerHTML=""
        userCard.classList.add('name')
        userCard.innerHTML = user ;
        console.log(userCard)    
        document.querySelector(".user").appendChild(userCard)
  let username = getCookie('username')
  if(username==undefined){   
    myFave.innerHTML = "Please log in";
    document.querySelector("h3").innerHTML = "";
    document.querySelector('label').innerHTML=''
  } else{    
    axios.get (`${baseUrl}api/showfinefavourite/${username}`)
      .then (res =>{
      myFave.innerHTML="";
      let data = res.data;      
      for(let i =0; i <data.length; i++){
        let placeCard = document.createElement('div');
        placeCard.classList.add('fave-item')
        placeCard.innerHTML = `<img src= ${data[i].photo}>
        <h3 class="fave-name">${data[i].location_name} </h3>      
        <p class="fave-address">Address: ${data[i].location_address}</p>
        <button class='direction' onclick="directionStart('${data[i].location_address}')">Let's Go</button type="button">
        <button class='delete' id=${data[i].item_id} onclick="remove('${data[i].item_id}')">Remove from Favourite</button type="button"></p>`          
        myFave.appendChild(placeCard)
        document.querySelector(".fave-header").innerHTML="My Favourite Places"
      }
    }).catch(console.log('error'))
    .then(nearBy()) 
  }
};
//if checkbox was clicked, it will call nearby function to get data and display correct places
checkBox.addEventListener('click', nearBy);
//get username from browser cookie - can be implemented after learning how to use Java - for more secure validation
const getCookie = (name)=> {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
};
//function to add a place to favourite
const addToFavourite = (id,photo) =>{      
    console.log(id)
    let request = {
      placeId: id,
      fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address','icon','place_id']
    };
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback);     
    function callback(place, status) {
      let username = getCookie('username')
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        place.username = username;
        place.category = 'befine';        
        place.photo = photo;
        console.log(place)       
        axios.post(`${baseUrl}api/addfavourite`,place)
  .then(res=>{
      pageStarter();
    })
      }
    }      
};

//function to delete a place from favourite
const remove = (location) =>{  
  let username = getCookie('username') 
        axios.put(`${baseUrl}api/removefavourite/`,{id: location, username: username} )
.then(res=>{
    pageStarter();
  })
}
//function to redirect to new page
function myFunction(target) {
      location.replace(`${target}.html`)
    }
//function to sign out and add event listener to signout. can switch to onclick on html to avoid using addEventlisterner
const signOut = () =>{
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "firstname=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "lastname=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  location.replace(`login.html`);
}
signoutBtn.addEventListener('click', signOut)

//call pageStarter to start the page
pageStarter();


const directionStart = (ori) =>{
  const map = new google.maps.Map(document.getElementById("map"), {
      // center: new google.maps.LatLng(45.4215296, -75.6971931),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
  });
  
  const directionsService = new google.maps.DirectionsService();
  
  directionsService.route(
      {
              // origin: "272 Bronson Ave, Ottawa, Canada",
              // destination: "1385 Woodroffe Ave, Nepean, Canada",
              origin: ori,
              destination: uluru,
              travelMode: "DRIVING",
      },
      (response, status) => {
          if (status === "OK") {
  
              new google.maps.DirectionsRenderer({
                  suppressMarkers: true,
                  directions: response,
                  map: map,
                });
          }
      }
  )
}