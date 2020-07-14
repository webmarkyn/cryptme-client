import React, { RefObject } from 'react'
import { Box, TextField, Button, makeStyles } from '@material-ui/core';
import { ValidationRules } from 'react-hook-form';
import { FieldErrors, Ref, FieldError } from 'react-hook-form/dist/types/form';

type InputTypes = {
    key: string;
    salt: string;
}

type Props = {
    name: "key" | "salt";
    algo: string;
    register: (rules: any) => (ref: any) => void;
    rules: ValidationRules;
    onGenerate: (inp: "key" | "salt") => void;
    length: number;
    errors: FieldError | undefined;
}

const useStyles = makeStyles((theme) => ({
    box: {
      display: "flex",
      alignContent: "center",
      alignItems: "center",
      "&>.MuiFormControl-root": {
        flex: 2,
      },
      "&>button": {
        flex: 1,
        marginLeft: theme.spacing(3),
      },
    },
  }));

export default function SecureInput({name, algo, register, rules, onGenerate, length, errors}: Props) {
    const classes = useStyles();
    return (
        <Box className={classes.box}>
        <TextField
          label={`${name} ${
            algo ? `(${length} characters)` : ""
          }`}
          error={!!errors}
          helperText={errors ? errors.message : null}
          name={name}
          inputRef={register(rules)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          disabled={algo === "algo" || !algo}
          variant="outlined"
          onClick={() => onGenerate(name)}
          color="primary"
        >
          Generate
        </Button>
      </Box>
    )
}