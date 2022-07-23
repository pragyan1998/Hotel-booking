let urlParams = new URLSearchParams(window.location.search);
const API_URL = "https://travel-advisor.p.rapidapi.com/";
const travelAdvisorHost = "travel-advisor.p.rapidapi.com";
const travelAdvisorKey = "7a54bb848fmshfb488ece4937a3fp167955jsn3f87ad320431";

//this function is used to initialize the google map and place the markers at the position of the hotel from the API
let initMap = locations => {
    let center = { lat: parseFloat(locations[0][1]), lng: parseFloat(locations[0][2]) };
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: center
    });
    let infoWindow = new google.maps.InfoWindow({});
    let marker, count;
    for (count = 0; count < locations.length; count++) {
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[count][1], locations[count][2]),
            map: map,
            title: locations[count][0]
        });
        google.maps.event.addListener(marker, 'click', ((marker, count) => {
            return function () {
                infoWindow.setContent(locations[count][0]);
                infoWindow.open(map, marker);
            }
        })(marker, count));
    }
}

let initList = hotelList => {
    let hotelListEle = document.getElementById('hotel-list');
    hotelList.forEach(hotel => {
        let hotelLinkElement = document.createElement("a");
        hotelLinkElement.setAttribute("href", `detail.html?id=` + hotel.result_object.location_id);
        hotelListEle.appendChild(hotelLinkElement);
        let hotelContain = document.createElement("div");
        hotelContain.setAttribute("class", "hotel");
        hotelLinkElement.appendChild(hotelContain);
        let hotelImage = "<img src=" + hotel.result_object.photo.images.medium.url + " alt='" + hotel.result_object.name + "' class='hotel-image-small'/>";
        hotelContain.innerHTML = hotelImage;
        let hotelDetailContain = document.createElement("div");
        hotelDetailContain.setAttribute("class", "hotel-name-rating");
        hotelContain.appendChild(hotelDetailContain);
        let hotelName = hotel.result_object.name;
        if (hotelName.split(' ').length > 3) {
            hotelDetailContain.innerHTML = "<h4>" + hotel.result_object.name + "</h4>";
            hotelDetailContain.innerHTML += "<div id='rating'>" + hotel.result_object.rating + " <span class='fa fa-star checked'></span></div>";
            hotelDetailContain.innerHTML += "<p style='font-size: small'>" + hotel.result_object.address + "</p>";
        }
        else {
            hotelDetailContain.innerHTML = "<h3>" + hotel.result_object.name + "</h3>";
            hotelDetailContain.innerHTML += "<div id='rating'>" + hotel.result_object.rating + " <span class='fa fa-star checked'></span></div>";
            hotelDetailContain.innerHTML += "<p>" + hotel.result_object.address + "</p>";
        }
    });
}

//This function is used to display the list of hotels in a particular city fetched from the API 
let fetchHotelListAPI = () => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            let result = JSON.parse(this.responseText).data;
            let locations = [];
            hotelList = result.filter(item => item.result_type == "lodging");
            hotelList.forEach(item => {
                locations.push([item.result_object.name + "<br><a href=\"detail.html?id=" + item.result_object.location_id + "\">Book Hotel</a>", item.result_object.latitude, item.result_object.longitude]);
            });
            initList(hotelList);
            initMap(locations);
            disableLoader();
        }
    });

    xhr.open("GET", API_URL + "locations/search?lang=en_US&limit=100&query=" + urlParams.get('city'));
    xhr.setRequestHeader("x-rapidapi-host", travelAdvisorHost);
    xhr.setRequestHeader("x-rapidapi-key", travelAdvisorKey);

    xhr.send();
}

fetchHotelListAPI();