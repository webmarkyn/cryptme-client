import React from "react";
import Button from "@material-ui/core/Button";
import { Container, Typography, makeStyles } from "@material-ui/core";
import Features from "./Features";
import { cyan } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(4),
    letterSpacing: theme.spacing(1),
  },
  colorPrimary: {
    color: cyan[500]
  }
}));

function App() {
  const styles = useStyles();
  return (
    <div className="app">
      <Container maxWidth="sm">
        <Typography variant="h1" className={styles.title} align="center">
          <span className={styles.colorPrimary}>C</span>rypt<span className={styles.colorPrimary}>M</span>e
        </Typography>
        <Features />
      </Container>
    </div>
  );
}

export default App;
