import React from "react";
import { List, ListItem, ListItemText, Paper, ListItemSecondaryAction, Button } from "@material-ui/core";

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
  const [history, setHistory] = React.useState(JSON.parse(localStorage.history || "{}"))

  const transformDate = (date: string) => {
      const newDate = new Date(date);
      const month = newDate.getMonth();
      const dayDate = newDate.getDate()
      return `${month.toString().length < 2 ? `0${month}` : month}/${dayDate.toString().length < 2 ? `0${dayDate}` : dayDate} ${newDate.getHours()}:${newDate.getMinutes()}`
  }

  const onDelete = (key: string) => {
    const newHistory = {...history};
    delete newHistory[key];
    localStorage.history = JSON.stringify(newHistory);
    setHistory(newHistory);
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
                <ListItemSecondaryAction>
                  <Button onClick={() => onDelete(key)}>Delete</Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}      
        
      </List>
    </Paper>
  );
}
