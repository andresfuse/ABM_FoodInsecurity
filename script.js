
let selectedTract = null;
const colorScale = d3.scaleQuantize().range(d3.schemeBlues[9]);

function drawMap(data, geojson) {
  const width = 600, height = 600;
  const svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  const projection = d3.geoMercator().fitSize([width, height], geojson);
  const path = d3.geoPath().projection(projection);

  const tractData = {};
  data.forEach(d => {
    tractData[d.TRACTCE10] = +d.insecurity;
  });

  colorScale.domain(d3.extent(data, d => +d.insecurity));

  svg.selectAll("path")
    .data(geojson.features)
    .enter().append("path")
    .attr("d", path)
    .attr("fill", d => {
      const tract = d.properties.TRACTCE10;
      return tractData[tract] !== undefined ? colorScale(tractData[tract]) : "#ccc";
    })
    .attr("stroke", "#fff")
    .on("click", function(event, d) {
      selectedTract = d.properties.TRACTCE10;
      updateGauges(selectedTract, data);
    });
}

function updateGauges(tract, data) {
  const record = data.find(d => d.TRACTCE10 === tract);
  if (record) {
    foodGauge.refresh(+record.food_sec);
    houseGauge.refresh(+record.house_sec);
  }
}

function drawGauges() {
  const gaugeOptions = {
    angle: 0,
    lineWidth: 0.44,
    radiusScale: 1,
    pointer: { length: 0.6, strokeWidth: 0.035, color: "#000" },
    limitMax: false,
    limitMin: false,
    colorStart: "#6FADCF",
    colorStop: "#8FC0DA",
    strokeColor: "#E0E0E0",
    generateGradient: true,
    highDpiSupport: true,
  };

  const foodTarget = document.getElementById("food_gauge");
  const houseTarget = document.getElementById("house_gauge");

  foodGauge = new Gauge(foodTarget).setOptions(gaugeOptions);
  foodGauge.maxValue = 1;
  foodGauge.setMinValue(0);
  foodGauge.animationSpeed = 32;
  foodGauge.set(0);

  houseGauge = new Gauge(houseTarget).setOptions(gaugeOptions);
  houseGauge.maxValue = 20;
  houseGauge.setMinValue(0);
  houseGauge.animationSpeed = 32;
  houseGauge.set(0);
}

Promise.all([
  d3.json("tracts.json"),
  d3.csv("vars_by_tract.csv")
]).then(([geojson, data]) => {
  drawGauges();
  drawMap(data, geojson);
});

