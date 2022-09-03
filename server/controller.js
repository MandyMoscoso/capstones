
const uluru = { lat: -25.344, lng: 131.031 };
// if (window.navigator.geolocation) {
//   // Geolocation available    
//   navigator.geolocation.getCurrentPosition(function (position) {  
//       uluru.lat = position.coords.latitude;
//       uluru.lng = position.coords.longitude;
//       initMap(uluru)
//   });
// } else (initMap(uluru))

// Initialize and add the map
function initMap(uluru) {
// The location of Uluru

// The map, centered at Uluru
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 14,
  center: uluru,
});
// The marker, positioned at Uluru
const marker = new google.maps.Marker({
  position: uluru,
  map: map,
});
};



module.exports = {
  initMap: (uluru) => {
        initMap(uluru)
   
  },
  conLog: () => {
    console.log("controller received")
}
}