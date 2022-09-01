
let exampleCord = {
    coords : { 
      latitude: 51.4554803,
      longitude: -2.0843058,
      altitude: null,
      accuracy: 49,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 1583860898576
  }

var uluru ={};


// console.log(successfulLookup(exampleCord))
//get user location
if (window.navigator.geolocation) {
    // Geolocation available
    navigator.geolocation.getCurrentPosition(function (position) {  
        var current_latitude = position.coords.latitude;
        var current_longitude = position.coords.longitude;
        console.log(current_latitude,current_longitude)
        initMap(current_latitude, current_longitude);
    });
} else {
    initMap(54.046575, -2.8007399);
   } 

   


// Initialize and add the map
function initMap(current_latitude,current_longitude) {
    var map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(current_latitude, current_longitude),
        zoom: 12,
        mapTypeId: 'roadmap'
});
console.log(current_latitude,current_longitude,"this is initmap")
}
  
