$(function() {
   var loc, link;
   var deg = "f", weatherType = "conditions", degLong = "fahrenheit";
   
   $("#dialog").dialog({
      autoOpen : false,
      resizable : false,
      height : 230,
      modal : true,
      buttons : {
         Close : function() {
            $(this).dialog("close");
         }
      }
   });
   
   $('#dialogbtn').button().click(function() {
      $('div#dialog').dialog('open');
   });
   
   $("#type").selectmenu();
   $('#temp').on('change', function() {
      deg = $('#temp').val()[0];
      if (loc!=null) 
         getWeather();
   });
   
   weatherType = $('#type').on('change', function() {});
   $("#resultBtn").button().click(function() {
      if (loc!=null) 
         getWeather();
   });
   
   getWeather = function() {
      $("#results").text("");
      $.ajax({
         url : "http://api.wunderground.com/api/dc49dc1b20e24664/"
          + weatherType.val() + link + ".json",
         dataType : "jsonp",
         success : function(parsed_json) {
            if (weatherType.val() == "conditions") {
               var location = parsed_json["current_observation"]
                ['display_location']['full'];
               var humid = parsed_json['current_observation']["relative_humidity"];
               var temp = parsed_json['current_observation']['temp_' + deg];
               var weath = parsed_json['current_observation']["weather"];
               var wind = parsed_json['current_observation']["wind_string"];
               var icon = parsed_json['current_observation']["icon_url"];
               
               $("#results").html( "Current weather in <br>" + location
                + " is:<br> " + weath + "<image src="+icon+ ">"+ temp + 
                " degrees " + deg + "<br>" + "Humidity: " +humid+ 
                "<br> Wind: " +wind);
            
            } else if (weatherType.val() == "forecast") {
               var cond = parsed_json.forecast.simpleforecast.forecastday;
               
               (deg === "f") ? degLong = "fahrenheit" : degLong = "celsius";
               $("#results").append(loc + "<br>");
               
               for ( var i = 0; i < cond.length; i++) {
                  $("#results").append("" + cond[i]["date"]["weekday"] + 
                   ": <br>");
                  $("#results").append("Conditions: " + cond[i]["conditions"] +
                    " <br>");
                  $("#results").append("High: " + cond[i]["high"][degLong] + 
                   deg + " ");
                  $("#results").append("Low: " + cond[i]["low"][degLong] + deg 
                   + " <br>");
               }
            } else if (weatherType.val() == "alerts") {
               var alerts = parsed_json.alerts;
               
               $("#results").append(loc + "<br>");
               for ( var i = 0; i < alerts.length; i++) {
                  console.log(alerts[i]);
                  $("#results").append(alerts[i]["message"]);
               }
               
               if (alerts.length == 0) {
                  $("#results").append("No Current Alerts");
               }
            } else if (weatherType.val() == "hourly") {
               var hourly = parsed_json.hourly_forecast;
              
               $("#results").append(loc + "<br>");
               for ( var i = 0; i < hourly.length; i++) {
                  $("#results").append(hourly[i]["FCTTIME"]["civil"] + ": ");
                  $("#results").append(hourly[i]["condition"] + " ");
                  $("#results").append(hourly[i]["temp"][(deg === "f") ? 
                   "english" : "metric"] + deg + "<br>");
               }
            }
         }
      });
   };
   $("#locationField").autocomplete({
      delay: 50,
      minLength : 3,
      source : function(request, response) {
         $.ajax({
            url : "http://autocomplete.wunderground.com/aq",
            dataType : "jsonp",
            jsonp : "cb",
            data : {
               format : "json",
               query : $("#locationField").val()
            },
            success : function(data) {
               var i;
               var da = [];
               
               for (i in data.RESULTS) {
                  da.push({
                     link : data.RESULTS[i].l,
                     label : data.RESULTS[i].name
                  });
               }
               response(da);
            }
         });
      },
      select : function(event, ui) {
         link = ui.item.link;
         loc = ui.item.label;
         $('#locationField').val(loc);
      }
   });
});