const path = require('path');

exports.rootDir = path.dirname(require.main.filename); // this is sent as the property of an object so it needs to be deconstructed: {rootDir} or used as variable.rootDir
