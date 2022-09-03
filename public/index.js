

const nearBtn = document.getElementById('nearby');

const baseUrl = "http://localhost:8888/";

// const getNearbyLocation = () => {
//   console.log("main.js clicked")
//   axios.get(`${baseUrl}api/quotes/`)
//   .then(res => {
    
//     console.log("received data")
//   })
// };

const uluru = { lat: -25.344, lng: 131.031 };
const nearBy = () =>{
  
if (window.navigator.geolocation) {
  // Geolocation available    
  navigator.geolocation.getCurrentPosition(function (position) {  
      uluru.lat = position.coords.latitude;
      uluru.lng = position.coords.longitude;
      initialize(uluru)
  });
} else (initialize(uluru))
};

// // Initialize and add the map
// function initMap(uluru) {
// // The location of Uluru

// // The map, centered at Uluru
// const map = new google.maps.Map(document.getElementById("map"), {
//   zoom: 14,
//   center: uluru,
// });
// // The marker, positioned at Uluru
// const marker = new google.maps.Marker({
//   position: uluru,
//   map: map,
// });
// };

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
    radius: '500',
    query: 'gyms'
  };

  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < 5; i++) {
      var place = results[i];
      console.log(results[i].name)
      // createMarker(results[i]);
    }
  }
}

nearBtn.addEventListener("click", nearBy)
