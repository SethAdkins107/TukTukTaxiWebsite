/* This page handles the functionality of the map for the page*/

// Stores map object
let map, directServ, directRend, matrix, startAuto, endAuto;

// Stores trip request for use in several functions
let curr, start, end;

// Puts the map on the page with intial data
async function initMap() {

  // Centers map on Davenport, Iowa (Why? That's where the madman lives, just to the left of the corn.)
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 41.543056, lng: -90.590836 },
    zoom: 13,
    }
  );

  // Initializes objects of shown type to call functions from the Maps API
  directServ = new google.maps.DirectionsService();
  directRend = new google.maps.DirectionsRenderer();

  // Initializes the renderer to reference the map created earlier
  directRend.setMap(map)

  // Defines autocomplete restrictions to limit the results to Davenport, IA
  var restrict = {
    bounds: {
      north: 41.59,
      south: 41.49,
      west: -90.63,
      east: -90.42,
    },
    strictBounds: true,
  }
 
  // Call to the AutoComplete functions from the Maps API for inputting locations
  startAuto = new google.maps.places.Autocomplete(document.getElementById("start"), restrict);
  endAuto = new google.maps.places.Autocomplete(document.getElementById("end"), restrict);
  driverAuto = new google.maps.places.Autocomplete(document.getElementById("driver"), restrict);

}

// Submits locations given and determines route and cost
function getCustDirect() {
  // Stores the input destinations
  start = startAuto.getPlace();
  end = endAuto.getPlace();
  
  // Connects this output variable to reference the output section in the HTML
  var output = document.querySelector("#output");

  // Builds the HTTPS request to the Maps API
  let routeRequest = {
    origin: start.placeID,
    destination: end.placeID,
    travelMode:"BICYCLING",
  };

  // Stores the route to be retrieved on further pages
  localStorage.setItem("route", JSON.stringify(routeRequest))

  // Sends request to the route function and displays order details
  directServ.route(routeRequest, function(result, status) {
    // If the request is received and able to be processed correctly
    if(status == "OK") {

      // Prints the route received to the map on the page
      directRend.setDirections(result)

      // Prints the order details through rewriting the html code with the new results
      output.innerHTML = "Distance: " + result.routes[0].legs[0].distance.text +
      "<br>Time: " + result.routes[0].legs[0].duration.text +
      "<br>Price: $" + (((result.routes[0].legs[0].distance.value / 1609) * 4) + 5).toFixed(2);
    }
  })
}

// Creates route to customer and then to their destination
function getDrivDirect() {
  
  // Connects this output variable to reference the output section in the HTML
  var output = document.querySelector("#output");

  // Retrieves the Maps API request from the customer to show to the driver
  let custRequest = JSON.parse(localStorage.getItem("route"))
  
  // Builds the Maps API request for the driver
  driverAuto = document.getElementById("driver").value
  let driverRequest = {
    origin: driverAuto,
    destination: custRequest.destination,
    intermediates: [custRequest.origin],
    travelMode: "BICYCLING",
  };

  // Sends request to the route function and displays order details
  directServ.route(driverRequest, function(result, status) {
    // If the request is received and able to be processed correctly
    if(status == "OK") {

      // Prints the route received to the map on the page
      directRend.setDirections(result)

      // Prints the order details through rewriting the html code with the new results
      output.innerHTML = "Distance: " + result.routes[0].legs[0].distance.text +
      "<br>Time: " + result.routes[0].legs[0].duration.text +
      "<br>Price: $" + (((result.routes[0].legs[0].distance.value / 1609) * 4) + 5).toFixed(2);
    }
  })
}