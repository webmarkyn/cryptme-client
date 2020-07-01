import React from 'react';
import {FormControl, Input, InputLabel, TextField, MenuItem, Select, NativeSelect, makeStyles, Button, Box, CircularProgress} from "@material-ui/core";
import { green } from '@material-ui/core/colors';

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
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -24,
      },
      loadingWrapper: {
          height: '200px',
          position: 'relative',
      }
  }));

export default function CryptForm () {
    const classes = useStyles();
    const [age, setAge] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [success, setSuccess] = React.useState(false);

    const timer = React.useRef<any>();

    const handleChange = (event: React.ChangeEvent<any>) => {
        setAge(event.target.value);
    };

    React.useEffect(() => {
        return () => {
          clearTimeout(timer.current);
        };
      }, []);

    const handleButtonClick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = setTimeout(() => {
              setSuccess(true);
              setLoading(false);
            }, 2000);
          }
    }

    if (loading) return <Box className={classes.loadingWrapper}><CircularProgress size={56} className={classes.buttonProgress} /></Box>

    return (
        <form style={{display: "flex", flexDirection: "column"}}>
            <TextField required label="Key" margin="normal" />
            <TextField required label="Salt" margin="normal"/>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Encription Algorithm</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
                >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
                </Select>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </FormControl>
            <input  
            id="raised-button-file" 
            multiple 
            type="file" 
            style={{display: 'none'}}
            /> 
            <Box margin={4}>
                <InputLabel htmlFor="raised-button-file"> 
                    <Button component="span" fullWidth> 
                        Upload File
                    </Button> 
                </InputLabel> 
            </Box>
            <div className={classes.wrapper}>
                <Button
                variant="contained"
                color="primary"
                className={success ? classes.buttonSuccess : ''}
                disabled={loading}
                onClick={handleButtonClick}
                type="submit"
                >
                Accept terms
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
        </form>
    )
}