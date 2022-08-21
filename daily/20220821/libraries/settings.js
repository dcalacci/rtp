
let _GUI = function(settings) {
  // settings is an object where each key is a 
  // setting, and its value is of the form:
  // [default, min, max, stepSize]
  // e.g. {circle_radius: [2, 0.5, 10, 0.1]}
  this.config = _.mapValues(settings, (o) => o[0])
  this.gui = new dat.GUI();
  this.gui.useLocalStorage = true
}

_GUI.prototype.startGUI = function(redrawSketch) {
  controllers = []
  _.forEach(settings, (([dd, min, max, step], k) => {
    controllers.push(this.gui.add(this.config, k, min, max, step));
  }))

  // adds redraw button
  var obj = {
    REDRAW: redrawSketch
  };
  controllers.push(this.gui.add(obj, 'REDRAW'))
}

function keyPressed() {
  if (key == "s") {
    fname = 'daily_' + new Date().toJSON()
    save(fname + "_" + SEED + ".png")
    saveJSON(settings, fname + ".json")
  }
}


