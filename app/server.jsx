import axios from 'axios';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createMemoryHistory, match, RouterContext } from 'react-router';
import { Provider } from 'react-redux';
import createRoutes from 'routes'
import configureStore from 'store/configureStore';
import preRenderMiddleware from 'middlewares/preRenderMiddleware';
import header from 'components/Meta';

const clientConfig = {
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || '5000'
};

axios.defaults.baseURL = `http://${clientConfig.host}:${clientConfig.port}`;

export default function render(req, res) {
  const authenticated = req.isAuthenticated();
  const history = createMemoryHistory();
  const store = configureStore({
    user: {
      authenticated,
    }
  }, history);
  const routes = createRoutes(store);
  
  match({routes, location: req.url}, (err, redirect, props) => {
    if (err) {
      res.status(500).json(err);
    } else if (redirect) {
      res.redirect(302, redirect.pathname + redirect.search);
    } else if (props) {
      preRenderMiddleware(
        store.dispatch,
        props.components,
        props.params
      )
      .then(() => {
        const initialState = store.getState();
        const componentHTML = renderToString(
          <Provider store={store}>
            <RouterContext {...props} />
          </Provider>
        );
        res.status(200).send(`
          <!doctype html>
          <html ${header.htmlAttributes.toString()}>
            <head>
              ${header.title.toString()}
              ${header.meta.toString()}
              ${header.link.toString()}
            </head>
            <body>
              <div id="app">${componentHTML}</div>
              <script>window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};</script>
              <script type="text/javascript" charset="utf-8" src="/assets/app.js"></script>
            </body>
          </html>
        `);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
    } else {
      res.sendStatus(404);
    }
  });
}