import { makeStyles } from "@material-ui/core";
import { green, yellow, red } from "@material-ui/core/colors";

const useFormStyles = makeStyles((theme) => ({
    formControl: {
      minWidth: 120,
      marginTop: theme.spacing(1),
    },
    selectEmpty: {
      marginTop: theme.spacing(0),
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
      display: "flex",
      justifyContent: "center",
    },
    spinnerProgress: {
      color: green[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -24,
    },
    buttonProgress: {
      color: yellow[300],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
    buttonError: {
      color: red[500],
      borderColor: red[500],
    },
    loadingWrapper: {
      height: "200px",
      position: "relative",
    },
  }));

  export default useFormStyles;