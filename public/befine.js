
const myFave = document.querySelector(".favourite");
const signoutBtn = document.querySelector('#sign-out')
const placesContainer = document.querySelector('.places-container')
const checkBox=document.querySelector('.checkbox')
const favouriteBtn ={}
const baseUrl = "http://localhost:8888/";
const uluru = { lat: -25.344, lng: 131.031 };
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
    query: 'pharmacy'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });

}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      if(checkBox.checked === true){
        if(place.business_status =='OPERATIONAL' && place.opening_hours.isOpen){
          // console.log(results[i]);
        (createPlaceCard(results[i]));}
      } else{
        if(place.business_status =='OPERATIONAL' ){
          // console.log(results[i]);
          placesContainer.appendChild((createPlaceCard(results[i])))        
        
      }
      }
    }
  }
}



//create new place
function createPlaceCard(place) {
  
  let placeCard = document.createElement('div');
  placeCard.innerHTML = `<h3 class ="name">${place.name} </h3>
  <p class = "rating">Rating: ${place.rating}  <button class='favourite' id=${place.place_id} onclick="addToFavourite('${place.place_id}')">Add to Favourite</button type="button"></p>
  <p class = "address">Address: ${place.formatted_address}</p>`  
  return placeCard

}

const getCookie = (name)=> {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
};

function pageStarter(){  
  let username = getCookie('username')
  if(username==undefined){
    console.log('please log in')
    myFave.innerHTML = "Please log in";
    document.querySelector("h3").innerHTML = "";
    document.querySelector('label').innerHTML=''

  } else{
    
    axios.get (`${baseUrl}api/showfavourite/${username}`)
    .then (res =>{
      myFave.innerHTML="";
      let data = res.data;
     
      for(let i =0; i <data.length; i++){      
            
        let placeCard = document.createElement('div');
        placeCard.classList.add('fave-item')
        placeCard.innerHTML = `<h3 class="fave-name">${data[i].location_name} </h3>      
        <p class="fave-address">Address: ${data[i].location_address}</p>
        <button class='delete' id=${data[i].item_id} onclick="remove('${data[i].item_id}')">Remove from Favourite</button type="button"></p>`          
        myFave.appendChild(placeCard)
        document.querySelector(".fave-header").innerHTML="My Favourite Places"
      }
    })
    nearBy()
  }
};

checkBox.addEventListener('click', nearBy);

const addToFavourite = (id) =>{      
    // console.log(id)
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
        place.category = 'befit'
       
        axios.post(`${baseUrl}api/fitfavourite`,place)
  .then(res=>{
      pageStarter();
    })
      }
    }      
};


const remove = (location) =>{  
  let username = getCookie('username') 
        axios.put(`${baseUrl}api/fitfavourite/`,{id: location, username: username} )
.then(res=>{
    pageStarter();
  })
    }
 
const signOut = () =>{
  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  location.replace(`login.html`);
}

pageStarter();
signoutBtn.addEventListener('click', signOut)