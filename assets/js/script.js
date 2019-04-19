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


        //Creating the queryURL for Weather

        queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&units=imperial&lat="+lat+"&lon="+lon;
        console.log(queryURL);

        //Making the AJAX request to the Weather API

        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response){

          //Response should show city and country where the user is, current temperature, minimum and maximum temperature for the day, sunrise and sunset time, wind speed, humidity, and what to expect during the day (ex: clouds).

          var sunrise = moment.unix(response.sys.sunrise).format("hh:mm A");
          var sunset = moment.unix(response.sys.sunset).format("hh:mm A");

          console.log("You're in " + response.name + ", " + response.sys.country);
          console.log("Today, the sun will rise at " + sunrise + " and set at " + sunset);
          console.log("Wind speed is " + response.wind.speed + "mph");
          console.log("Right now, the temperature is " + response.main.temp + "F");
          console.log("The minimum for today is " + response.main.temp_min + "F and the maximum is " + response.main.temp_max + "F");
          console.log("Humidity is: " + response.main.humidity + "%");
          
          var weatherForecast = response.weather[0].main.toLowerCase(); 

          if (weatherForecast === "clear") {
            console.log("Be prepared for: " + weatherForecast + " weather.");
          } else {
            console.log("Be prepared for: " + weatherForecast);
          }

    
        })
    }

    $("button").on("click", function(){

      event.preventDefault(event);

      var city = $("input").val().toLowerCase();

      queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&units=imperial&q="+city;
      console.log(queryURL);

      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){

        var sunrise = moment.unix(response.sys.sunrise).format("hh:mm A");
        var sunset = moment.unix(response.sys.sunset).format("hh:mm A")
    
        console.log(sunrise);
        console.log(sunset);

        var firstChar = city.charAt(city[0]).toUpperCase();
        newCity = city.replace(city[0], firstChar);

        console.log("You're in " + newCity + ", " + response.sys.country);
        console.log("Today, the sun will rise at " + sunrise + " and set at " + sunset);
        console.log("Wind speed is " + response.wind.speed + "mph");
        console.log("Visibility is " + response.visibility + " meters");
        console.log("Right now, the temperature is " + response.main.temp + "F");
        console.log("The minimum for today is " + response.main.temp_min + "F and the maximum is " + response.main.temp_max + "F");
        console.log("Humidity is: " + response.main.humidity + "%");

        var weatherForecast = response.weather[0].main.toLowerCase(); 

        if (weatherForecast === "clear") {
          console.log("Be prepared for: " + weatherForecast + " weather.");
        } else {
          console.log("Be prepared for: " + weatherForecast);
        }
        
      })
      
    })

    
    
   getUserLocation();

   

})