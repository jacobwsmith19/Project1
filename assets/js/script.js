$(document).ready(function () {

  //Global vars
  var lat;
  var lon;
  var queryURL;
  var currentCity;

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
    queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&units=imperial&lat=" + lat + "&lon=" + lon;

    //Then, the page will run an AJAX request to the Weather API and return the results.
    getWeatherData();
  }

  //The user can also choose to input the city name manually. In this case a new queryURL will be created.
  $("button").on("click", function () {
    event.preventDefault(event);

    var city = $("input").val().toLowerCase();
    queryURL = "https://api.openweathermap.org/data/2.5/weather?appid=166a433c57516f51dfab1f7edaed8413&units=imperial&q=" + city;

    //Then, the page will run an AJAX request to the Weather API and return the results.
    getWeatherData();
  })

  //AJAX request to get data from the Weather API.
  function getWeatherData() {
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function (response) {
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
      
      generateNews();
    });
  }

  getUserLocation();

  // Generates 3 headlines using the geo location city name as a keyword
  function generateNews() {

    var newsURL = buildNewsURL();
    $.ajax({
      url: newsURL,
      method: "GET",
    }).then(updatePage);

    // Ajax request using current city as a keyword
    function buildNewsURL() {
      var newsURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
      var newsParams = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };
      newsParams.q = currentCity;

      console.log("---------------\nURL: " + newsURL + "\n---------------");
      console.log(newsURL + $.param(newsParams));

      return newsURL + $.param(newsParams);
    }
    // Generates 3 articles and adds them to the page
    function updatePage(NYTData) {
      var numArticles = 3
      console.log(NYTData);

      for (var i = 0; i < numArticles; i++) {
        var article = NYTData.response.docs[i];
        var articleCount = i + 1;
        var $articleList = $("<ul>");

        $articleList.addClass("list-group");
        $("body").append($articleList);

        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
          $articleListItem.append(
            "<span class='label label-primary'>" +
            "(" + articleCount + ")" +
            "</span>" +
            "<span id='article-title'> " +
            headline.main +
            "</span>",
          );
        }

        var byline = article.byline;

        if (byline && byline.original) {
          $articleListItem.append("<div id='article-byline'>" + byline.original + "</div>");
        }

        var pubDate = article.pub_date;
        if (pubDate) {
          $articleListItem.append("<div id='article-date'>" + article.pub_date + "</div>");
        }

        $articleListItem.append(
          "<a href='" + article.web_url + "'>" + article.web_url + "</a>",
        );

        $articleList.append($articleListItem);
      } // close for loop
    } // close updatePage function
  }; // close generateNews function

  //Carousel controls

  // Enable Carousel Indicators
  $(".item1").click(function () {
    $("#myCarousel").carousel(0);
  });
  $(".item2").click(function () {
    $("#myCarousel").carousel(1);
  });
  $(".item3").click(function () {
    $("#myCarousel").carousel(2);
  });
  $(".item4").click(function () {
    $("#myCarousel").carousel(3);
  });

  // Enable Carousel Controls
  $(".left").click(function () {
    $("#myCarousel").carousel("prev");
  });
  $(".right").click(function () {
    $("#myCarousel").carousel("next");
  });

  //

})