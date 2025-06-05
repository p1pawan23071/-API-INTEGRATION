const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const iconImg = document.getElementById("weatherIcon");

const unitToggle = document.getElementById("unitToggle");
const unitLabel = document.getElementById("unitLabel");

let useCelsius = true;
const apiKey = "ece9f580f974463385e153238250506";

function getWeather(cityOrCoords) {
  const url = typeof cityOrCoords === "string"
    ? `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityOrCoords}&aqi=yes`
    : `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityOrCoords.lat},${cityOrCoords.lon}&aqi=yes`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Location not found");
      return response.json();
    })
    .then(data => {
      const temp = useCelsius ? data.current.temp_c : data.current.temp_f;
      const windSpeed = useCelsius ? data.current.wind_kph : data.current.wind_mph;
      const tempUnit = useCelsius ? "°C" : "°F";
      const windUnit = useCelsius ? "km/h" : "mph";

      cityName.textContent = `${data.location.name}, ${data.location.country}`;
      temperature.textContent = `Temperature: ${temp} ${tempUnit}`;
      condition.textContent = `Condition: ${data.current.condition.text}`;
      humidity.textContent = `Humidity: ${data.current.humidity}%`;
      wind.textContent = `Wind Speed: ${windSpeed} ${windUnit}`;
      iconImg.src = "https:" + data.current.condition.icon;
      iconImg.alt = data.current.condition.text;
    })
    .catch(error => {
      alert("Error: " + error.message);
    });
}

// Toggle °C/°F
unitToggle.addEventListener("change", () => {
  useCelsius = !unitToggle.checked;
  unitLabel.textContent = useCelsius ? "°C" : "°F";
  const city = cityName.textContent.split(",")[0];
  if (city) getWeather(city);
});

// Manual search
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Please enter a city name.");
    return;
  }
  getWeather(city);
});

// Auto-detect on load
window.onload = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        getWeather(coords);
      },
      () => {
        getWeather("London"); // fallback
      }
    );
  } else {
    getWeather("London"); // fallback
  }
};
