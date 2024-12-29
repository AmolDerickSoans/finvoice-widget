// server.js
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const config = require('./webpack.config.js');

// Create Express app
const app = express();
const PORT = process.env.PORT || 4200;

// Modify webpack config for development server
const webpackConfig = {
  ...config,
  entry: {
    popup: ['webpack-hot-middleware/client?reload=true', './styles/tailwind.css', './public/popup/popup.js']
  },
  plugins: [
    ...config.plugins,
    new webpack.HotModuleReplacementPlugin()
  ]
};

// Create webpack compiler
const compiler = webpack(webpackConfig);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Use webpack-dev-middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath || '/',
  writeToDisk: true
}));

// Use webpack-hot-middleware
app.use(webpackHotMiddleware(compiler));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'popup.html'));
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
  } else {
    console.log(`Server running at http://localhost:${PORT}`);
  }
});