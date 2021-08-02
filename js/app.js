// Write your javascript code here
//Selectors

const searchInput = document.querySelector(".weather__search");
const city = document.querySelector(".weather__city");
const day = document.querySelector(".weather__day");
const humidity = document.querySelector(".weather__indicator--humidity>.value");
const wind = document.querySelector(".weather__indicator--wind>.value");
const pressure = document.querySelector(".weather__indicator--pressure>.value");
const image = document.querySelector(".weather__image");
const temperature = document.querySelector(".weather__temperature>.value");
const foreCastBlock = document.querySelector(".weather__forecast");

// Image Icon

const weatherImages = [
  {
    url: "./images/clear-sky.png",
    ids: [800],
  },
  {
    url: "./images/broken-clouds.png",
    ids: [803],
  },
  {
    url: "./images/few-clouds.png",
    ids: [801],
  },
  {
    url: "./images/mist.png",
    ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
  },
  {
    url: "./images/rain.png",
    ids: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
  },
  {
    url: "./images/scattered-clouds.png",
    ids: [802],
  },
  {
    url: "./images/shower-rain.png",
    ids: [300, 301, 302, 310, 311, 312, 313, 314, 321],
  },
  {
    url: "./images/snow.png",
    ids: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
  },
  {
    url: "./images/thunderstorm.png",
    ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
  },
];

//API Endpoints

const weatherApiKey = "d65bfc3c54072a79e0d7ec53476dc7ac";
const weatherEndPoint = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${weatherApiKey}`;
const forecastEndPoint = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${weatherApiKey}`;

//Data fetch from server
// Get weather data by city name

const getWeatherDataByCity = async (city) => {
  const endpoint = `${weatherEndPoint}&q=${city}`;
  let request = await fetch(endpoint);
  let result = await request.json();
  return result;
};

// Get Forecast data by city cityName

const getForecastDataByCity = async (id) => {
  const endPoint = `${forecastEndPoint}&id=${id}`;
  const result = await fetch(endPoint);
  const forecast = await result.json();
  const forecastlist = forecast.list;
  const dailyTemp = [];
  forecastlist.forEach((day) => {
    let date = new Date(day.dt_txt.replace(" ", "T"));
    let hours = date.getHours();
    if (hours === 12) {
      dailyTemp.push(day);
    }
  });
  updateForecast(dailyTemp);
};

// Search Functionality

searchInput.addEventListener("keydown", async (e) => {
  const cityName = searchInput.value;
  if (e.keyCode === 13) {
    let data = await getWeatherDataByCity(cityName);
    let cityId = data.id;
    updateCurrentWeather(data);
    getForecastDataByCity(cityId);
    searchInput.value = "";
  }
});

// Updating the current weather value

const updateCurrentWeather = (data) => {
  city.textContent = `${data.name}, ${data.sys.country}`;
  day.textContent = dayOfWeek();
  humidity.textContent = data.main.humidity;
  wind.textContent = `${calculateWindDirection(data.wind.deg)}, ${
    data.wind.deg
  }`;
  pressure.textContent = data.main.pressure;
  temperature.textContent =
    data.main.temp >= 0
      ? `+${Math.round(data.main.temp)}`
      : `-${Math.round(data.main.temp)}`;
  const imageId = data.weather[0].id;
  weatherImages.forEach((obj) => {
    if (obj.ids.includes(imageId)) {
      image.src = obj.url;
    }
  });
};

// Calculating Day Of Week

const dayOfWeek = (dt = new Date().getTime()) => {
  return new Date(dt).toLocaleDateString("en-EN", { weekday: "long" });
};

//Updating The Five Day Forecast

const updateForecast = (data) => {
  foreCastBlock.innerHTML = "";
  data.forEach((day) => {
    let iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    let dayName = dayOfWeek(day.dt * 1000);
    let temp =
      day.main.temp >= 0
        ? `+${Math.round(day.main.temp)}`
        : `-${Math.round(day.main.temp)}`;
    let foreCastElemt = `
                <article class="weather__forecast__item">
                    <img
                        src="${iconUrl}"
                        alt="${day.weather[0].description}"
                        class="weather__forecast__icon"
                    />
                    <h3 class="weather__forecast__day">${dayName}</h3>
                    <p class="weather__forecast__temperature">
                        <span class="value">${temp}</span> &deg;C
                    </p>
                </article>`;
    foreCastBlock.insertAdjacentHTML("beforeend", foreCastElemt);
  });
};

// Calculating Wind Direction

const calculateWindDirection = (deg) => {
  if (deg > 45 && deg <= 135) {
    return "East";
  } else if (deg > 135 && deg <= 225) {
    return "South";
  } else if (deg > 225 && deg <= 315) {
    return "West";
  } else {
    return "North";
  }
};
