"use strict";

var through = require("through"),
    path = require("path");

function compile(engine, data) {
  function view() {
    var x = data;
    if (!window.can || !window.can.view.engine) {
      console.warn("can.viewify requires that can.view.engine be "+
                   "previously loaded into the window. Sorry!");
      return x;
    } else {
      return window.can.view.engine(x);
    }
  }
  var compiled = "module.exports = (" + view.toString().replace(
      /data/, JSON.stringify(data)).replace(/engine/g, engine) + ")();";
  return compiled;
}

module.exports = function (file) {
  var data = "",
      ext = path.extname(file).substr(1);

  function write (buf) { data += buf; }
  function end (engine) {
    return function() {
      this.queue(compile(engine, data));
      this.queue(null);
    };
  }

  switch (ext) {
  case "mustache":
  case "ejs":
    return through(write, end(ext));
  default:
    return through();
  }
};
