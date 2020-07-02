import React from 'react';
import {FormControl, Input, InputLabel, TextField, MenuItem, Select, NativeSelect, makeStyles, Button, Box, CircularProgress} from "@material-ui/core";
import { green } from '@material-ui/core/colors';

type AlgoList = {
    [key: string]: {
        keyLength: number,
        ivLength: number,
    }
}

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
    const [algo, setAlgo] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [success, setSuccess] = React.useState(false);
    const [algorithms, setAlgorithms] = React.useState<AlgoList>({})
    const [error, setError] = React.useState(false)
    const [file, setFile] = React.useState<any | null>(null)

    const handleChange = (event: React.ChangeEvent<any>) => {
        setAlgo(event.target.value);
    };

    const loadAlgorithms = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:3000/api/algorithms');
            const data: AlgoList = await response.json();
            setAlgorithms(data);
            setLoading(false);
        } catch (e) {
            setError(true)
            setLoading(false)
        }
    }

    React.useEffect(() => {
        loadAlgorithms()
      }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length >= 1) {
            setFile(e.target.files[0])
        }
    }

    if (error) return <h2>Error</h2>

    if (loading) return <Box className={classes.loadingWrapper}><CircularProgress size={56} className={classes.buttonProgress} /></Box>

    return (
        <form style={{display: "flex", flexDirection: "column"}}>
            <TextField required label={`Key ${ algo ? `(${algorithms[algo].keyLength} characters)`: ''}`} margin="normal" />
            <TextField required label={`Salt ${ algo ? `(${algorithms[algo].ivLength} characters)`: ''}`} margin="normal"/>
            <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Encription Algorithm</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={algo}
                onChange={handleChange}
                >
                    {Object.keys(algorithms).map(algo => <MenuItem value={algo}>{algo}</MenuItem>)}
                </Select>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </FormControl>
            <input  
            id="raised-button-file" 
            multiple 
            type="file" 
            style={{display: 'none'}}
            onChange={handleFileUpload}
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
                onClick={handleSubmit}
                type="submit"
                >
                Accept terms
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
        </form>
    )
}