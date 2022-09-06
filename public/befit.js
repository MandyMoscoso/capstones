
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

var map;
var service;
var infowindow;

function initialize(uluru) {
  var pyrmont = new google.maps.LatLng(uluru.lat,uluru.lng);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '10',
    query: 'hiking'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
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
        (createPlaceCard(results[i]));}
      }
    }
  }
}

nearBy()

//create new place
function createPlaceCard(place) {
  
  let placeCard = document.createElement('div');
  placeCard.innerHTML = `<h3>${place.name} </h3>
  <p>Rating: ${place.rating}  <button class='favourite' id=${place.place_id} onclick="addToFavourite('${place.place_id}')">Add to Favourite</button type="button"></p>
  <p>Address: ${place.formatted_address}</p>`  
  placesContainer.appendChild(placeCard)

}

checkBox.addEventListener('click', nearBy);

const addToFavourite = (id) =>{
  
     
    console.log(id)
    let request = {
      placeId: id,
      fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address','icon','place_id','opening_hours']
    };
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, callback); 
    
    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(place);
        axios.post(`${baseUrl}api/fitfavourite`,place)
  .then(res=>{
      console.log('received resonse from server -befit.js')
    })
      }
    }    
    
 
  
  
};