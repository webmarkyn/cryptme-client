import React from "react";
import { List, ListItem, ListItemText, Paper } from "@material-ui/core";

type SubInfo = {
  key: string;
  salt: string;
  algo: string;
};

type HistoryItems = {
  [date: string]: {
    name: string;
  } & SubInfo;
};

export default function History() {
  let history = localStorage.history || "{}";
  history = JSON.parse(history);

  const transformDate = (date: string) => {
      const newDate = new Date(date);
      return `${newDate.getMonth()}/${newDate.getDate()} ${newDate.getHours()}:${newDate.getMinutes()}`
  }

  const subInfo = ({ algo, key, salt }: SubInfo) => (
    <div>
      <p>Key: {key}</p>
      <p>Salt: {salt}</p>
      <p>Algorithm: {algo}</p>
    </div>
  );

  if (!history || Object.entries(history).length < 1) return (
    <p style={{textAlign: 'center'}}>You have no history yet</p>
  )

  return (
    <Paper>
      <List>
            {Object.keys(history).map((key, index) => (
              <ListItem>
                <ListItemText
                primary={`${history[key].name} - ${transformDate(key)}`}
                secondary={subInfo(history[key])}
              />
              </ListItem>
            ))}      
        
      </List>
    </Paper>
  );
}
