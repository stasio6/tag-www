var map="";    // declares a global map variable

//a helper array to avoid searching for same locations many times
var googlePins = [];

var contentStrings = [];

var mapFunctions = [];

var opened;

//a helper value which will help me avoid many passages of a small number
var helperNum=0;

//a helper valule to check if the search has ended
var waiting=0;

/*
Start here! initializeMap() is called when page is loaded.
*/

function initializeMap() {

  var locations;
  opened="";

  var mapOptions = {
    disableDefaultUI: true,
    zoom: 15
    // center: new google.maps.LatLng(-34.397, 150.644)
  };
  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  
  // map = new google.maps.Map(document.querySelector('#map'), mapOptions);
  
  map = new google.maps.Map(document.getElementById('mapDiv'), mapOptions);

  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder() {

    // initializes an empty array
    //console.log(self.locations());
    var locations = self.locations();
    var nloc=[];
    for (var one in locations)
    {
      if (locations[one].hidden===true)
        nloc.push(locations[one].name);
    }
    //console.log(nloc);

    return nloc;
  }


  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(googlePinsId) {

    // The next lines save location data from the search result object to local variables

    var placeData = googlePins[googlePinsId];

    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window
    var helperName = placeData.name;

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      animation: google.maps.Animation.DROP,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.

    if (contentStrings.length<=googlePinsId || contentStrings[googlePinsId]==="")
    {
      while (contentStrings.length<=googlePinsId)
        contentStrings.push("");
      var URL2 = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + helperName + "&format=json&callback=myCallback";
      //console.log(helperName);
      var error_catch = setTimeout(function() {
          var pomname = name;
          contentStr = "<h1>" + pomname + "</h1>";
          contentStr += "<h2>Wikipedia articles couldn't be loaded properly</h2>";
          contentStrings[googlePinsId]=contentStr;
          finish(contentStr);
      }, 8000);
      $.ajax(URL2, {dataType: "jsonp", success: function(response) {
          contentStr = "<h1>" + response[0] + "</h1>";
          contentStr+="<ul>";
          var tab = response[1];
          var leng=tab.length;
          if (leng>3)
              leng=3;
          for (var i=0; i<leng; i++)
          {
              contentStr += "<li><a href='http://en.wikipedia.org/wiki/" + tab[i] + "'>" + tab[i] + "</a></li>";
              //console.log(contentStr);
              //console.log("");
          }
          contentStr+="</ul>";
          clearTimeout(error_catch);
          contentStrings[googlePinsId]=contentStr;
          finish(contentStr);
      }}).fail(function() {
        contentStr = "<h1>" + pomname + "</h1>";
        contentStr += "<h2>Wikipedia articles couldn't be loaded properly</h2>";
        finish(contentStr);
      });
    }
    else
    {
      finish(contentStrings[googlePinsId]);
    }
    function finish(text)
    {
      var infoWindow = new google.maps.InfoWindow({
        content: text
      });

      mapFunctions[googlePinsId]=function() {
        // your code goes here!
        //initializeMap();
        marker.setAnimation(google.maps.Animation.DROP);
        if (opened!="")
          opened.close();
        infoWindow.open(map,marker);
        opened=infoWindow;
      };

      // hmmmm, I wonder what this is about...
      google.maps.event.addListener(marker, 'click', mapFunctions[googlePinsId]);
    }

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      googlePins.push(results[0]);
      createMapMarker(googlePins.length-1);
    }
    else
    {
      console.log(status);
      alert("Searched city doesn't exist");
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  var globalID;
  
  function callbacka(results, status)
  {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      globalID=results[0].place_id;
    }
  }

  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);
    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {
      // the search request object

      if (place>=googlePins.length)
      {
        var request = {
          query: locations[place]
        };

        var requesta = {
          placeId: globalID
        };

        // Actually searches the Google Maps API for location data and runs the callback
        // function with the search results after each search.

        service.textSearch(request, callback);

        // service.agetDetails(requesta, callback);
      }
      else
      {
          for (var i=0; i<googlePins.length; i++)
          {
            if (googlePins[i].name==locations[place])
              createMapMarker(i);
          }
          //createMapMarker(place);
      }
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
  //window.addEventListener('load', initializeMap);
// google.maps.event.addDomListener(window, 'load', initialize);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  // Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});