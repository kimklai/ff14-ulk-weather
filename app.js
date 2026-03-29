function getEorzeaTime(unixSeconds) {
  const eorzeaHours = Math.floor(unixSeconds / 175);
  const eorzeaDays = Math.floor(eorzeaHours / 24);

  let timeChunk = (eorzeaHours % 24) - (eorzeaHours % 8);
  timeChunk = (timeChunk + 8) % 24;

  return { eorzeaDays, timeChunk };
}

function calculateWeatherChance(unixSeconds) {
  const { eorzeaDays, timeChunk } = getEorzeaTime(unixSeconds);

  const seed = eorzeaDays * 100 + timeChunk;

  const step1 = (seed << 11) ^ seed;
  const step2 = (step1 >>> 8) ^ step1;

  return step2 % 100;
}

function getHydatosWeather(chance) {
  if (chance < 10) return "暴雪";
  if (chance < 28) return "暴風";
  if (chance < 46) return "雷雨";
  if (chance < 64) return "暴雨";
  if (chance < 82) return "陰天";
  return "晴朗";
}

function generateForecast() {
  const list = document.getElementById("weatherList");
  list.innerHTML = "";

  let now = Date.now() / 1000;

  for (let i = 0; i < 20; i++) {
    let future = now + (i * 8 * 175); // 每8小時一段

    const chance = calculateWeatherChance(future);
    const weather = getHydatosWeather(chance);

    const li = document.createElement("li");
    li.textContent = `${i}段後：${weather}`;

    list.appendChild(li);
  }
}

generateForecast();
