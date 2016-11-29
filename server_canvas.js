var srv_cnv_control = module.exports = {};

srv_cnv_control.drawFunction = function draw(coord_data) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext("2d");

    draw_ext(coord_data, ctx)
}

function draw_ext(coord_data, ctx){
  var sizeVal = 5;
  var colorVal = 'Black';

  for (var i = 1; i < coord_data.length; i++) {
    var tmp = coord_data[i];
    var prev_tmp = coord_data[i-1];

  	var x, y, width, height;
  	newCordX = tmp[0];
  	newCordY = tmp[1];

    prevCordX = prev_tmp[0];
    prevCordX = prev_tmp[1];

  	width = height = (sizeVal/2);

    ctx.beginPath();
    ctx.moveTo(prevCordX, prevCordY);
    ctx.lineTo(newCordX, newCordY);
    ctx.lineWidth = sizeVal;
    ctx.strokeStyle = colorVal;
    ctx.stroke();
  }
}
