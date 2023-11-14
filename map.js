/* This page handles the functionality of the map for the page*/

// Stores map object
let map, directServ, directRend, matrix, startAuto, endAuto;

// Puts the map on the page centered on Davenport
async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.543056, lng: -90.590836 },
    zoom: 13,
  });

  matrix = new google.maps.DistanceMatrixService();
  directServ = new google.maps.DirectionsService();
  directRend = new google.maps.DirectionsRenderer();
  directRend.setMap(map)

  
  startAuto = new google.maps.places.Autocomplete( document.getElementById("start"));
  endAuto = new google.maps.places.Autocomplete( document.getElementById("end"));

}

initMap();

function getDirect() {
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;
  var dist, time;

  var output = document.querySelector("#output");

  let routeRequest = {
    origin: start,
    destination: end,
    travelMode:"BICYCLING",
  };

  directServ.route(routeRequest, function(result, status) {
    if(status == "OK") {
      directRend.setDirections(result)

      output.innerHTML = "Distance: " + result.routes[0].legs[0].distance.text +
      "<br>Time: " + result.routes[0].legs[0].duration.text +
      "<br>Price: $" + (((result.routes[0].legs[0].distance.value / 1609) * 4) + 5).toFixed(2);
    }
  })
}

