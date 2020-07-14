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
import SecureInput from "./SecureInput";
import FileInput from "./FileInput";

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
}));

type Props = {
  title: string;
  cryptMethod: ({}: FormInputs) => Promise<Blob>;
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
    setValue,
  } = useForm<FormInputs>({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const algoInput = watch("algo");
  const [algo, setAlgo] = React.useState(algoInput);
  console.log(algo);

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
    const algo = getValues("algo");
    const isKey = inp === "key";
    const len = isKey ? algorithms[algo].keyLength : algorithms[algo].ivLength;
    setValue(inp, randomString.generate(len));
    trigger(inp);
  };

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
      <SecureInput
        name="key"
        algo={algo}
        register={register}
        rules={{
          validate: (inp) => validateInput(inp, "key"),
        }}
        length={algo ? algorithms[algo].keyLength : 0}
        errors={errors.key}
        onGenerate={() => generateRndValue("key")}
      />
      <SecureInput
        name="salt"
        algo={algo}
        register={register}
        rules={{
          validate: (inp) => validateInput(inp, "salt"),
        }}
        length={algo ? algorithms[algo].ivLength : 0}
        errors={errors.salt}
        onGenerate={() => generateRndValue("salt")}
      />
      <FileInput name="file" maxSize={41943040} errors={errors.file} onFileUpload={handleFileUpload} register={register} value={getValues("file") as FileList} />
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
