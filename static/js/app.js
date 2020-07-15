// build out function to processs metadata
// build out ploting function to plot

// process the metadata function so you display the right info
function buildmetadata(sample) {
    // use d3 to read in json set
  d3.json("samples.json").then((data) => {
    // create new metadata variable
    var metadata = data.metadata;
    // filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    // set into a new empty array 
    var result = resultArray[0];
    // select panel with this id in it `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // html to clear any existing metadata
    PANEL.html("");
    // display this in a panel for each key value pair
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// build out the plots function (bar plot, bubble plot)
function buildcharts(sample) {
    // read in using json
    d3.json("samples.json").then((data) => {
    // set sample variable
      var samples = data.samples;
    // pass into a new array
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // set result array to zero value
      var result = resultArray[0];
    // set bacteria id variable
      var otu_ids = result.otu_ids;
    // set bacteria name label variable
      var otu_labels = result.otu_labels;
    // set sample value variable
      var sample_values = result.sample_values;
  
      // build the bubblay layout input
      var bubbleLayout = {
        title: "Bacteria Cultures for each Sample",
        margin: { t: 0 },
        hovermode: "closest",
        xaxis: { title: "OTU ID" },
        margin: { t: 30}
      };
      // build the bubblay data input
      var bubbleData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Mars"
          }
        }
      ];
  // plot out the ploty plot, what type of plot, and then variables 
  // that were defined and print it
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);


  // y ticks bar data cause its special and wont work unless it tworks
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      // build out the barData variable
      var barData = [
        {
          y: yticks,
          x: sample_values.slice(0, 10).reverse(),
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h",
        }
      ];
  // build out the barlayout variable
      var barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: { t: 30, l: 150 }
      };

  // plot out the ploty plot, what type of plot, and then variables 
  // that were defined and print it
      Plotly.newPlot("bar", barData, barLayout);
    });
  }
  
  // init the dashboards and stuff
  function init() {
    // ref to the drop down
    var selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // first sample to build initial plots
      var firstSample = sampleNames[0];
      buildcharts(firstSample);
      buildmetadata(firstSample);
    });
  }
  
  // when an option is changed
  function optionChanged(newSample) {
    // get new metadata and build new charts
    buildcharts(newSample);
    buildmetadata(newSample);
  }
  
  // the mitochondria is the powerhouse of the cell BOY
  init();