# modular-site.js
modular boiler-plate site built using node.js and express

## initialization

use `npm install package.json` in the __/src__ directory.

## usage
Views are located in the __src/views-js/main.js__ file with the following format:

```javascript
{
    position:"lower" or "upper",
    link: "/link",
    label: "Name",
    logginRequire: false, true, or undefined
    get: links => function (req, res) {
        //view function
      }
  },
```

__position__ describe if the link is in the top or lower navbar,

if __logginRequire__ is `true`, the view can only be accessed if the user is logged in, if `false`, it can can only be accessed if the user is not logged in, if `undefined` it can be accessed in both case.

Helper functions are located in the __src/views-js/modules/functions.js__ file.

Imports are located in the __src/views-js/modules/library.js__ file.

Constants are located in the __src/views-js/modules/constants.json__ file.

__ejs__ views are located in the __src/views__ folder.
