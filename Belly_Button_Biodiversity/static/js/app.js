function buildMetadata(sample) {

    d3.json("/metadata/" + sample).then(function(data){
        var metadata = d3.select("#sample-metadata");
        metadata.html("")
        metadata.append("p").text("AGE: " + data["AGE"])
        metadata.append("p").text("BBTYPE: " + data["BBTYPE"])
        metadata.append("p").text("ETHNICITY: " + data["ETHNICITY"])
        metadata.append("p").text("GENDER: " + data["GENDER"])
        metadata.append("p").text("LOCATION: " + data["LOCATION"])
        metadata.append("p").text("SAMPLEID: " + data["sample"])
        metadata.append("p").text("WFREQ: " + data["WFREQ"])
        buildGuage(data["WFREQ"])
    });
// Object.entries(sample).forEach(([key, value]) => {
// var row = metadata.append("p");
// row.text(`${key}: ${value}`);
}

function buildCharts(sample) {

    d3.json("/samples/" + sample).then(function(data){
        var otuIds = data.otu_ids.slice(0,10);
        var otuLabel = data.otu_labels.slice(0,10);
        var sampleValues = data.sample_values.slice(0,10);
        var graph1 = [{ "labels": otuIds,
                        "values": sampleValues,
                        "hovertext": otuLabel,
                        "type": "pie"
        }];
        Plotly.newPlot("pie", graph1);

    var graph2 = {
        x: data.otu_ids,
        y: data.sample_values,
        text: data.otu_labels,
        mode: 'markers',
        marker: {color: data.otu_ids,size: data.sample_values}
    };

     var bubble = [graph2];

     var layout = {
          height: 600,
          width: 900,
          showlegend: true,
          hovermode: 'closest',
          xaxis: {title: 'otu id'}
      };

     Plotly.newPlot('bubble', bubble, layout);
    });
}

function init() {
// Grab a reference to the dropdown select element.
  var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options.
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

// Use the first sample from the list to build the initial plots.
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    // buildGuage('2');
    // console.log(firstSample);
  });
}

function buildGuage(level){
    var level = level * 180 / 12;

// Using PI, sin and cosin to calculate the pointer location.
    var degrees = 180 - level;
    var radii = degrees * Math.PI / 180;
    var radius = .5;
    var x = radius * Math.cos(radii);
    var y = radius * Math.sin(radii);

// Path: This may need to be adjusted, but these settings worked.
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ';
    var pathX = String(x);
    var space = ' ';
    var pathY = String(y);
    var pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
        x: [0], 
        y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'speed',
        text: level,
        hoverinfo: 'text'},
      { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
      rotation: 90,
      text: ['10-12', '8-10', '6-8', '4-6', '2-4', '0-2'],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['rgba(0, 255, 255, .5)', 
                      'rgba(60, 255, 255, .5)',
                      'rgba(100, 255, 255, .5)', 
                      'rgba(150, 255, 255, .5)',
                      'rgba(175, 255, 255, .5)', 
                      'rgba(222, 255, 255, .5)',
                      'rgba(255, 255, 255, 0)',
                      'rgba(255, 255, 255, 0)',
                      'rgba(255, 255, 255, 0)']},
      labels: ['10-12', '8-10', '6-8', '4-6', '2-4', '0-2'],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {color: '850000'}
        }],
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout, {showSendToCloud:false});
}


function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGuage(newSample["WFREQ"]);
  console.log(newSample);
}

// Initialize the dashboard.
init();





