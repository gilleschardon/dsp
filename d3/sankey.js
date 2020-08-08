div = d3.select("#plot")

svg = div.append("svg").attr("width", 800).attr("height", 800).attr("viewBox", [0, 0, 800, 800]);


nodes = [{name:"MP"}, {name:"PC"}, {name:"PSI"}, {name:"PT"}, {name:"TSI"}, {name:"CS"}, {name:"Lyon"}, {name:"Lille"}, {name:"Marseille"}, {name:"Nantes"}, {name:"SupOptique"}]

links = [
  {source: "MP", target:"CS", value:293},
  {source: "MP", target:"Lyon", value:127},
  {source: "MP", target:"SupOptique", value:40},
  {source: "MP", target:"Lille", value:90},
  {source: "MP", target:"Nantes", value:125},
  {source: "MP", target:"Marseille", value:80},
  {source: "PC", target:"CS", value:160},
  {source: "PC", target:"Lyon", value:62},
  {source: "PC", target:"SupOptique", value:47},
  {source: "PC", target:"Lille", value:50},
  {source: "PC", target:"Nantes", value:55},
  {source: "PC", target:"Marseille", value:80},
  {source: "PSI", target:"CS", value:184},
  {source: "PSI", target:"Lyon", value:82},
  {source: "PSI", target:"SupOptique", value:30},
  {source: "PSI", target:"Lille", value:60},
  {source: "PSI", target:"Nantes", value:75},
  {source: "PSI", target:"Marseille", value:60},
  {source: "TSI", target:"CS", value:20},
  {source: "TSI", target:"Lyon", value:5},
  {source: "TSI", target:"SupOptique", value:1},
  {source: "TSI", target:"Lille", value:5},
  {source: "TSI", target:"Nantes", value:10},
  {source: "TSI", target:"Marseille", value:5},
  {source: "PT", target:"CS", value:40},
  {source: "PT", target:"Lyon", value:24},
  {source: "PT", target:"SupOptique", value:10},
  {source: "PT", target:"Lille", value:12},
  {source: "PT", target:"Nantes", value:20},
  {source: "PT", target:"Marseille", value:5}]





sankey = d3.sankey().nodeId(d => d.name).nodeWidth(15).nodePadding(20).extent([[1, 5], [800 - 1, 800 - 5]]);



data = {links: links, nodes:nodes}

S = sankey(data)

color = "red"
edgeColor="blue"

svg.append("g")
      .attr("stroke", "#000")
    .selectAll("rect")
    .data(S.nodes)
    .join("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", color)
    

  const link = svg.append("g")
          .attr("fill", "none")
          .attr("stroke-opacity", 0.5)
        .selectAll("g")
        .data(links)
        .join("g")
          .style("mix-blend-mode", "multiply");

          link.append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", d => edgeColor === "none" ? "#aaa"
        : edgeColor === "path" ? d.uid
        : edgeColor === "input" ? color(d.source)
        : color)
    .attr("stroke-width", d => Math.max(1, d.width));
