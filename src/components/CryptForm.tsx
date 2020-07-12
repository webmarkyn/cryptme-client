import React from "react";
import download from "downloadjs";
import {
  FormControl,
  InputLabel,
  TextField,
  MenuItem,
  Select,
  makeStyles,
  Button,
  Box,
  CircularProgress,
  FormHelperText,
} from "@material-ui/core";
import { useForm, Controller } from "react-hook-form";
import { green, red, yellow } from "@material-ui/core/colors";
import { SubmitHandler } from "react-hook-form/dist/types/form";
import useUpdateEffect from "../hooks/useUpdateEffect";
import Alert from "@material-ui/lab/Alert";
import InfoPopup from "./InfoPopup";
import { cryptApiContext } from "../context";
import randomString from "randomstring";

type AlgoList = {
  [key: string]: {
    keyLength: number;
    ivLength: number;
  };
};

type FormInputs = {
  key: string;
  salt: string;
  algo: string;
  file: FileList;
};

const useStyles = makeStyles((theme) => ({
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
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
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
  fileSuccess: {
    borderColor: green[300],
    color: green[100],
  },
  buttonError: {
    color: red[500],
    borderColor: red[500],
  },
  loadingWrapper: {
    height: "200px",
    position: "relative",
  },
  box: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    '&>.MuiFormControl-root': {
      flex: 2
    },
    '&>button': {
      flex: 1,
      marginLeft: theme.spacing(3),
    }
  },
}));

type Props = {
  title: string;
  cryptMethod: ({}: FormInputs) => Promise<Blob>
};

export default function CryptForm({ title, cryptMethod }: Props) {
  const classes = useStyles();
  const cryptApi = React.useContext(cryptApiContext);
  const [loading, setLoading] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);
  const [, setSuccess] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [uploadingError, setUploadingError] = React.useState(false);
  const [algorithms, setAlgorithms] = React.useState<AlgoList>({});
  const [error, setLocalError] = React.useState(false);
  const {
    register,
    handleSubmit,
    errors,
    watch,
    control,
    getValues,
    trigger,
    setError,
    setValue
  } = useForm<FormInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const algoInput = watch("algo");
  const [algo, setAlgo] = React.useState(algoInput);
  console.log(algo)

  const loadAlgorithms = async () => {
    setLoading(true);
    try {
      const data = await cryptApi.loadAlgorithms();
      setAlgorithms(data);
      setLoading(false);
    } catch (e) {
      setLocalError(true);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAlgorithms();
  }, []);

  useUpdateEffect(() => {
    setAlgo(algoInput);
  }, [algoInput]);

  useUpdateEffect(() => {
    if (getValues("key")) trigger("key");
    if (getValues("salt")) trigger("salt");
  }, [algo]);

  const onSubmit: SubmitHandler<FormInputs> = async ({
    key,
    salt,
    algo,
    file,
  }) => {
    setUploading(true);
    setUploadingError(false);
    try {
      const { name, type } = file[0];
      const blob = await cryptMethod({
        key,
        salt,
        file: file as FileList,
        algo,
      });
      download(blob, `${name}`, type);
      setUploading(false);
      setUploadingError(false);
    } catch (e) {
      setUploading(false);
      setUploadingError(true);
    }
    setOpenPopup(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length >= 1) {
      setSuccess(true);
    }
  };

  const validateFile = (input: FileList | undefined): boolean | string => {
    if (!input || input.length === 0) return "Please upload the file";
    if (input[0].size > 41943040) return "Files size shoudn't exceed 5mb";
    return true;
  };

  const validateInput = (input: string, type: string): boolean | string => {
    if (!input) return "This field is required";
    if (!algo) return true;
    switch (type) {
      case "key":
        if (input.length !== algorithms[algo].keyLength)
          return `Key should have the length of ${algorithms[algo].keyLength}`;
        break;
      case "salt":
        if (input.length !== algorithms[algo].ivLength)
          return `Salt should have the length of ${algorithms[algo].ivLength}`;
        break;
      default:
        return true;
        break;
    }
    return true;
  };

  const generateRndValue = (inp: "key" | "salt") => {
    const algo = getValues("algo")
      const len = inp ===  'key' ? algorithms[algo].keyLength : algorithms[algo].ivLength;
      setValue(inp, randomString.generate(len))
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenPopup(false);
  };

  if (error)
    return (
      <Alert severity="error">An error occurred! Please retry later.</Alert>
    );

  if (loading)
    return (
      <Box className={classes.loadingWrapper}>
        <CircularProgress size={56} className={classes.spinnerProgress} />
      </Box>
    );

  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <InfoPopup
        open={openPopup}
        duration={2000}
        handleClose={handleClose}
        error={uploadingError}
      />
      <FormControl className={classes.formControl} error={!!errors.algo}>
        <InputLabel>Encryption Algorithm</InputLabel>
        <Controller
          as={Select}
          control={control}
          name="algo"
          defaultValue=""
          onChange={(e: any) => {
            console.log(e);
            return e;
          }}
          rules={{ required: "Select algorithm" }}
        >
          {Object.keys(algorithms).map((algo) => (
            <MenuItem value={algo} key={algo}>
              {algo}
            </MenuItem>
          ))}
        </Controller>
        <FormHelperText>{errors.algo && errors.algo.message}</FormHelperText>
      </FormControl>
      <Box className={classes.box}>
        <TextField
          required
          name="key"
          error={!!errors.key}
          helperText={errors.key ? errors.key.message : null}
          inputRef={register({
            validate: (inp) => validateInput(inp, "key"),
          })}
          label={`Key ${
            algo ? `(${algorithms[algo].keyLength} characters)` : ""
          }`}
          margin="normal"
        />
        <Button disabled={algo === "algo" || !algo} variant="outlined" onClick={() => generateRndValue("key")} color="primary">Generate</Button>
      </Box>
      <Box className={classes.box}>
        <TextField
          required
          name="salt"
          error={!!errors.salt}
          helperText={errors.salt ? errors.salt.message : null}
          inputRef={register({
            validate: (inp) => validateInput(inp, "salt"),
          })}
          label={`Salt ${
            algo ? `(${algorithms[algo].ivLength} characters)` : ""
          }`}
          margin="normal"
          
        />
        <Button variant="outlined" color="primary" disabled={algo === "algo" || !algo} onClick={() => generateRndValue("salt")}>Generate</Button>
      </Box>
      <Box margin={4}>
        <input
          id="raised-button-file"
          multiple
          name="file"
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          ref={register({
            validate: validateFile,
          })}
        />
        <InputLabel htmlFor="raised-button-file">
          <Button
            className={
              errors.file
                ? classes.buttonError
                : getValues("file") && getValues("file").length > 0
                ? classes.fileSuccess
                : ""
            }
            component="span"
            variant="outlined"
            color="primary"
            fullWidth
          >
            Upload File
          </Button>
        </InputLabel>
        <FormControl error={!!errors.file}>
          <FormHelperText>{errors.file && errors.file.message}</FormHelperText>
        </FormControl>
      </Box>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          disabled={uploading}
          type="submit"
        >
          {title}
        </Button>
        {uploading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </form>
  );
}
