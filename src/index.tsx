import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {createMuiTheme, CssBaseline, responsiveFontSizes, ThemeProvider} from "@material-ui/core";
import * as serviceWorker from './serviceWorker';
import { cyan, yellow } from '@material-ui/core/colors';

let theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: cyan,
    secondary: yellow
  }
})
theme = responsiveFontSizes(theme);


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
