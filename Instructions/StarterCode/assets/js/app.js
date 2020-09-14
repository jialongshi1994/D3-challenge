// get current width
let width = parseInt(d3.select("#scatter").style("width"))

// set height
const height = width - width / 3.9

const margin = 20
const labelWidth = 110
const tPadBot = 40
const tPadLeft = 40

// creat canvas
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart")

// set radius
let circRadius = 0
function getCircRadius() {
  if (width <= 530) {
    circRadius = 5
  }
  else {
    circRadius = 10
  }
}
getCircRadius()

// creat bottom axis
svg.append("g").attr("class", "xText")
const xText = d3.select(".xText")

// when the width of the window changes, refresh xText
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelWidth) / 2 + labelWidth) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  )
}
xTextRefresh()

// append three text SVG files
// poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)")

// age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)")

// income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)")

// left axis
const leftTextX = margin + tPadLeft
const leftTextY = (height + labelWidth) / 2 - labelWidth
svg.append("g").attr("class", "yText")
const yText = d3.select(".yText")
// when the width of the window changes, refresh yText
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  )
}
yTextRefresh()

// append text
// obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)")

// smokes  
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)")

// lacks healthcare  
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)")

// import our .csv file.
d3.csv("assets/data/data.csv").then(function(data) {    
  visualize(data)
})

// create visualization function
function visualize(theData) {
  let curX = "poverty"
  let curY = "obesity"
  
  let xMin = 0
  let xMax = 0
  let yMin = 0
  let yMax = 0

  // set up tooltip rules
  const toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {      
      let theX = ''      
      const theState = "<div>" + d.state + "</div>"      
      let theY = "<div>" + curY + ": " + d[curY] + "%</div>"      
      if (curX === "poverty") {          
        theX = "<div>" + curX + ": " + d[curX] + "%</div>"
      }
      else {          
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>"
      }      
      return theState + theX + theY
    })
    
  svg.call(toolTip)

  // change the min and max for x
  function xMinMax() {      
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90
    })
    
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10
    })
  }

  // change the min and max for y
  function yMinMax() {      
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90
    })
    
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10
    })
  }
  
  // change the classes and appearance of label text when clicked
  function labelChange(axis, clickedText) {      
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true)

    clickedText.classed("inactive", false).classed("active", true)
  }
  
  // init x y
  xMinMax()
  yMinMax()
  
  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelWidth, width - margin])
  const yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])    
    .range([height - margin - labelWidth, margin])
// create the axes
 
