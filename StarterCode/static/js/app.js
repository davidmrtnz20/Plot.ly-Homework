function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var array = metadata.filter(sampleobject => sampleobject.id == sample);
        var results = array[0];
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");

        Object.entries(results).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}:${value}`);
        });

    });
}

function buildChart(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var array = samples.filter(sampleobject => sampleobject.id == sample);
        var results = array[0];
        var ids = results.otu_ids;
        var labels = results.otu_labels;
        var values = results.sample_values;

        var trace1 = [{
            x: values.slice(0,10).reverse(),
            y: ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barData = [trace1];

        var barLayout = {
            title: "Top 10 OTUs Found"
        };

        Plotly.plot("bar", barData, barLayout);

        var trace2 = [{
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                size: values
            }
        }];

        var bubbleData = [trace2];

        var bubbleLayout = {
            xaxis: { title: "Id's" }
        };

        Plotly.plot("bubble", bubbleData, bubbleLayout);

    });
}

function init() {
    var dropdownMenu = d3.select('#selDataset');

    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            dropdownMenu
                .append("option")
                .text(sample)
                .property("value", sample)
        });

        const firstSample = sampleNames[0];
        buildChart(firstSample);
        buildMetadata(firstSample);

    });
}

function optionChanged(newSample) {
    buildChart(newSample);
    buildMetadata(newSample);
}

init();