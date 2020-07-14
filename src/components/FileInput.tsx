import React from "react";
import {
  Box,
  InputLabel,
  Button,
  FormControl,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import { ValidationRules } from "react-hook-form";
import { FieldError } from "react-hook-form/dist/types/form";
import { green, red } from "@material-ui/core/colors";

type Props = {
  name: string;
  maxSize: number;
  value: FileList;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: (rules: any) => (ref: any) => void;
  errors: FieldError | undefined;
};

const useStyles = makeStyles((theme) => ({
  buttonSuccess: {
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[700],
    },
  },
  fileSuccess: {
    borderColor: green[300],
    color: green[100],
  },
  buttonError: {
    color: red[500],
    borderColor: red[500],
  },
}));

export default function FileInput({
  name,
  maxSize,
  errors,
  onFileUpload,
  register,
  value,
}: Props) {
  const classes = useStyles();

  const validateFile = (input: FileList | undefined): boolean | string => {
    if (!input || input.length === 0) return "Please upload the file";
    if (input[0].size > maxSize) return "Files size shoudn't exceed 5mb";
    return true;
  };

  return (
    <Box margin={4}>
      <input
        id="raised-button-file"
        multiple
        name={name}
        type="file"
        style={{ display: "none" }}
        onChange={onFileUpload}
        ref={register({
          validate: validateFile,
        })}
      />
      <InputLabel htmlFor="raised-button-file">
        <Button
          className={
            errors
              ? classes.buttonError
              : value && value.length > 0
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
      <FormControl error={!!errors}>
        <FormHelperText>{errors && errors.message}</FormHelperText>
      </FormControl>
    </Box>
  );
}
