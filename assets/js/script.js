
var currentCity;
// Geo location
function getLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
    console.log("Geolocation is not supported by this browser.");
    }
}  
function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude);  
    console.log("Longitude: " + position.coords.longitude);
    // Fixes coordinates to be used in MapQuest ajax
    var longitude = parseFloat(position.coords.longitude).toFixed(6);
    var latitude = parseFloat(position.coords.latitude).toFixed(6);
    console.log("Longitude for MQ API:" + longitude);
    console.log("Latitude for MQ API:" + latitude);

    var MapQuestURL = "https://www.mapquestapi.com/geocoding/v1/reverse?key=UUzYROIZzAoKj4SM7k4W8tecGNoMFCXb&location=" + latitude + "," + longitude;
    console.log(MapQuestURL);

    // MapQuest API to return city name
    $.ajax({
        url: MapQuestURL,
        method: "GET"
      }).then(function(response) {
      currentCity = response.results["0"].locations["0"].adminArea5;
      console.log(currentCity);
      generateNews();
      });
}

function generateNews(){

  var queryURL = buildQueryURL();
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(updatePage);
  
  // Ajax request using current city as a keyword
  function buildQueryURL() {
      var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
      var queryParams = { "api-key": "R1a31F4tBjCUaM2ho8GtIFsrSdtXt30M" };
      queryParams.q = currentCity;
    
      console.log("---------------\nURL: " + queryURL + "\n---------------");
      console.log(queryURL + $.param(queryParams));
      
      return queryURL + $.param(queryParams);
    }
  // Generates 5 articles and adds them to the page
  function updatePage(NYTData) {
      var numArticles = 5
      console.log(NYTData);
    
      for (var i = 0; i < numArticles; i++) {
        var article = NYTData.response.docs[i];
        var articleCount = i + 1;
        var $articleList = $("<ul>");
        
        $articleList.addClass("list-group");
        $("#article-section").append($articleList);
    
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");
    
        if (headline && headline.main) {
          $articleListItem.append(
            "<span class='label label-primary'>" +
              articleCount +
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
    
        var section = article.section_name;
        if (section) {
          $articleListItem.append("<div id='article-section'>Section: " + section + "</div>");
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