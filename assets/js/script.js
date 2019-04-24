$(document).ready(function () {



  //Global vars
  var database = firebase.database();
  var auth = firebase.auth();
  var provider = new firebase.auth.GoogleAuthProvider();
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
  $("#search").on("click", function () {
    event.preventDefault(event);
    $("#newsSum").html("");
    $("#newsExpanded").html("");

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
      //Detailed view of the weather
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

      //Appends weather text to the body
      $("#weatherFull").html(weatherText);

      
      //City displayed on page 
      var summaryText =
        ` <h3>
   Here's a summary for today in: ${response.name}
   </h3> `
      $("#summaryText").html(summaryText)


      //Summary text of the weather 
      var weatherSum = `
   <div>

   <h2> The temperature is ${response.main.temp} F
   ${weatherForecast} <h2>
   </div>`
      //Replaces the default text and writes the summary to the Carousel
      $("#weatherSum").html(weatherSum)




      /////////////////////////////////////////NEWS///////////////////////////////////////////////////////////////////////////


      //
      currentCity = response.name;
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
      var numArticles = 5
      console.log(NYTData);

      for (var i = 0; i < numArticles; i++) {
        var article = NYTData.response.docs[i];
        var articleCount = i + 1;
        var $articleList = $("<ul>");
        var pubDate = NYTData.response.docs[i].pub_date;
        var formattedDate = moment(pubDate).format('MMM D, YYYY');

        $articleList.addClass("list-group");

        $("#placeholderText").html("")
        $("#newsExpanded").append($articleList);
        var newsSum = `
          <h7>Here's the most recent headline from the New York Times for your city <h7> 
          <h2> ${NYTData.response.docs[0].lead_paragraph} </h2>

          <h7>Click <a href =${NYTData.response.docs[0].web_url}> here</a> for the full article<h7>
          <br>
          Or scroll down to see more articles
          `
        $("#newsSum").html(newsSum)



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
          $articleListItem.append("<div id='article-date'>" + formattedDate + "</div>");
        }

        $articleListItem.append(
          "<a href='" + article.web_url + "'>" + article.web_url + "</a>",
        );

        $articleList.append($articleListItem);

      } // close for loop
    } // close updatePage function
  }; // close generateNews function
// littoral for greeting in nav bar
function welcome(name) {
  return`<span class="temp">Welcome   </span>  ${name}  <span class="temp">   Enjoy your day.</span>`
};// end of littoral
// signup function
$("#signup").on("click",function() {
  $('#signupm').modal('show');
  $("#glogsu").on("click",function(event){
    $('#signupm').modal('hide');
    console.log("googleclick");
    auth.signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      var name = result.additionalUserInfo.profile.name;
      userPrefs();
      document.getElementById(`login`).hidden = true;
      document.getElementById(`signup`).hidden = true;
      $("#greeting").html(welcome(name)); 

      getUserCalendar();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    }); 
  }); //end of google login

  $("#submit").on("click", function(event) {
      event.preventDefault(event);    
      email = $("#signup-email").val().trim();
      passWrd = $("#signup-pswd").val().trim();
    auth.createUserWithEmailAndPassword(email,passWrd).then(function(cred) {
      userPrefs();
      document.getElementById(`login`).hidden = true;
      document.getElementById(`signup`).hidden = true; 
      $("#greeting").html(welcome(email));

      getUserCalendar();
  });// end of authentication to firebase  
});//end of new user function
});// end of signup click function

// login function
$("#login").on("click",function(event) {
  $('#loginmdl').modal('show');
  $("#glogli").on("click",function(event){
    console.log("googleclick");
    auth.signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      var name = result.additionalUserInfo.profile.name;
      document.getElementById(`login`).hidden = true;
      document.getElementById(`signup`).hidden = true;
      $("#greeting").html(welcome(name));

      getUserCalendar();
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    }); 
  }); //end of google login
  $("#submit1").on("click",function() {
      event.preventDefault(event);
      email = $("#login-email").val().trim();
      passWrd = $("#login-pswd").val().trim();
      auth.signInWithEmailAndPassword(email,passWrd).then(function(cred){

        console.log("user logged in");// shows user credential returned from firebase
          document.getElementById(`login`).hidden = true;
          document.getElementById(`signup`).hidden = true;
          $("#greeting").html(welcome(email)); 
          
          getUserCalendar();
      }); // end of login function
});//end of login function
});// end of login click function

