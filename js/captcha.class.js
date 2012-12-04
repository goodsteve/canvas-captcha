var cc = null;
function CanvasCaptcha() {
  // HTML id's
  this.appId                      = 'canvasCaptcha';
  this.canvasId                   = 'canvasCaptchaCanvas';
  this.canvasShapeId              = 'canvasCaptchaShape';
  this.resetButtonId              = 'canvasCaptchaReset';
  this.statusMessageId            = 'canvasCaptchaStatus';
  this.submitButtonId             = 'canvasCaptchaSubmit';
  // Settings
  this.settings                   = {};
  this.settings.canvas            = {};
  this.settings.canvas.fillStyle  = '#f9f9f9';
  this.settings.canvas.height     = 140;
  this.settings.canvas.offset     = {};
  this.settings.canvas.offset.x   = 260;
  this.settings.canvas.offset.y   = 20;
  this.settings.canvas.width      = 200;
  this.settings.canvasShape             = {};
  this.settings.canvasShape.fillStyle   = '#fff';
  this.settings.canvasShape.height      = 90;
  this.settings.canvasShape.offset      = {};
  this.settings.canvasShape.offset.x    = 10;
  this.settings.canvasShape.offset.y    = 10;
  this.settings.canvasShape.width       = 90;
  this.settings.line              = {};
  this.settings.line.color        = '#555';
  this.settings.line.size         = 2;
  this.settings.offset            = {};
  this.settings.offset.x          = 260;
  this.settings.offset.y          = 20;
  this.settings.tries             = 10;
  // Shape parameters
  this.shapes                       = {};
  this.shapes.square                = {};
  this.shapes.square.delta          = 15;
  this.shapes.square.interval       = 3;
  this.shapes.square.multi          = 1;
  this.shapes.square.pass           = 95;
  this.shapes.square.size           = 30;
  this.shapes.square.deviation      = {};
  this.shapes.square.deviation.min  = 1;
  this.shapes.square.deviation.max  = 2;
  // Object variables
  this.isDrawing                  = false;
  this.canvas                     = document.getElementById(this.canvasId);
  this.context                    = this.canvas.getContext('2d');
  this.context.fillStyle          = this.settings.canvas.fillStyle;
  this.context.fillRect(0, 0, this.settings.canvas.width, this.settings.canvas.height);
  this.canvasShape                = document.getElementById(this.canvasShapeId);
  this.contextShape               = this.canvasShape.getContext('2d');
  this.contextShape.fillStyle     = this.settings.canvasShape.fillStyle;
  this.contextShape.fillRect(0, 0, this.settings.canvasShape.width, this.settings.canvasShape.height);
  this.shape                      = 'square';
  this.triesLeft                  = this.settings.tries;
  // Input variables
  this.drawCoords                 = [];
  // Click events
  $('#' + this.canvasId).mousedown(function(e) {
    if ((cc.isDrawing == false) && (cc.triesLeft > 0)) {
      cc.isDrawing  = true;
      var coords    = {};
      coords.x      = e.pageX;
      coords.y      = e.pageY;
      cc.drawCoords.push(coords);
      cc.drawLine((coords.x - cc.settings.canvas.offset.x), (coords.y - cc.settings.canvas.offset.y));
    }
    return false;
  });
  $('#' + this.canvasId).mousemove(function(e) {
    if (cc.isDrawing == true) {
      var coords = {};
      coords.x = e.pageX;
      coords.y = e.pageY;
      cc.drawCoords.push(coords);
      cc.drawLine((coords.x - cc.settings.canvas.offset.x), (coords.y - cc.settings.canvas.offset.y));
    }
    return false;
  });
  $('#' + this.canvasId).mouseup(function(e) {
    if (cc.isDrawing == true) {
      cc.isDrawing  = false;
      var coords = {};
      coords.x = e.pageX;
      coords.y = e.pageY;
      cc.drawCoords.push(coords);
      cc.drawLine((coords.x - cc.settings.canvas.offset.x), (coords.y - cc.settings.canvas.offset.y));
    }
    return false;
  });
  return null;
}
CanvasCaptcha.prototype.clearCanvas = function() {
  cc.context.clearRect(0, 0, cc.settings.canvas.width, cc.settings.canvas.height);
  return null;
}
CanvasCaptcha.prototype.clearCoords = function() {
  cc.drawCoords = [];
  return null;
}
CanvasCaptcha.prototype.clearStatus = function() {
  $('#' + cc.statusMessageId).html('');
  return null;
}
CanvasCaptcha.prototype.drawLine = function(x, y) {
  cc.context.fillStyle = cc.settings.line.color;
  cc.context.beginPath();
  cc.context.moveTo(x, y);
  cc.context.arc(x, y, cc.settings.line.size, 0, Math.PI * 2, false);
  cc.context.fill();
  return null;
}
CanvasCaptcha.prototype.drawShape = function() {
  switch (cc.shape) {
    case 'square':
      cc.drawSquare();
      break;
  }
  return null;
}
CanvasCaptcha.prototype.drawSquare = function() {
  var x = cc.settings.canvasShape.offset.x + cc.shapes.square.size;
  var y = cc.settings.canvasShape.offset.y + cc.shapes.square.size;
  cc.contextShape.fillStyle     = cc.settings.canvasShape.fillStyle;
  cc.contextShape.strokeStyle   = cc.settings.line.color;
  cc.contextShape.lineWidth     = cc.settings.line.size;
  cc.contextShape.beginPath();
  cc.contextShape.moveTo((x - (cc.shapes.square.size * cc.shapes.square.multi)), (y - (cc.shapes.square.size * cc.shapes.square.multi)));
  cc.contextShape.lineTo((x + (cc.shapes.square.size * cc.shapes.square.multi)), (y - (cc.shapes.square.size * cc.shapes.square.multi)));
  cc.contextShape.lineTo((x + (cc.shapes.square.size * cc.shapes.square.multi)), (y + (cc.shapes.square.size * cc.shapes.square.multi)));
  cc.contextShape.lineTo((x - (cc.shapes.square.size * cc.shapes.square.multi)), (y + (cc.shapes.square.size * cc.shapes.square.multi)));
  cc.contextShape.lineTo((x - (cc.shapes.square.size * cc.shapes.square.multi)), (y - (cc.shapes.square.size * cc.shapes.square.multi)));
  cc.contextShape.stroke();
  cc.contextShape.fill();
  return null;
}
CanvasCaptcha.prototype.evaluateCoords = function() {
  var evaluation      = {};
  evaluation.x        = {};
  evaluation.x.count  = cc.drawCoords.length;
  evaluation.x.delta  = 0;
  evaluation.x.max    = 0;
  evaluation.x.mean   = 0;
  evaluation.x.mid    = 0;
  evaluation.x.min    = 0;
  evaluation.x.sum    = 0;
  evaluation.y        = {};
  evaluation.y.count  = cc.drawCoords.length;
  evaluation.y.delta  = 0;
  evaluation.y.max    = 0;
  evaluation.y.mean   = 0;
  evaluation.y.mid    = 0;
  evaluation.y.min    = 0;
  evaluation.y.sum    = 0;
  var row, coords = null;
  if (evaluation.x.count > 0) {
    $.each(cc.drawCoords, function(row, coords) {
      if (evaluation.x.sum > 0) {
        // x
        if (coords.x > evaluation.x.max) {
          evaluation.x.max  = coords.x;
        } else if (coords.x < evaluation.x.min) {
          evaluation.x.min  = coords.x;
        }
        evaluation.x.sum  += coords.x;
        // y
        if (coords.y > evaluation.y.max) {
          evaluation.y.max  = coords.y;
        } else if (coords.y < evaluation.y.min) {
          evaluation.y.min  = coords.y;
        }
        evaluation.y.sum  += coords.y;
      } else {
        // x
        evaluation.x.max  = coords.x;
        evaluation.x.min  = coords.x;
        evaluation.x.sum  = coords.x;
        // y
        evaluation.y.max  = coords.y;
        evaluation.y.min  = coords.y;
        evaluation.y.sum  = coords.y;
      }
    }); 
    // x
    evaluation.x.delta  = (evaluation.x.max - evaluation.x.min);
    evaluation.x.mean   = Math.floor(evaluation.x.sum / evaluation.x.count);
    evaluation.x.mid    = (evaluation.x.min + Math.ceil(evaluation.x.delta / 2));
    // y
    evaluation.y.delta  = (evaluation.y.max - evaluation.y.min);
    evaluation.y.mean   = Math.floor(evaluation.y.sum / evaluation.y.count);
    evaluation.y.mid    = (evaluation.y.min + Math.ceil(evaluation.y.delta / 2));
  }
  return evaluation;
}
CanvasCaptcha.prototype.init = function() {
  cc.drawShape();
}
CanvasCaptcha.prototype.inSquare = function(coords, squareParams, coordQuadrant) {
  switch (coordQuadrant) {
    case 1:
      return cc.inSquareQuadrant1(coords, squareParams);
      break;
    case 2:
      return cc.inSquareQuadrant2(coords, squareParams);
      break;
    case 3:
      return cc.inSquareQuadrant3(coords, squareParams);
      break;
    case 4:
      return cc.inSquareQuadrant4(coords, squareParams);
      break;
  }
  return false;
}
CanvasCaptcha.prototype.inSquareQuadrant1 = function(coords, squareParams) {
  if ((coords.x <= squareParams.q1x1) && (coords.x >= squareParams.q1x2)) {
    if (coords.y >= squareParams.q1y2) {
      return true;
    }
  } else if ((coords.x > squareParams.q1x1) && (coords.y <= squareParams.q1y1) && (coords.y >= squareParams.q1y2)) {
    return true;
  }
  return false;
}
CanvasCaptcha.prototype.inSquareQuadrant2 = function(coords, squareParams) {
  if ((coords.x >= squareParams.q2x1) && (coords.x <= squareParams.q2x2)) {
    if (coords.y >= squareParams.q1y2) {
      return true;
    }
  } else if ((coords.x < squareParams.q2x1) && (coords.y <= squareParams.q1y1) && (coords.y >= squareParams.q1y2)) {
    return true;
  }
  return false;
}
CanvasCaptcha.prototype.inSquareQuadrant3 = function(coords, squareParams) {
  if ((coords.x >= squareParams.q3x1) && (coords.x <= squareParams.q3x2)) {
    if (coords.y <= squareParams.q3y2) {
      return true;
    }
  } else if ((coords.x < squareParams.q3x1) && (coords.y >= squareParams.q3y1) && (coords.y <= squareParams.q3y2)) {
    return true;
  }
  return false;
}
CanvasCaptcha.prototype.inSquareQuadrant4 = function(coords, squareParams) {
  if ((coords.x <= squareParams.q4x1) && (coords.x >= squareParams.q4x2)) {
    if (coords.y <= squareParams.q4y2) {
      return true;
    }
  } else if ((coords.x > squareParams.q4x1) && (coords.y >= squareParams.q4y1) && (coords.y <= squareParams.q4y2)) {
    return true;
  }
  return false;
}
CanvasCaptcha.prototype.isSquare = function(evaluation) {
  var row, coords       = null;
  var hits              = 0;
  var misses            = 0;
  var squareParams      = {};
  var coordQuadrant     = 0;
  var hitPct            = 0;
  var xydelta           = 0;
  if ((evaluation.x.delta < cc.shapes.square.size) || (evaluation.y.delta < cc.shapes.square.size)) {
    return false;
  }
  if (evaluation.x.delta >= evaluation.y.delta) {
    xydelta = (evaluation.x.delta - evaluation.y.delta);
  } else {
    xydelta = (evaluation.y.delta - evaluation.x.delta);
  }
  if (xydelta >= cc.shapes.square.delta) {
    return false;
  }
  squareParams.di       = cc.shapes.square.interval;
  squareParams.halfdx   = Math.ceil(evaluation.x.delta / 2);
  squareParams.halfdy   = Math.ceil(evaluation.y.delta / 2);
  squareParams.dxi      = Math.ceil(evaluation.x.delta / squareParams.di);
  squareParams.dyi      = Math.ceil(evaluation.y.delta / squareParams.di);
  squareParams.midx     = evaluation.x.mid;
  squareParams.midy     = evaluation.y.mid;
  squareParams.xmin     = (squareParams.dxi * cc.shapes.square.deviation.min);
  squareParams.xmax     = (squareParams.dxi * cc.shapes.square.deviation.max);
  squareParams.ymin     = (squareParams.dyi * cc.shapes.square.deviation.min);
  squareParams.ymax     = (squareParams.dyi * cc.shapes.square.deviation.max);
  squareParams.q1x1     = (squareParams.midx - squareParams.xmin);
  squareParams.q1x2     = (squareParams.midx - squareParams.xmax);
  squareParams.q1y1     = (squareParams.midy - squareParams.ymin);
  squareParams.q1y2     = (squareParams.midy - squareParams.ymax);
  squareParams.q2x1     = (squareParams.midx + squareParams.xmin);
  squareParams.q2x2     = (squareParams.midx + squareParams.xmax);
  squareParams.q2y1     = (squareParams.midy - squareParams.ymin);
  squareParams.q2y2     = (squareParams.midy - squareParams.ymax);
  squareParams.q3x1     = (squareParams.midx + squareParams.xmin);
  squareParams.q3x2     = (squareParams.midx + squareParams.xmax);
  squareParams.q3y1     = (squareParams.midy + squareParams.ymin);
  squareParams.q3y2     = (squareParams.midy + squareParams.ymax);
  squareParams.q4x1     = (squareParams.midx - squareParams.xmin);
  squareParams.q4x2     = (squareParams.midx - squareParams.xmax);
  squareParams.q4y1     = (squareParams.midy + squareParams.ymin);
  squareParams.q4y2     = (squareParams.midy + squareParams.ymax);
  $.each(cc.drawCoords, function(row, coords) {
    coordQuadrant = cc.squareQuadrant(coords, evaluation);
    if (cc.inSquare(coords, squareParams, coordQuadrant) == true) {
      ++hits;
    } else {
      ++misses;
    }
  });
  hitPct  = Math.floor((hits / evaluation.x.count) * 100);
  if (hitPct >= cc.shapes.square.pass) {
    return true;
  }
  return false;
}
CanvasCaptcha.prototype.reset = function() {
  cc.isDrawing  = false;
  cc.shape      = 'square';
  cc.clearCanvas();
  cc.clearCoords();
  cc.clearStatus();
  return null;
}
CanvasCaptcha.prototype.showFail = function() {
  $('#' + cc.statusMessageId).hide();
  $('#' + cc.statusMessageId).html('<div class="alert alert-error">Fail</div>');
  $('#' + cc.statusMessageId).fadeIn();
  return null;
}
CanvasCaptcha.prototype.showPass = function() {
  $('#' + cc.statusMessageId).hide();
  $('#' + cc.statusMessageId).html('<div class="alert alert-success">Pass</div>');
  $('#' + cc.statusMessageId).fadeIn();
  return null;
}
CanvasCaptcha.prototype.squareQuadrant = function(coords, evaluation) {
  // Q1 -> Upper left
  // Q2 -> Upper right
  // Q3 -> Lower right
  // Q4 -> Lower left
  if ((coords.x < evaluation.x.mid) && (coords.y <= evaluation.y.mid)) {
    return 1;
  } else if ((coords.x >= evaluation.x.mid) && (coords.y <= evaluation.y.mid)) {
    return 2;
  } else if ((coords.x >= evaluation.x.mid) && (coords.y > evaluation.y.mid)) {
    return 3;
  } else {
    return 4;
  }
}
CanvasCaptcha.prototype.submit = function() {
  if (cc.triesLeft > 0) {
    var evaluation  = cc.evaluateCoords();
    var isValid     = false;
    cc.isDrawing    = false;
    cc.clearStatus();
    switch (cc.shape) {
      case 'square':
        isValid = cc.isSquare(evaluation);
        break;
    }
    if (isValid) {
      cc.showPass();
    } else {
      cc.showFail();
    }
    //--cc.triesLeft;
    cc.clearCanvas();
    cc.clearCoords();
  }
  return null;
}
