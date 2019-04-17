$(document).ready(function() {

    //Getting Geolocation of user

    var lat;
    var lon;
    var queryURL;
    
    function getUserLocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showUserPosition);
          } else {
            console.log("Geolocation is not supported by this browser.");
          }
    }

    function showUserPosition(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log("Latitude: " + lat + 
        " and Longitude: " + lon);

        queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&lat="+lat+"&lon="+lon;
        console.log(queryURL);
    }

    //Creating the queryURL for Weather

    
    
   getUserLocation();

   

})