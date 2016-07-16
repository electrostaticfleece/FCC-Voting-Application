import express from 'express';
import webpack from 'webpack';
import { ENV } from './config/appConfig';
import { connect } from './db/postgres';
import passportConfig from './config/passport';
import expressConfig from './config/express';
import routesConfig from './config/routes';
import webpackDevConfig from '../webpack/webpack.config.dev-client';

const App = require('../public/assets/server');
const app = express();

connect();

// Configures passport settings by serializing/deserializing users
// and sets up the google strategy
passportConfig();

if(ENV === 'development'){
  const compiler = webpack(webpackDevConfig);
  app.use(require('webpack-dev-middleware')(compiler,{
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}

// Configures express settings, sets up session handling 
// via express-session, and initializes passport.
expressConfig(app);


//Currently sets up routes to handle authentication via 
//passport, but will include API calls using controllers later. 
routesConfig(app);

app.get('*', App.default);

app.listen(app.get('port'), ()=> {
  console.log('Listening on port ' + app.get('port'));
});