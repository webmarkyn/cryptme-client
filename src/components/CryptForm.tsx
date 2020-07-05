import React from "react";
import download from "downloadjs";
import {
  FormControl,
  Input,
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
import { green, red } from "@material-ui/core/colors";
import { Validate, SubmitHandler } from "react-hook-form/dist/types/form";

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
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -24,
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
}));

export default function CryptForm() {
  const classes = useStyles();
  const [algo, setAlgo] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const [algorithms, setAlgorithms] = React.useState<AlgoList>({});
  const [error, setError] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const { register, handleSubmit, errors, watch, control, getValues, trigger } = useForm<
    FormInputs
  >({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const keyInput = React.useRef<any>();
  const saltInput = React.useRef<any>();

  const handleChange = (event: React.ChangeEvent<any>) => {
    console.log('hello')
    setAlgo(event.target.value);
  };

  const loadAlgorithms = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:3000/api/algorithms");
      const data: AlgoList = await response.json();
      setAlgorithms(data);
      setLoading(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAlgorithms();
  }, []);

  const onSubmit: SubmitHandler<FormInputs> = ({key, salt, algo, file}) => {
    const formData = new FormData();
    const { name, type } = file[0];
    const ext = type.split("/").pop();
    formData.append("key", key);
    formData.append("salt", salt);
    formData.append("algo", algo);
    formData.append("file", file[0] as File);
    fetch("http://127.0.0.1:3000/api/encrypt", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.blob())
      .then((blob) => download(blob, `encrypted_${name}`, type));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length >= 1) {
      setFile(e.target.files[0]);
    }
  };

  const validateFile = (input: FileList | undefined): boolean | string => {
    if (!input || input.length === 0) return "Please upload the file";
    if (input[0].size > 41943040) return "Files size shoudn't exceed 5mb";
    return true;
  };


  if (error) return <h2>Error</h2>;

  if (loading)
    return (
      <Box className={classes.loadingWrapper}>
        <CircularProgress size={56} className={classes.buttonProgress} />
      </Box>
    );

  return (
    <form
      style={{ display: "flex", flexDirection: "column" }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        required
        name="key"
        error={!!errors.key}
        helperText={errors.key ? errors.key.message : null}
        inputRef={register({
          required: true,
          minLength: algo ? algorithms[algo].keyLength : 0,
          maxLength: {
            value: algo ? algorithms[algo].keyLength : 100,
            message: algo
              ? `Key should have the length of ${algorithms[algo].keyLength}`
              : "Please choose the ecnryption algorithm",
          },
        })}
        label={`Key ${
          algo ? `(${algorithms[algo].keyLength} characters)` : ""
        }`}
        margin="normal"
      />
      <TextField
        required
        name="salt"
        error={!!errors.salt}
        helperText={errors.salt ? errors.salt.message : null}
        inputRef={register({
          required: true,
          minLength: algo ? algorithms[algo].ivLength : 0,
          maxLength: {
            value: algo ? algorithms[algo].ivLength : 100,
            message: algo
              ? `Salt should have the length of ${algorithms[algo].ivLength}`
              : "Please choose the ecnryption algorithm",
          },
        })}
        label={`Salt ${
          algo ? `(${algorithms[algo].ivLength} characters)` : ""
        }`}
        margin="normal"
      />
      <FormControl className={classes.formControl} error={!!errors.algo}>
        <InputLabel>Encryption Algorithm</InputLabel>
        <Controller
          as={Select}
          control={control}
          name="algo"
          defaultValue=""
          onChange={(e:any) => {console.log(e);return e}}
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
                : getValues("file") && getValues("file").length > 0 ? classes.fileSuccess : ""
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
          className={success ? classes.buttonSuccess : ""}
          disabled={loading}
          type="submit"
        >
          Encrypt file!
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </form>
  );
}
