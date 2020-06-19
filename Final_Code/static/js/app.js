//Declare function to create bar plot
function barplot(samples) {
    
    //Create variables for top 10 values, OTUs and labels
    var toptenvalues = samples.sample_values.slice(0, 10);
    var toptenOTU = (samples.otu_ids.slice(0, 10));
    var toptenOTU = toptenOTU.map(d => "OTU " + d)
    var labels = samples.otu_labels.slice(0, 10);
    
    //Create data variable for barplot
    var data = [{
        x: toptenvalues,
        y: toptenOTU,
        text: labels,
        marker: {color: '#D2691E'},
        type:"bar",
        orientation: "h",
    }];
    //Create layout variable for barplotplot
    var layout = {
        title: "Top 10 OTUs for Selected Subject ID",
        yaxis:{autorange:"reversed",
          tickmode:"linear",
        },
    };
    //Create barplot
    Plotly.newPlot("bar", data, layout);
  };
  
  
  //Declare function to create bubbleplot
  function bubbleplot(samples) {

    //Create data variable for bubbleplot
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

    //Create layout variable for bubbleplot
    var layout = {
      xaxis:{title: "OTU ID"},
      height: 500,
      width: 1000
    };
    //Create the bubbleplot
    Plotly.newPlot("bubble", data, layout); 
  };
  
  
  //Decalre function to create demographic table
  function table(metadata) {

    //Create demographic info variable for data 
    var demoinfo = d3.select("#sample-metadata");
    demoinfo.html("");

    //Add demographic info for the selection
    Object.entries(metadata).forEach(([key, value]) => {
      demoinfo.append("p").text(`${key}:${value}`);
    });
  }
  
  
  //Declare function to update the dashboard for new selection
  function optionChanged(sample) {

    //Select and create metadata and sample variables for dropdown selection
    d3.json("static/samples.json").then((data)=> {
      var metadata = data.metadata.filter(meta => meta.id.toString() === sample)[0];
      var samples = data.samples.filter(s => s.id.toString() === sample)[0];
      var wfreq=metadata.wfreq

      //Enter data into created plots and summary table
      barplot(samples);
      bubbleplot(samples);
      table(metadata);
      gauge(wfreq);
    });
  };
  
  
  //Declare function to initialize site using data from first metadata set
  function init() {

    //Create dropdown menu 
    var dropdown = d3.select("#selDataset"); 

    //Create datasets for dropdown selection
    d3.json("static/samples.json").then((data)=> {       
      data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value");
    });
    //Enter data from first data set
    optionChanged(data.names[0]);
    });
  }
  
  
  //Intialize
  init();