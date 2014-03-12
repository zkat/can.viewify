"use strict";

var through = require("through"),
    jsdom = require("jsdom"),
    fs = require("fs"),
    path = require("path");

function compile(opts, data, callback) {
  jsdom.env({
    html: "<h1>can.viewify</h1>",
    src: [
      fs.readFileSync(require.resolve("jquery/jquery.js")),
      fs.readFileSync(require.resolve("canjs/can.jquery.js")),
      fs.readFileSync(require.resolve("canjs/can.ejs.js"))
    ],
    done: function(err, win) {
      if (err) {
        callback(err);
      } else {
        var can = win.can;
        for(var key in can.view.Scanner.tags) {
          if (can.view.Scanner.tags.hasOwnProperty(key)) {
            can.view.Scanner.tags[key] = Function.prototype;
          }
        }
        var script = can.view.types["."+opts.ext].script(opts.filename, data);
        callback(null, script);
      }
    }
  });
}

module.exports = function (file, opts) {
  var data = "",
      ext = path.extname(file).substr(1);

  function write (buf) { data += buf; }
  function end () {
    var stream = this;
    compile({ext: ext, filename: file}, data, function(err, script) {
      stream.queue("module.exports = ("+script+");");
      stream.queue(null);
    });
  }
  switch (ext) {
  case "mustache":
  case "ejs":
    return through(write, end);
  default:
    return through();
  }
};
