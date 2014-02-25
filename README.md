# can.viewify

[can.viewify](https://github.com/zkat/can.viewify) is a
[browserify](http://browserify.org/) transform that allows you to `require()`
`.mustache` and `.ejs` files as precompiled
[CanJS views](http://canjs.com/docs/can.view.html).

# Quickstart

### Install

    $ npm install can.viewify

### Examples

#### Command Line

```
browserify -t can.viewify main.js -o bundle.js
```

#### API

```javascript
var browserify = require('browserify');
var fs = require('fs');

var b = browserify('main.js');
b.transform('can.viewify');

b.bundle().pipe(fs.createWriteStream('bundle.js'));
```

#### package.json

For packages that include these views, add a browserify transform field to
`package.json` and browserify will apply the transform to all modules in the
package as it builds a bundle. Note that `can.view` must be accessible globally
in `window`, at runtime.

```
{
  "name": "anchor",
  "main": "main",
  "browserify": {
    "transform": "can.viewify"
  }
}
```

### Issues

* `can.view` must be present globally in order for these views to work at
  runtime, otherwise they will return plain strings. In the future, this module
  will generate modules that explicitly `require('can')` or `require('canjs')`
  or something of the sort.

### License

`can.viewify` is a public domain work, dedicated using
[CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Feel free to do
whatever you want with it.
