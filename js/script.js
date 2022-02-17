console.log("systems are go");

function changeBG(sunset, sunrise){
    // get the current hour and minute
    let currentHour = new Date().getHours();
    let currentMinute = new Date().getMinutes();
    console.log(currentHour);
    console.log(sunset, sunrise);

    if(currentHour < sunset[0]){
        console.log("It is daytime");
        $("#page").addClass("dayBG");
        $(".widget-r__weather").css("color", "#6ad0ff")
    } else if( (currentHour > sunset[0]) || (currentHour < sunrise[0]) ){
        console.log("It is nighttime");
        $("#page").addClass("nightBG");
        $(".widget-r__weather").css("color", "#17185e")
    } else {
        $("#page").addClass("pinkBG");
    }
}

function runAjax(lat, lon, sunset, sunrise){

    // access OpenWeather API and provide geolocation
    let weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;

    $.ajax({
        method: "GET",
        url: weatherUrl,
        success: function(data){
            // run function to fill in HTML data
            fillData(data);
        }
    })

}

function getLocation(){
    // calculate current GPS position
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(storePosition);
    } else {
        document.write("Geolocation not supported :-(");
    }
}

function storePosition(position){
    // store position coordinates in variables
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    // calculate exact sunset and sunrise times using sun.js library
    let sunsetExact = new Date().sunset(lat, lon);
    let sunriseExact = new Date().sunrise(lat, lon);

    // get useable integers from sunset and sunrise times
    let sunset = [sunsetExact.getHours(), sunsetExact.getMinutes()];
    let sunrise = [sunriseExact.getHours(), sunriseExact.getMinutes()];
    console.log(sunset);
    console.log(sunrise);

    // run weather data API
    runAjax(lat, lon);
    changeBG(sunset, sunrise);
}

getLocation();

function fillData(data){
    console.log(data);
    console.log(data.name);

    // fill in widget data with readable weather information
    $("#currentLocation").html(data.name + ",");
    $("#currentCountry").html(data.sys.country);
    $("#currentHumidity").html("Humidity: " + data.main.humidity + "%");
    $("#currentHigh").html(Math.floor(data.main.temp_max) + "°c");
    $("#currentLow").html(Math.floor(data.main.temp_min) + "°c");

    // determine what compass direction wind is coming from
    // wind direction names following this guide: https://www7.ncdc.noaa.gov/climvis/help_wind.html
    $("#currentTemp").html(Math.floor(data.main.temp) + "°c");
    if( (data.wind.deg >= 349) || (data.wind.deg <= 11) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Northerly");
    } else if ( (data.wind.deg >= 12) && (data.wind.deg <= 78) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Northeasterly");
    } else if ( (data.wind.deg >= 79) && (data.wind.deg <= 101) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Easterly");
    } else if( (data.wind.deg >= 102) && (data.wind.deg <= 168) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Southeasterly");
    } else if( (data.wind.deg >= 169) && (data.wind.deg <= 191) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Southerly");
    } else if( (data.wind.deg >= 192) && (data.wind.deg <= 258) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Southwesterly");
    } else if( (data.wind.deg >= 259) && (data.wind.deg <= 281) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Westerly");
    } else if( (data.wind.deg >= 291) && (data.wind.deg <= 348) ){
        $("#currentWind").html((Math.floor(data.wind.speed)) + "km/h " + "Northwesterly");
    } else {
        $("#currentWind").html("Unable to get wind data.");
    }

    // get appropriate weather icon
    for(let i = 0; i < data.weather.length; i++){
        $("#currentWeather").html(data.weather[i].description);
        let iconUrl = "http://openweathermap.org/img/wn/" + `${data.weather[i].icon}` + "@4x.png";
        $("#currentWeatherIcon").css("background-image", 'url(' + iconUrl + ')');
    }
}