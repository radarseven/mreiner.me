var webpack    = require('webpack');
var path       = require('path');

module.exports = {
  entry: './src/js/entry.js',
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: 'app.js'
  },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: "babel-loader"
            }
        ]
    },
    watch: true
};
