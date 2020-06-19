//Declare function to create bar plot
function barplot(samples) {
    
    //Get top 10 values, OTUs and labels
    var toptenvalues = samples.sample_values.slice(0, 10);
    var toptenOTU = (samples.otu_ids.slice(0, 10));
    var toptenOTU = toptenOTU.map(d => "OTU " + d)
    var labels = samples.otu_labels.slice(0, 10);
    
    //Create variables for barplot
    var data = [{
        x: toptenvalues,
        y: toptenOTU,
        text: labels,
        marker: {color: '#1978B5'},
        type:"bar",
        orientation: "h",
    }];
    // create layout variable for plot
    var layout = {
        title: "Top 10 OTUs for Selected Subject ID",
        yaxis:{autorange:"reversed",
          tickmode:"linear",
        },
    };
    // create the bar plot
    Plotly.newPlot("bar", data, layout);
  };
  
  
  //Declare function to create bubbleplot
  function bubbleplot(samples) {
    // create data variable for plot
    var data = [{
      x: samples.otu_ids,
      y: samples.sample_values,
      mode: "markers",
      marker: {
      size: samples.sample_values,
      color: samples.otu_ids
      },
      text: samples.otu_labels
    }];
    // create layout variable for plot
    var layout = {
      xaxis:{title: "OTU ID"},
      height: 600,
      width: 1000
    };
    // create the bubble plot
    Plotly.newPlot("bubble", data, layout); 
  };
  
  
  // FUNCTION to create demographic info table
  function table(metadata) {
    // select demographic info object to put data and empty current selection
    var demoinfo = d3.select("#sample-metadata");
    demoinfo.html("");
    // add demographic information from the new sample
    Object.entries(metadata).forEach(([key, value]) => {
      demoinfo.append("p").text(`${key}:${value}`);
    });
  }
  
  
  // FUNCTION to Refresh the dashboard if the sample changes
  function optionChanged(sample) {
    // Pull metadata and sample, then filter by dropdown selection
    d3.json("static/samples.json").then((data)=> {
      var metadata = data.metadata.filter(meta => meta.id.toString() === sample)[0];
      var samples = data.samples.filter(s => s.id.toString() === sample)[0];
      var wfreq=metadata.wfreq
      // Feed data into display functions
      barplot(samples);
      bubbleplot(samples);
      table(metadata);
      gauge(wfreq);
    });
  };
  
  
  // FUNCTION to Initialize site by grabbing the names of the dataset and displaying graphs from the first dataset
  function init() {
    // Grab Dropdown menu and add choices from the dataset
    var dropdown = d3.select("#selDataset"); 
    // create list of datasets for the dropdown
    d3.json("static/samples.json").then((data)=> {       
      data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value");
    });
    // initialize the plots with data from the first dataset
    optionChanged(data.names[0]);
    });
  }
  
  
  // Run the initialize funciton
  init();