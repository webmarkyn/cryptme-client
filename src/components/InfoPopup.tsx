import React, { FunctionComponent } from "react";
import { Snackbar, makeStyles } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type Props = {
  open: boolean;
  duration: number;
  handleClose: (event?: React.SyntheticEvent, reason?: string) => void;
  error: boolean;
};

export default function InfoPopup({
  open,
  duration,
  handleClose,
  error
}: Props) {
  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
      <Alert onClose={handleClose} severity={!error ? "success" : "error"}>
        {!error ? 'Success!' : 'Error! Please try later.'}
      </Alert>
    </Snackbar>
  );
}
