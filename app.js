function getAlignedStartTime(unixSeconds) {
  const bell = unixSeconds / 175; // ET 小時

  const currentHour = Math.floor(bell % 24);

  // 對齊到 0 / 8 / 16
  const baseHour = currentHour - (currentHour % 8);

  // 回推到該區段開始
  const alignedBell = Math.floor(bell) - (currentHour % 8);

  return alignedBell * 175;
}

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

function getET(unixSeconds) {
  const totalEorzeaSeconds = Math.floor(unixSeconds * (1440 / 70));

  const minutes = Math.floor(totalEorzeaSeconds / 60) % 60;
  const hours = Math.floor(totalEorzeaSeconds / 3600) % 24;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function getTST(unixSeconds) {
  const date = new Date(unixSeconds * 1000);

  return date.toLocaleString("zh-TW", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function generateForecast() {
  const list = document.getElementById("weatherList");
  list.innerHTML = "";

  let now = Date.now() / 1000;

  // ⭐ 對齊到天氣起點
  let start = getAlignedStartTime(now);

  for (let i = 0; i < 200; i++) {
    let future = start + i * 8 * 175;

    const chance = calculateWeatherChance(future);
    const weather = getHydatosWeather(chance);

    const tst = getTST(future);
    const et = getET(future);

    const li = document.createElement("li");
    li.textContent = `${tst} | ET ${et} | ${weather}`;

    // 現在所在區段
    if (now >= future && now < future + 8 * 175) {
      li.style.fontWeight = "bold";
    }

    list.appendChild(li);
  }
}

generateForecast();
