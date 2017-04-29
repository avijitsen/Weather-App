var count = 0;

function noop() {}

function jsonp(url, opts, fn) {
    if ('function' == typeof opts) {
        fn = opts;
        opts = {};
    }
    if (!opts) opts = {};

    var prefix = opts.prefix || '__jp';

    var id = opts.name || (prefix + (count++));

    var param = opts.param || 'callback';
    var timeout = null != opts.timeout ? opts.timeout : 60000;
    var enc = encodeURIComponent;
    var target = document.getElementsByTagName('script')[0] || document.head;
    var script;
    var timer;


    if (timeout) {
        timer = setTimeout(function() {
            cleanup();
            if (fn) fn(new Error('Timeout'));
        }, timeout);
    }

    function cleanup() {
        if (script.parentNode) script.parentNode.removeChild(script);
        window[id] = noop;
        if (timer) clearTimeout(timer);
    }

    function cancel() {
        if (window[id]) {
            cleanup();
        }
    }

    window[id] = function(data) {
        cleanup();
        if (fn) fn(null, data);
    };

    url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);
    url = url.replace('?&', '?');

    // create script
    script = document.createElement('script');
    script.src = url;
    target.parentNode.insertBefore(script, target);

    return cancel;
}

$(document).ready(function() {

    var watchID = navigator.geolocation.watchPosition(function(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var skycons = new window.Skycons({
            color: "white"
        })
        var location = document.querySelector(".location_name");
        var upozila = document.querySelector(".location_upozila")
        var country = document.querySelector(".country")
        var weather = document.querySelector(".weather")
        var tempo = document.querySelector(".weather_box")
        var celcius = document.querySelector(".calcius")
        var status = document.querySelector(".status")
        var icon = document.querySelector("#canvas")
        var canvas_box = document.querySelector(".canvas_box")
        var time2 = document.querySelector(".time2")
        var country2 = document.querySelector(".country2")
        var spinner = document.querySelector(".spinner")

        var locationapikey = 'AIzaSyDT82gfmcqG20_VNOhS49LNSzai_24_Uh4';
        var apiKey = '4e944a51bda86d0587e8142e496f527b';

        baseURL = 'https://api.darksky.net/forecast/' + apiKey + "/" + lat + "," + long;
        locationAPI = 'https://maps.googleapis.com/maps/api/geocode' + "/json?latlng=" + lat + "," + long + "&key=" + locationapikey;

        jsonp(baseURL, function(err, data) {
            var showingF;

            function farenhite() {
                showingF = true;
                weather.innerHTML = data.currently.temperature.toFixed(2) + "°" + " f";
            }
            farenhite();
            status.innerHTML = data.currently.summary;
            var skyicon = data.currently.icon.toUpperCase().replace(/-/g, '_')
            skycons.add(icon, window.Skycons[skyicon])
            skycons.play()

            var temporary = data.currently.temperature.toFixed(2);
            tempo.addEventListener("click", function(y) {
                if (showingF) {
                    showingF = false
                    var cal = ((temporary - 32) * .5556).toFixed(2);
                    weather.innerHTML = cal + "°" + " c";
                } else {
                    farenhite();
                }
            })
            axios.get(locationAPI)
                .then(function(x) {

                    location.innerHTML = x.data.results[1].address_components[0].short_name;
                    upozila.innerHTML = x.data.results[1].address_components[1].short_name;
                    country.innerHTML = x.data.results[1].address_components[4].long_name;
                    spinner.style.display = "none";
                    canvas_box.style.display = "block";
                    tempo.style.display = "block";
                    time2.style.display = "block";
                })

            function updateTime() {
                var currentTime = new Date();
                var minutes = currentTime.getMinutes();
                var time = document.querySelector("#time")
                var hours = currentTime.getHours();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (hours > 12) {
                    hours = hours - 12;
                    time.innerHTML = "0" + hours + ":" + minutes + " PM";
                } else {
                    time.innerHTML = "0" + hours + ":" + minutes + " AM";
                }
                var t = setTimeout(function() {
                    updateTime()
                }, 500)
            }
            updateTime();
        })
    });
});