//signout function
$("#signout").on("click",function() {
  event.preventDefault(event);
  auth.signOut().then(function() {console.log("user logged out");
  document.getElementById(`login`).hidden = false;
  document.getElementById(`signup`).hidden = false;
  $("#greeting").html("");
  $("#calExpanded").empty();
});    

});// end of signout click function

//user preferences function for signup
function userPrefs() {
  $("#preferences").modal('show');
  $("#submit2").on("click",function() {
      event.preventDefault(event);


      var srchParam = [];
      var param1 = [];
      var address = $("#defaultAddress").val();
      srchParam.push($('input[name=radio1]:checked').val());
      srchParam.push($('input[name=radio2]:checked').val());
      srchParam.push($('input[name=radio3]:checked').val());
      srchParam.push($('input[name=radio4]:checked').val());
      srchParam.push($('input[name=radio5]:checked').val());
      srchParam.map(function (value, i) {
        if (value !== undefined) {
          console.log(value);
          param1.push(value);
        }
      });
      database.ref().push({
        Address: address,
        NewsParam: param1
      });//end firebase save    
    }); // end of prefernce input function
  };//end of user preferences function


//Adding Calendar
var userEmail;
var userInput;
var email;

function getUserCalendar() {

  userInput = email.split("@");

  userEmail = userInput[0];

    var iframe = `
    <iframe
      src="https://calendar.google.com/calendar/embed?src=${userEmail}%40gmail.com&ctz=America%2FChicago"
      style="border: 0"
      width="800"
      height="600"
      frameborder="0"
      scrolling="no"
    ></iframe>

    `

    if (userInput.includes("gmail.com")) {

      $("#calExpanded").html(iframe);

    }  
}

// Client ID and API key from the Developer Console
var CLIENT_ID =
"861805811444-ou2fkh3vkq7p5irnnb3nnco9c56m742n.apps.googleusercontent.com";
var API_KEY = "AIzaSyB2o7vTO8IbcRCnIcu9LgJFSyV1iPeFZmY ";

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
*  On load, called to load the auth2 library and API client library.
*/
function handleClientLoad() {
gapi.load("client:auth2", initClient);
}

/**
*  Initializes the API client library and sets up sign-in state
*  listeners.
*/
function initClient() {
gapi.client
  .init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  })
  .then(
    function() {
      // Listen for sign-in state changes.
      gapi.auth2
        .getAuthInstance()
        .isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    },
    function(error) {
      appendPre(JSON.stringify(error, null, 2));
    }
  );
}

/**
*  Called when the signed in status changes, to update the UI
*  appropriately. After a sign-in, the API is called.
*/
function updateSigninStatus(isSignedIn) {
if (isSignedIn) {
  authorizeButton.style.display = "none";
  signoutButton.style.display = "block";
  listUpcomingEvents();
} else {
  authorizeButton.style.display = "block";
  signoutButton.style.display = "none";
}
}

/**
*  Sign in the user upon button click.
*/
function handleAuthClick(event) {
gapi.auth2.getAuthInstance().signIn();
}

/**
*  Sign out the user upon button click.
*/
function handleSignoutClick(event) {
gapi.auth2.getAuthInstance().signOut();
}

/**
* Append a pre element to the body containing the given message
* as its text node. Used to display the results of the API call.
*
* @param {string} message Text to be placed in pre element.
*/
function appendPre(message) {
var pre = document.getElementById("content");
var textContent = document.createTextNode(message + "\n");
pre.appendChild(textContent);
}

/**
* Print the summary and start datetime/date of the next ten events in
* the authorized user's calendar. If no events are found an
* appropriate message is printed.
*/
function listUpcomingEvents() {
gapi.client.calendar.events
  .list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: "startTime"
  })
  .then(function(response) {
    var events = response.result.items;
    appendPre("Upcoming events:");

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        appendPre(event.summary + " (" + when + ")");
      }
    } else {
      appendPre("No upcoming events found.");
    }
  });
}

});//end of document ready