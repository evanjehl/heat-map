$(document).ready(function() {
  
  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(data) {
    
    const dataset = data;
    
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    
    const colors = [[0, '#5e51a0'],[2.7, '#3789bb'], [3.9, '#69c1a5'], [5, '#acdca6'], [6.1, '#e6f49d'], [7.2, '#fffec2'], [8.3, '#fddf90'], [9.4, '#fbad67'], [10.5, '#f26d4a'], [11.6, '#d34052'], [12.7, '#9c0943']];
    
    const width = 1250;
  
    const height = 700;
  
    const paddingLeft = 100;
  
    const paddingRight = 50;
  
    const paddingTop = 135;
  
    const paddingBottom = 135;
  
    const barHeight = 40;
    
    const legendBarWidth = 35;
    
    const legendBarHeight = Math.floor(legendBarWidth / 2);
    
    const tipWidth = 160;
    
    const tipHeight = 75;
    
    const barWidth = Math.floor((width - paddingLeft - paddingRight) / (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year)));
    
    const xScale = d3.scaleLinear()
                     .domain([d3.min(dataset.monthlyVariance, d => d.year), d3.max(dataset.monthlyVariance, d => d.year)])
                     .range([0, barWidth * (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year) + 1)]);
    
    const xAxis = d3.axisBottom(xScale)
                    .tickValues(d3.range(1760, 2015, 10))
                    .tickFormat(d3.format('.0f'));
    
    //containing div for svg
    $('body').append('<div id="container"></div>');
    
    $('#container').css({
      width:width,
      height:height,
      position:'relative',
      margin:'0 auto',
      marginBottom: '200px',
      boxShadow:'5px 5px 8px'
    });
    
    //svg canvas
    const svg = d3.select('#container')
                  .append('svg')
                  .attr('width',width)
                  .attr('height',height);
    
    //heat map cells
    svg.selectAll('rect')
       .data(dataset.monthlyVariance)
       .enter()
       .append('rect')
       .attr('class','cell')
       .attr('height', barHeight)
       .attr('width', barWidth)
       .attr('x', d => paddingLeft + barWidth * (d.year - dataset.monthlyVariance[0].year))
       .attr('y', d => paddingTop + barHeight * (d.month - 1))
       .attr('fill', d => {
         var temp = dataset.baseTemperature + d.variance;
         if (temp < 2.7) {
           return colors[0][1];
         }
         if (temp >= 2.7 && temp < 3.9) {
           return colors[1][1];
         }
         if (temp >= 3.9 && temp < 5) {
           return colors[2][1];
         }
         if (temp >= 5 && temp < 6.1) {
           return colors[3][1];
         }
         if (temp >= 6.1 && temp < 7.2) {
           return colors[4][1];
         }
         if (temp >= 7.2 && temp < 8.3) {
           return colors[5][1];
         }
         if (temp >= 8.3 && temp < 9.4) {
           return colors[6][1];
         }
         if (temp >= 9.4 && temp < 10.5) {
           return colors[7][1];
         }
         if (temp >= 10.5 && temp < 11.6) {
           return colors[8][1];
         }
         if (temp >= 11.6 && temp < 12.7) {
           return colors[9][1];
         }
         if (temp >= 12.7) {
           return colors[10][1];
         }
       })
       .on('mouseover', function(d) {
          $('#tip').html('<span><strong>' + d.year + ' - ' + months[d.month - 1] + '</strong></span></br><span><strong>' + (dataset.baseTemperature + d.variance).toFixed(3) + ' °C</strong></span></br><span>' + d.variance.toFixed(3) + ' °C</span>')
          $('#tip').css({
            marginLeft:this.x.animVal.value + paddingLeft - (tipWidth / 2) - 20,
            marginTop:-(height + paddingTop + 150 - this.y.animVal.value)
          });
      
          tip.transition()
             .duration(500)
             .style('opacity','0.8');
       })
       .on('mouseout', function() {
         tip.transition()
            .duration(500)
            .style('opacity','0')
       });
    
    //y axis labels
    svg.selectAll('text')
       .data(months)
       .enter()
       .append('text')
       .text(d => d)
       .attr('class','month')
       .attr('x', paddingLeft - 10)
       .attr('y', (d, i) => paddingTop + (barHeight) * (i + 0.6))
       .attr('text-anchor','end');
    
    //x axis
    svg.append('g')
       .attr('transform', 'translate(' + paddingLeft + ', ' + (height - paddingBottom + 50) + ')')
       .call(xAxis);
    
    //legend
    const legend = svg.append('g')
                      .attr('transform', 'translate(' + (paddingLeft + barWidth * (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year) + 1) - legendBarWidth * 11) + ', ' + (height - 50) + ')')
       
    legend.selectAll('rect')
          .data(colors)
          .enter()
          .append('rect')
          .attr('fill', d => d[1])
          .attr('width', legendBarWidth)
          .attr('height', legendBarHeight)
          .attr('x', (d, i) => legendBarWidth * i)
          .attr('y', 0);
    
    legend.selectAll('text')
          .data(colors)
          .enter()
          .append('text')
          .text(d => d[0])
          .attr('text-anchor','middle')
          .attr('font-size','12')
          .attr('x', (d, i) => legendBarHeight + legendBarWidth * i)
          .attr('y', legendBarWidth);
    
    //headings
    svg.append('text')
       .text('Monthly Global Land-Surface Temperature')
       .attr('text-anchor','middle')
       .attr('font-size','32')
       .attr('font-weight','bold')
       .attr('x', (paddingLeft + barWidth * (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year) + 1) / 2))
       .attr('y', paddingTop / 2);
    
    svg.append('text')
       .text('1753 - 2015')
       .attr('text-anchor','middle')
       .attr('font-size','26')
       .attr('font-weight','bold')
       .attr('fill','grey')
       .attr('x', (paddingLeft + barWidth * (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year) + 1) / 2))
       .attr('y', (3 * paddingTop) / 4);
    
    svg.append('text')
       .text('Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.')
       .attr('font-size','12')
       .attr('text-anchor','middle')
       .attr('fill','grey')
       .attr('x', (paddingLeft + barWidth * (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year) + 1) / 2))
       .attr('y', (7 * paddingTop) / 8);
    
    svg.append('text')
       .text('Estimated Jan 1951-Dec 1980 absolute temperature °C: 8.66 +/- 0.07')
       .attr('font-size','12')
       .attr('text-anchor','middle')
       .attr('fill','grey')
       .attr('x', (paddingLeft + barWidth * (d3.max(dataset.monthlyVariance, d => d.year) - d3.min(dataset.monthlyVariance, d => d.year) + 1) / 2))
       .attr('y', (7 * paddingTop) / 8 + 13);
    
    //tooltip
    var tip = d3.select('body')
                .append('div')
                .attr('id','tip')
                .style('opacity','0');
    
    $('#tip').css({
      backgroundColor:'black',
      width:tipWidth + 'px',
      height:tipHeight + 'px',
      borderRadius:'20px',
      color:'white',
      textAlign:'center',
      padding:'5px',
      fontSize:'10'
    });
  })
 
});