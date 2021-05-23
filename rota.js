    var platform = new H.service.Platform({
    'apikey': 'AngAAE5qafu_toJ2Lwr-ueGYqe65XvCJe9kyL-A-VMs'
    });
  
  

// Retrieve the target element for the map:
var targetElement = document.getElementById('mapContainer');

// Get the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate the map:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.vector.normal.map,
  {
    zoom: 10,
    center: { lat: 52.51, lng: 13.4 }
});
  
  
  // Create the parameters for the routing request:
  var routingParameters = {
    'routingMode': 'fast',
    'transportMode': 'car',
    // The start point of the route:
    'origin': '-8.3678162,-35.0315702',
    // The end point of the route:
    'destination': '-23.1019916,-46.9665265',
    // Include the route shape in the response
    'return': 'polyline'
  };
  
  // Define a callback function to process the routing response:
  var onResult = function(result) {
    
    // ensure that at least one route was found
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
        
           // Create a linestring to use as a point source for the route line
          let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
  
          // Create a polyline to display the route:
          let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineDash: [0, 2], lineWidth: 10, lineTailCap: 'arrow-tail',
            lineHeadCap: 'arrow-head', fillColor: 'blue' }
          });
  
          // Create a marker for the start point:
          let startMarker = new H.map.Marker(section.departure.place.location);
  
          // Create a marker for the end point:
          let endMarker = new H.map.Marker(section.arrival.place.location);
  
          // Add the route polyline and the two markers to the map:
          map.addObjects([routeLine, startMarker, endMarker]);
  
          // Set the map's viewport to make the whole route visible:
          map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
      });
    }
  };
  
  // Get an instance of the routing service version 8:
  var router = platform.getRoutingService(null, 8);
  
   //Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });
 