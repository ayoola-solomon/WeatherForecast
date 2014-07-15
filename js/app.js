$(function(){

	var DEG = 'c'; // c for celsius, f for fahrenheit

	var weatherDiv = $('#weather'),
		scroller = $('#scroller'),
		location = $('p.location');

	// Location Function

	function locationSuccess(position) {

	try{

		var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast?lat='+ lat +
								'&lon='+ lon +'&callback=?'

			$.getJSON(weatherAPI, function(response){

				var d = new Date();

				// Get the offset from UTC (turn the offset minutes into ms)
				var offset = d.getTimezoneOffset()*60*1000;
				var city = response.city.name;
				var country = response.city.country;

				$.each(response.list, function(){
					// "this" holds a forecast object

					// Get the local time of this forecast (the api returns it in utc)
					var localTime = new Date(this.dt*1000 - offset);

					addWeather(
						this.weather[0].icon,
						moment(localTime).calendar(),	// We are using the moment.js library to format the date
						this.weather[0].main + ' <b>' + convertTemperature(this.main.temp_min) + '°' + DEG +
												' / ' + convertTemperature(this.main.temp_max) + '°' + DEG+'</b>'
					);

				});

				// Add the location to the page
				location.html(city +', <b>'+country+'</b>');

				weatherDiv.addClass('loaded');

				// Set the slider to the first slide
				showSlide(0);
			});

	}
	catch(e){
		showError("We can't find information about your city!");
		window.console && console.error(e);
	}
}

	// Add Weather Function

	function addWeather(icon, day, condition){

		var markup = '<li>'+
			'<img src="img/icons/'+ icon +'.png" />'+
			' <p class="day">'+ day +'</p> <p class="cond">'+ condition +
			'</p></li>';

		scroller.append(markup);
	}

	/* Handling the previous / next arrows */

	var currentSlide = 0;
	weatherDiv.find('a.previous').click(function(e){
		e.preventDefault();
		showSlide(currentSlide-1);
	});

	weatherDiv.find('a.next').click(function(e){
		e.preventDefault();
		showSlide(currentSlide+1);
	});

	$(document).keydown(function(e){
		switch(e.keyCode){
			case 37: 
				weatherDiv.find('a.previous').click();
			break;
			case 39:
				weatherDiv.find('a.next').click();
			break;
		}
	});

	function showSlide(i){
		var items = scroller.find('li');

		if (i >= items.length || i < 0 || scroller.is(':animated')){
			return false;
		}

		weatherDiv.removeClass('first last');

		if(i == 0){
			weatherDiv.addClass('first');
		}
		else if (i == items.length-1){
			weatherDiv.addClass('last');
		}

		scroller.animate({left:(-i*100)+'%'}, function(){
			currentSlide = i;
		});
	}

	/* Error handling functions */

	function locationError(error){
		switch(error.code) {
			case error.TIMEOUT:
				showError("A timeout occured! Please try again!");
				break;
			case error.POSITION_UNAVAILABLE:
				showError('We can\'t detect your location. Sorry!');
				break;
			case error.PERMISSION_DENIED:
				showError('Please allow geolocation access for this to work.');
				break;
			case error.UNKNOWN_ERROR:
				showError('An unknown error occured!');
				break;
		}

	}

	function convertTemperature(kelvin){
		// Convert the temperature to either Celsius or Fahrenheit:
		return Math.round(DEG == 'c' ? (kelvin - 273.15) : (kelvin*9/5 - 459.67));
	}

	function showError(msg){
		weatherDiv.addClass('error').html(msg);
	}


	// Beginning of the map
	var map = new GMaps({
      div: '#map',
      lat:  51.503324,
      lng: -0.119543,
      zoom: 10,
      panControl : false,
		click: function(e){

			lat;
			lon;
		}
	});
});