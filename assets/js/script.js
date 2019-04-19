$(document).ready(function() {
    //Global vars
    var lat;
    var lon;
    var queryURL;
    
    //Getting Geolocation of user
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showUserPosition);
          }
    }

    //Once the user clicks "Allow", lat and lon will be defined and queryURL for Weather will be created.
    function showUserPosition(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&units=imperial&lat="+lat+"&lon="+lon;    
      
        //Then, the page will run an AJAX request to the Weather API and return the results.
        getWeatherData();
    }

    //The user can also choose to input the city name manually. In this case a new queryURL will be created.
    $("button").on("click", function(){
      event.preventDefault(event);

      var city = $("input").val().toLowerCase();
      queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&units=imperial&q="+city;
      
      //Then, the page will run an AJAX request to the Weather API and return the results.
      getWeatherData();
    })

    //AJAX request to get data from the Weather API.
    function getWeatherData() {
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response){
        var sunrise = moment.unix(response.sys.sunrise).format("hh:mm A");
        var sunset = moment.unix(response.sys.sunset).format("hh:mm A");
        var weatherForecastResponse = response.weather[0].main.toLowerCase(); 
  
        if (weatherForecastResponse === "clear") {
          weatherForecast = `
          <p>Be prepared for: ${weatherForecastResponse} weather.</p>
          `
        } else {
          weatherForecast = `
          <p>Be prepared for: ${weatherForecastResponse}.</p>
          `
        }
  
        var weatherText = `
        <div>
        <p>You're in ${response.name}, ${response.sys.country}!</p>
        <p>Today, the sun will rise at ${sunrise} and set at ${sunset}.</p>
        <p>Wind speed is ${response.wind.speed}mph.</p>
        <p>Right now, the temperature is ${response.main.temp}F.</p>
        <p>The minimum for today is ${response.main.temp_min}F and the maximum is ${response.main.temp_max}F.</p>
        <p>Humidity is: ${response.main.humidity}%</p>
        ${weatherForecast}
        </div>
        `   
  
        $("body").append(weatherText);
      });
    }

   getUserLocation();

})