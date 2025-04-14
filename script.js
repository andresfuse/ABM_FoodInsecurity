function goToPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.addEventListener("DOMContentLoaded", function () {
  goToPage('page1');

  const width = 800, height = 500;

  const svg = d3.select("#map")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

  const projection = d3.geoMercator().scale(50000).center([-75.1652, 39.9526]).translate([width/2, height/2]);
  const path = d3.geoPath().projection(projection);

  Promise.all([
    d3.json("Census_Tracts_2020.json")
  ]).then(([topoData]) => {
    const geoData = topojson.feature(topoData, topoData.objects.Census_Tracts_2020);

    svg.selectAll("path")
       .data(geoData.features)
       .enter()
       .append("path")
       .attr("d", path)
       .attr("fill", "#ccc")
       .attr("stroke", "#333")
       .on("click", function(event, d) {
         let v1 = Math.random() * 100;
         let v2 = Math.random() * 100;
         d3.select("#bar1").style("width", v1 + "%");
         d3.select("#bar2").style("width", v2 + "%");
       });
  });
});

