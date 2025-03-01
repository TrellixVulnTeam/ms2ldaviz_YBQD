// see:
// - http://bl.ocks.org/mbostock/3750558
// - https://github.com/mbostock/d3/wiki/Force-Layout
// - http://www.coppelia.io/2014/07/an-a-to-z-of-extra-features-for-the-d3-force-layout/

function alpha_graph(url) {
   
    var width = 1000;
    var height = 700;

    // var force = d3.layout.force()
    //     .size([width, height])
    //     .charge(-1000)
    //     .linkDistance(80)
    //     .on("tick", tick);

    // var drag = force.drag()
    //     .on("dragstart", dragstart);


    var zoom = d3.behavior.zoom().translate([300,300]).scale(.1,.1);

    var svg = d3.select("#network").append("svg")
        .attr("width", width)
        .attr("height", height);



    var drag = d3.behavior.drag();
    var viewBoxX = 0, viewBoxY = 0;
    drag.on('dragstart', function() {
        console.log('new dragstart is called');
    }).on('drag', function() {
        viewBoxX -= d3.event.dx;
        viewBoxY -= d3.event.dy;
        svg.select('g.node-area').attr('transform', 'translate(' + (-viewBoxX) + ',' + (-viewBoxY) + ')');
    }).on('dragend', function() {
    console.log('new dragend is called');
    });

        // .call(drag);
    bgrect = svg.append('rect')
      .classed('bg', true)
      .attr('stroke', '#666666')
      .attr('fill', 'transparent')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .call(zoom.on('zoom', zoomed)) 
      // .attr('transform','translate(300,300)scale(.1,.1)')
      // .call(drag);
            // .call(zoom.on('zoom', zoomed))
            // .on('dblclick.zoom', null)
            // .append('g')
            // .attr('transform', 'translate(300,300)scale(.1,.1)');


    var nodeArea = svg.append('g')
          .attr('transform','translate(300,300)scale(.1,.1)')
          .classed('node-area', true);

    

d3.json(url, function(error, graph) {
      if (error) throw error;

    // var nodeSel = nodeArea.selectAll('circle')
    //     .data(graph.nodes).enter().append('circle')
    //     .attr('r', 10).attr('fill', 'black');

    var linkSel = nodeArea.selectAll('line').data(graph.links).enter().append('line')
        .attr('stroke', '#999999')
        .style("stroke-width", function(d) { return 5*d.weight; });
    var node = nodeArea.selectAll(".node")
      .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node");
      // .call(force.drag);

    node.append('circle').attr('r',10)
        .attr('fill',function(d) {return d.col});
    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .attr('font-size',"14px")
      .text(function(d) { return d.name });
    // var nodeSel = nodeArea.selectAll('circle')
    //     .data(graph.nodes).enter().append('circle').attr('r',10).attr('fill','black');

    

    var force = d3.layout.force()
    .size([width, height])
    .nodes(graph.nodes).links(graph.links)
    .linkDistance(200)
    .charge(-2000)
    .on('tick', function() {
        linkSel
            .attr('x1', function(d) { return d.source.x; })
            .attr('y1', function(d) { return d.source.y; })
            .attr('x2', function(d) { return d.target.x; })
            .attr('y2', function(d) { return d.target.y; });
        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    });

    var mydrag = force.drag()
        .on("dragstart",dragstart);
    // node.call(force.drag);
    node.call(mydrag)



    force.start();
});

    // var link = svg.selectAll(".link"),
    //     node = svg.selectAll(".node");


    // d3.json(url, function(error, graph) {
    //   if (error) throw error;

    //    force
    //     .nodes(graph.nodes)
    //     .links(graph.links)
    //       .start();

    //    link = link.data(graph.links)
    //     .enter().append("line")
    //       .attr("class", "link");


    //     node = node.data(graph.nodes)
    //         .enter().append("circle")
    //           .attr("class", "node")
    //           .attr("r", 12)
    //           .on("dblclick", dblclick)
    //           .call(drag);
    // });

    // function tick() {
    //   link.attr("x1", function(d) { return d.source.x; })
    //       .attr("y1", function(d) { return d.source.y; })
    //       .attr("x2", function(d) { return d.target.x; })
    //       .attr("y2", function(d) { return d.target.y; });

    //   node.attr("cx", function(d) { return d.x; })
    //       .attr("cy", function(d) { return d.y; });
    // }

    // function dblclick(d) {
    //   d3.select(this).classed("fixed", d.fixed = false);
    // }
    function dragstart(d) {
      d3.select(this).classed("fixed", d.fixed = true);
    }
    function zoomed() {
        nodeArea.attr('transform',
                'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
        console.log('zooming');
    }


}



function plot_graph(vo_id,random_seed,show_ms1) {

    Math.seedrandom(random_seed);

    var width = 700;
    var height = 700;
    var topicName = 'motif';

    var minNodeSize = 8;
    var topicTextSize = 48;
    var docTextSize = 12;
    var size = d3.scale.pow().exponent(1)
        .domain([1, 100])
        .range([8, 24]);

    var defaultNodeColour = '#CCCCCC';
    var specialNodeColour = '#CC0000';
    var minScore = 0;
    var maxScore = 1;
    var color = d3.scale.linear()
        .domain([minScore, (minScore + maxScore) / 2, maxScore])
        .range(['#1f77b4', '#2ca02c', '#ff7f0e']);

    var simulationNumber = 10;
    var simulationTimeout = 1;

    var graphNodes = undefined;
    var selectNode = undefined;
    var unselectNode = undefined;
    var optArray = [];
    var toggle = 0;
    var url = '/basicviz/get_graph/' + vo_id + "?show_ms1=" + show_ms1;
    console.log('url is ' + url);
    console.log('show_ms1 is ' + show_ms1);

    // see https://gist.github.com/mbostock/3750941
    d3.json(url)
        .on("progress", function() {
            $("#status").text('Loading network graph: ' + d3.event.loaded)
        })
        .on("load", function(json) {
            $("#status").text('Loaded')
            loadGraph(json);
            $.unblockUI();
        })
        .on("error", function(error) {
            $("#status").text('Cannot load network graph!');
            $.unblockUI();
        })
        .get();
    

    function loadGraph(graph) {

        d3.select("#show_ms1_div").style("visibility", "visible");

        var force = d3.layout.force()
            .size([width, height])
            .charge(-10000)
            // .linkDistance(function(d) {
            //     return d.weight*100;
            // })
            .friction(0.40)
            .on('tick', tick);

        var drag = force.drag()
            .on('dragstart', dragstart);

        // the initial zoom and transform on the svg should be set to the same value
        var zoom = d3.behavior.zoom().translate([300,300]).scale(.1,.1);
        var svg = d3.select('#network').append('svg')
            .attr('y',500)
            .attr('width', width)
            .attr('height', height)
            .call(zoom.on('zoom', zoomed))
            .on('dblclick.zoom', null)
            .append('g')
            .attr('transform', 'translate(300,300)scale(.1,.1)');

        // to prevent excessive animation
        svg.on('mouseup', function() {
              // force.stop();
            });

        var link = svg.selectAll('.link'),
            node = svg.selectAll('.node');

        // ***************************************************************************
        // Run force simulation for n steps then stop it
        // ***************************************************************************

        n = simulationNumber;
        force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();
        for (var i = n * n; i > 0; --i) {
          force.tick();
        }
        setTimeout(function(){ force.stop(); }, simulationTimeout * 1000);

        // ***************************************************************************
        // For fading the currently selected nodes
        // ***************************************************************************

        var linkedByIndex = {};
        for (i = 0; i < graph.nodes.length; i++) {
            linkedByIndex[i + ',' + i] = 1;
        };
        graph.links.forEach(function(d) {
            linkedByIndex[d.source.index + ',' + d.target.index] = 1;
        });
        function neighbouring(a, b) {
            return linkedByIndex[a.index + ',' + b.index];
        }
        function isConnected(a, b) {
            return neighbouring(a, b) || neighbouring(b, a);
        }
        selectNode = function(d) {
            if (toggle == 0) {

                toggle = 1;
                d = d3.select(this).node().__data__;
                if(d.is_topic) {
                    console.log('Topic selected');
                    $('#network').block({ message: null });
                    load_parents(d.node_id,d.name,vo_id);
                    plot_word_graph('/basicviz/get_word_graph/'+d.node_id + '/' + vo_id + '/', d.node_id, d.name);
                    plot_word_graph('/basicviz/get_intensity/'+d.node_id + '/' + vo_id + '/', d.node_id, d.name);
                    $('#network').unblock();
                }

                // reduce the opacity of all but the neighbouring nodes
                node.style('opacity', function(o) {
                    return isConnected(d, o) ? 1.0 : 0.1;
                });
                link.style('opacity', function(o) {
                    return d.index==o.source.index | d.index==o.target.index ? 1.0 : 0.1;
                });
                graph.nodes.forEach(function(o) {
                    if (isConnected(d, o)) {
                        if ( (isTopicNode(d) && !isTopicNode(o)) || (!isTopicNode(d) && isTopicNode(o)) ) {
                            target = document.getElementById(o.id + '_label');
                            // target.style.display = 'inline';
                        }
                    }
                });

            } else {
                unselectNode(d);
            }

        }

        unselectNode = function(d) {
            // restore opacity
            node.style('opacity', 1);
            link.style('opacity', 1);
            text.style('display', 'none');
            toggle = 0;
            // remove parent plot svg ??
            // d3.select('#frag_graph_svg').remove()
        }

        function showToolTip(d) {
            target = document.getElementById(d.id + '_label');
            target.style.display = 'inline';
        }

        function hideToolTip(d) {
            target = document.getElementById(d.id + '_label');
            target.style.display = 'none';
        }

        function setNodeColour(d) {
            if (d.special == true) {
                if (d.hasOwnProperty('highlight_colour')) {
                    return d.highlight_colour; // returns the user-defined highlight colour
                } else {
                    return specialNodeColour; // returns the default colour for highlighted item
                }
            } else {
                if (isNumber(d.score) && d.score >= 0) {
                    return color(d.score);
                } else {
                    return defaultNodeColour;
                }
            }
        }

        function setNodeSize(d) {
            return 10 * Math.pow(size(d.size), 2);
        }

        // ***************************************************************************
        // Setup links and nodes in the graph
        // ***************************************************************************

        var link = link.data(graph.links)
            .enter().append('line')
                .attr('class', 'link')
                .style("stroke-width", function(d) { return d.weight; });

        // solve issue # 115: (hover issues for molecules)
        // sort nodes in graph based on "group" in descending to force circles under squares
        // 'group' == 1 is molecuels (square)
        // 'group' == 2 is motifs (circle)
        var node = node.data(graph.nodes.sort(function(a, b) { return b.group - a.group; }))
            .enter().append('g')
                .call(drag)
                .on('dblclick', selectNode)
                .on('mouseover', showToolTip)
                .on('mouseout', hideToolTip)

        var circle = node.append('path')
            .attr('class', 'node-shape')
            .attr('d',d3.svg.symbol()
                .size(setNodeSize)
                .type(function(d) { return d.type; })
            )
            .attr('id', function(d) { return d['id'] + '_circle'; })
            .style('fill', setNodeColour);

        var text = node.append('text')
            .attr('class', 'node-label')
            .attr('dx', 10)
            .attr('dy', '.35em')
            .attr('id', function(d) { return d.id + '_label'; })
            .style('display', 'none') // initially all node labels are invisible
            .text(function(d) { return '\u2002' + d.name; });

        // to be used in parent window later
        for (var i = 0; i < graph.nodes.length - 1; i++) {
            optArray.push(graph.nodes[i].name);
        }
        optArray = optArray.sort();
        graphNodes = node;

        // *****************************************************************************
        // Handle force tick event
        // *****************************************************************************

        function tick() {

            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        }

        // *****************************************************************************
        // Fix nodes positions after double click or dragging
        // *****************************************************************************

        function dblclick(d) {
            d3.select(this).classed('fixed', d.fixed = false);
        }

        function dragstart(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed('fixed', d.fixed = true);
        }

        // *****************************************************************************
        // For zooming
        // *****************************************************************************

        function zoomed() {
            svg.attr('transform',
                'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
        }

        // *****************************************************************************
        // Other functions
        // *****************************************************************************

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function isTopicNode(d) {
            if (d.name.indexOf(topicName) > -1) {
                return true;
            } else {
                return false;
            }
        }
    }
    

    // *****************************************************************************
    // Search node
    // *****************************************************************************

    $('#searchBtn').click(function(e) {

        //find the node
        var selectedVal = $("#searchText").val()
        var selected = graphNodes.filter(function (d, i) {
            return d.name == selectedVal;
        });
        toggle = 0;
        selected.each(function(d, i) {
            var onClickFunc = d3.select(this).on("dblclick");
            onClickFunc.apply(this, [d, i]);
        });

    });

    $('#resetBtn').click(function(e) {
        $("#searchText").val('');
        unselectNode();
    });

    $("#searchText").autocomplete({
        source: optArray
    });

    } //end plot_graph()











function plot_decomposition_graph(decomposition_id,vo_id,random_seed) {

    Math.seedrandom(random_seed);

    var width = 700;
    var height = 700;
    var topicName = 'motif';

    var minNodeSize = 8;
    var topicTextSize = 48;
    var docTextSize = 12;
    var size = d3.scale.pow().exponent(1)
        .domain([1, 100])
        .range([8, 24]);

    var defaultNodeColour = '#CCCCCC';
    var specialNodeColour = '#CC0000';
    var minScore = 0;
    var maxScore = 1;
    var color = d3.scale.linear()
        .domain([minScore, (minScore + maxScore) / 2, maxScore])
        .range(['#1f77b4', '#2ca02c', '#ff7f0e']);

    var simulationNumber = 10;
    var simulationTimeout = 1;

    var graphNodes = undefined;
    var selectNode = undefined;
    var unselectNode = undefined;
    var optArray = [];
    var toggle = 0;
    var url = '/decomposition/get_graph/'+decomposition_id + '/' + vo_id + '/';
    console.log('url is ' + url)

    // see https://gist.github.com/mbostock/3750941
    d3.json(url)
        .on("progress", function() {
            $("#status").text('Loading network graph: ' + d3.event.loaded);
        })
        .on("load", function(json) {
            $("#status").text('Loaded');
            loadGraph(json);
            $.unblockUI();
        })
        .on("error", function(error) {
            $("#status").text('Cannot load network graph!');
            $.unblockUI();
        })
        .get();
    

    function loadGraph(graph) {

        var force = d3.layout.force()
            .size([width, height])
            .charge(-10000)
            // .linkDistance(function(d) {
            //     return d.weight*100;
            // })
            .friction(0.40)
            .on('tick', tick);

        var drag = force.drag()
            .on('dragstart', dragstart);

        // the initial zoom and transform on the svg should be set to the same value
        var zoom = d3.behavior.zoom().translate([300,300]).scale(.1,.1);
        var svg = d3.select('#network').append('svg')
            .attr('y',500)
            .attr('width', width)
            .attr('height', height)
            .call(zoom.on('zoom', zoomed))
            .on('dblclick.zoom', null)
            .append('g')
            .attr('transform', 'translate(300,300)scale(.1,.1)');

        // to prevent excessive animation
        svg.on('mouseup', function() {
              // force.stop();
            });

        var link = svg.selectAll('.link'),
            node = svg.selectAll('.node');

        // ***************************************************************************
        // Run force simulation for n steps then stop it
        // ***************************************************************************

        n = simulationNumber;
        force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();
        for (var i = n * n; i > 0; --i) {
          force.tick();
        }
        setTimeout(function(){ force.stop(); }, simulationTimeout * 1000);

        // ***************************************************************************
        // For fading the currently selected nodes
        // ***************************************************************************

        var linkedByIndex = {};
        for (i = 0; i < graph.nodes.length; i++) {
            linkedByIndex[i + ',' + i] = 1;
        };
        graph.links.forEach(function(d) {
            linkedByIndex[d.source.index + ',' + d.target.index] = 1;
        });
        function neighbouring(a, b) {
            return linkedByIndex[a.index + ',' + b.index];
        }
        function isConnected(a, b) {
            return neighbouring(a, b) || neighbouring(b, a);
        }
        selectNode = function(d) {
            if (toggle == 0) {

                toggle = 1;
                d = d3.select(this).node().__data__;
                if(d.is_topic) {
                    load_parents_decomposition(d.node_id,d.name,decomposition_id);
                    plot_word_graph('/decomposition/get_word_graph/'+d.node_id + '/nan/' + decomposition_id + '/', d.node_id, d.name);
                    plot_word_graph('/decomposition/get_intensity_graph/'+d.node_id + '/nan/' + decomposition_id + '/', d.node_id, d.name);
                }

                // reduce the opacity of all but the neighbouring nodes
                node.style('opacity', function(o) {
                    return isConnected(d, o) ? 1.0 : 0.1;
                });
                link.style('opacity', function(o) {
                    return d.index==o.source.index | d.index==o.target.index ? 1.0 : 0.1;
                });
                graph.nodes.forEach(function(o) {
                    if (isConnected(d, o)) {
                        if ( (isTopicNode(d) && !isTopicNode(o)) || (!isTopicNode(d) && isTopicNode(o)) ) {
                            target = document.getElementById(o.id + '_label');
                            target.style.display = 'inline';
                        }
                    }
                });

            } else {
                unselectNode(d);
            }

        }

        unselectNode = function(d) {
            // restore opacity
            node.style('opacity', 1);
            link.style('opacity', 1);
            text.style('display', 'none');
            toggle = 0;
            // remove parent plot svg ??
            // d3.select('#frag_graph_svg').remove()
        }

        function showToolTip(d) {
            target = document.getElementById(d.id + '_label');
            target.style.display = 'inline';
        }

        function hideToolTip(d) {
            target = document.getElementById(d.id + '_label');
            target.style.display = 'none';
        }

        function setNodeColour(d) {
            if (d.special == true) {
                if (d.hasOwnProperty('highlight_colour')) {
                    return d.highlight_colour; // returns the user-defined highlight colour
                } else {
                    return specialNodeColour; // returns the default colour for highlighted item
                }
            } else {
                if (isNumber(d.score) && d.score >= 0) {
                    return color(d.score);
                } else {
                    return defaultNodeColour;
                }
            }
        }

        function setNodeSize(d) {
            return 10 * Math.pow(size(d.size), 2);
        }

        // ***************************************************************************
        // Setup links and nodes in the graph
        // ***************************************************************************

        var link = link.data(graph.links)
            .enter().append('line')
                .attr('class', 'link')
                .style("stroke-width", function(d) { return d.weight; });

        var node = node.data(graph.nodes)
            .enter().append('g')
                .call(drag)
                .on('dblclick', selectNode)
                .on('mouseover', showToolTip)
                .on('mouseout', hideToolTip)

        var circle = node.append('path')
            .attr('class', 'node-shape')
            .attr('d',d3.svg.symbol()
                .size(setNodeSize)
                .type(function(d) { return d.type; })
            )
            .attr('id', function(d) { return d.id + '_circle'; })
            .style('fill', setNodeColour);

        var text = node.append('text')
            .attr('class', 'node-label')
            .attr('dx', 10)
            .attr('dy', '.35em')
            .attr('id', function(d) { return d.id + '_label'; })
            .style('display', 'none') // initially all node labels are invisible
            .text(function(d) { return '\u2002' + d.name; });

        // to be used in parent window later
        for (var i = 0; i < graph.nodes.length - 1; i++) {
            optArray.push(graph.nodes[i].name);
        }
        optArray = optArray.sort();
        graphNodes = node;

        // *****************************************************************************
        // Handle force tick event
        // *****************************************************************************

        function tick() {

            link.attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });

            node.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });

        }

        // *****************************************************************************
        // Fix nodes positions after double click or dragging
        // *****************************************************************************

        function dblclick(d) {
            d3.select(this).classed('fixed', d.fixed = false);
        }

        function dragstart(d) {
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed('fixed', d.fixed = true);
        }

        // *****************************************************************************
        // For zooming
        // *****************************************************************************

        function zoomed() {
            svg.attr('transform',
                'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
        }

        // *****************************************************************************
        // Other functions
        // *****************************************************************************

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        function isTopicNode(d) {
            if (d.name.indexOf(topicName) > -1) {
                return true;
            } else {
                return false;
            }
        }
    }
    

    // *****************************************************************************
    // Search node
    // *****************************************************************************

    $('#searchBtn').click(function(e) {

        //find the node
        var selectedVal = $("#searchText").val()
        var selected = graphNodes.filter(function (d, i) {
            return d.name == selectedVal;
        });
        toggle = 0;
        selected.each(function(d, i) {
            var onClickFunc = d3.select(this).on("dblclick");
            onClickFunc.apply(this, [d, i]);
        });

    });

    $('#resetBtn').click(function(e) {
        $("#searchText").val('');
        unselectNode();
    });

    $("#searchText").autocomplete({
        source: optArray
    });

    } //end plot_graph()