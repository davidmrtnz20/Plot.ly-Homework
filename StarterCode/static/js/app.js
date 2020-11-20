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
        var id = results.otu_ids;
        var lables = results.otu_lables;
        var values = results.sample_values;

        var barData = [{
            y: id.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: values.slice(0, 10).reverse(),
            text: lables.slice(0, 10).revrse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 OTUs Found"
        };

        Plotly.plot("bar", barData, barLayout);

        var bubbleData = [{
            x: id,
            y: values,
            text: lables,
            mode: "markers",
            marker: {
                color: id,
                size: values
            }
        }];

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