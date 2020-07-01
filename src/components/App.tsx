import React from 'react';
import Button from '@material-ui/core/Button';
import {Container, Typography} from "@material-ui/core";
import Features from './Tabs';


function App() {
  return (
    <div className="App">
      <Container maxWidth="sm">
        <Typography variant="h1" align="center" color="secondary">CryptMe</Typography>
        <Features />
      </Container>
    </div>
  );
}

export default App;
