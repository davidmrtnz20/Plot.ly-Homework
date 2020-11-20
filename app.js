function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var array = metadata.filter(sampleobject => sampleobject.id == sample);
        var results = array[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");

        Object.entries(results).forEach(([key, value]) => {
            panel.append("h6").text(`${key}:${value}`);
        });

    });
}

function buildChart(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var array = samples.filter(sampleobject => sampleobject.id == sample);
        var results = array[0];
        var ids = results.otu_ids;
        var lables = results.otu_lables;
        var values = results.sample_values;

        var trace1 = [{
            y: ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            x: values.slice(0, 10).reverse(),
            text: lables.slice(0, 10).revrse(),
            type: "bar",
            orientation: "h"
        }];

        var barData = [trace1];

        var barLayout = {
            title: "Top 10 OTUs Found"
        };

        Plotly.newPlot("bar", barData, barLayout);

        var trace2 = [{
            x: ids,
            y: values,
            text: lables,
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

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

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
    buildMetadata(newSmaples);
}

init();