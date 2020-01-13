import * as LineChart from './linechart.js'
// Clock script here
var radians = 0.0174532925,
  clockRadius = 200,
  margin = 50,
  width = (clockRadius + margin) * 2,
  height = (clockRadius + margin) * 2,
  hourHandLength = 2 * clockRadius / 3,
  minuteHandLength = clockRadius,
  secondHandLength = clockRadius - 12,
  secondHandBalance = 30,
  secondTickStart = clockRadius,
  secondTickLength = -10,
  hourTickStart = clockRadius,
  hourTickLength = -50,
  secondLabelRadius = clockRadius + 16,
  secondLabelYOffset = 5,
  hourLabelRadius = clockRadius - 70,
  hourLabelYOffset = 7;

var hourScale = d3.scaleLinear()
  .range([0, 330])
  .domain([0, 11]);

var secondScale;
var minuteScale = secondScale = d3.scaleLinear()
  .range([0, 354])
  .domain([0, 59]);

var handData = [{
  type: 'hour',
  value: 0,
  length: -hourHandLength,
  scale: hourScale
}, {
  type: 'minute',
  value: 0,
  length: -minuteHandLength,
  scale: minuteScale
}, {
  type: 'second',
  value: 0,
  length: -secondHandLength,
  scale: secondScale,
  balance: secondHandBalance
}];

//initClock();

function initClock()
{
  drawClock();

  setInterval(function() {
    updateData();
    moveHands();
  }, 1000);

  d3.select(self.frameElement).style("height", height + "px");
}


function drawClock() { //create all the clock elements
  updateData(); //draw them in the correct starting position
  var svg = d3.select("body").select(".container").append("svg")
    .attr("width", width)
    .attr("height", height);

  var face = svg.append('g')
    .attr('id', 'clock-face')  
    .attr('transform', 'translate(' + (clockRadius + margin) + ',' + (clockRadius + margin) + ')');
  // Marks for seconds
  face.selectAll('.second-tick')
    .data(d3.range(0, 60)).enter()
    .append('line')
    .attr('class', 'second-tick')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', secondTickStart)
    .attr('y2', secondTickStart + secondTickLength)
    .attr('transform', function(d) {
      return 'rotate(' + secondScale(d) + ')';
    });

  // Labels for 5-minutes intervals
  // face.selectAll('.second-label')
  // 	.data(d3.range(5,61,5))
  // 		.enter()
  // 		.append('text')
  // 		.attr('class', 'second-label')
  // 		.attr('text-anchor','middle')
  // 		.attr('x',function(d){
  // 			return secondLabelRadius * Math.sin(secondScale(d) * radians);
  // 		})
  // 		.attr('y',function(d){
  // 			return -secondLabelRadius * Math.cos(secondScale(d) * radians) + secondLabelYOffset;
  // 		})
  // 		.text(function(d){
  // 			return d;
  // 		});

  //... and hours
  face.selectAll('.hour-tick')
    .data(d3.range(0, 12)).enter()
    .append('line')
    .attr('class', 'hour-tick')
    .attr('x1', 0)
    .attr('x2', 0)
    .attr('y1', hourTickStart)
    .attr('y2', hourTickStart + hourTickLength)
    .attr('transform', function(d) {
      return 'rotate(' + hourScale(d) + ')';
    });

  // Labels for 12-3-6-9-hours intervals
  face.selectAll('.hour-label')
    .data(d3.range(3, 13, 3))
    .enter()
    .append('text')
    .attr('class', 'hour-label')
    .attr('text-anchor', 'middle')
    .attr('x', function(d) {
      return hourLabelRadius *  Math.sin(hourScale(d) * radians);
    })
    .attr('y', function(d) {
      return -hourLabelRadius * Math.cos(hourScale(d) * radians) + hourLabelYOffset;
    })
    .text(function(d) {
      return d;
    });

  var hands = face.append('g').attr('id', 'clock-hands');

  face.append('g').attr('id', 'face-overlay')
    .append('circle').attr('class', 'hands-cover')
    .attr('x', 0)
    .attr('y', 0)
    .attr('r', clockRadius / 20);

  hands.selectAll('line')
    .data(handData)
    .enter()
    .append('line')
    .attr('class', function(d) {
      return d.type + '-hand';
    })
    .attr('x1', 0)
    .attr('y1', function(d) {
      return d.balance ? d.balance : 0;
    })
    .attr('x2', 0)
    .attr('y2', function(d) {
      return d.length;
    })
    .attr('transform', function(d) {
      return 'rotate(' + d.scale(d.value) + ')';
    });
}

function moveHands() {
  d3.select('#clock-hands').selectAll('line')
    .data(handData)
    .transition()
    .attr('transform', function(d) {
      return 'rotate(' + d.scale(d.value) + ')';
    });
}

function updateData() {
  var t = new Date();
  handData[0].value = (t.getHours() % 12) + t.getMinutes() / 60;
  handData[1].value = t.getMinutes();
  handData[2].value = t.getSeconds();
}


//  [][][] /""\ [][][]
//   |::| /____\ |::|
//   |[]|_|::::|_|[]|
//   |::::::__::::::|
//   |:::::/||\:::::|
//   |:#:::||||::#::|
//  #%*###&*##&*&#*&##
// ##%%*####*%%%###*%*#


//LINE CHART


LineChart.drawChart();



//  [][][] /""\ [][][]
//   |::| /____\ |::|
//   |[]|_|::::|_|[]|
//   |::::::__::::::|
//   |:::::/||\:::::|
//   |:#:::||||::#::|
//  #%*###&*##&*&#*&##
// ##%%*####*%%%###*%*#



//GAUGES

var gauges = [];

initialize();

function createGauge(name, label, min, max)
      {
        var config = 
        {
          size: 200,
          label: label,
          min: undefined != min ? min : 0,
          max: undefined != max ? max : 100,
          minorTicks: 5
        }
        
        var range = config.max - config.min;
        //config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
        if( name == "rpm")
          config.redZones = [{ from: config.min + range*0.9, to: config.max }];
        else if( name == "temp" )
           config.redZones = [{ from: config.min + range*0.7, to: config.max }];
        else if( name == "oil" )
        {
          config.redZones = [{ from: config.min , to: config.min + range*0.1 }];
          config.yellowZones = [{ from: config.min + range*0.1, to: config.min + range*0.5 }];
          config.greenZones = [{ from: config.min + range*0.5, to: config.max }];
        }
        
        gauges[name] = new Gauge(name + "GaugeContainer", config);
        gauges[name].render();
      }
      
      function createGauges()
      {
        createGauge("rpm", "RPM X1000", 0, 8);
        createGauge("temp", "temp \u2103", 0, 100);
        createGauge("oil", "Oil", 0, 100);
        //createGauge("test", "Test", -50, 50 );
      }
      
      function updateGauges()
      {
        // for (var key in gauges)
        // {
        //   var value = getRPM(gauges[key]);
        //   gauges[key].redraw(value);
        // }
        var value = getRPM(gauges["rpm"]);
        gauges["rpm"].redraw(value);
        value = getTemp(gauges["temp"]);
        gauges["temp"].redraw(value);
        gauges["oil"].redraw(60);
      }
      
      function getRPM(gauge)
      {
          return ( 3.5 - Math.random() );
      }

      function getTemp(gauge)
      {
          return ( 70 - Math.random() );
      }

      function getRandomValue(gauge)
      {
        var overflow = 0; //10;
        return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
      }
      
      function initialize()
      {
        createGauges();
        setInterval(updateGauges, 100);
      }