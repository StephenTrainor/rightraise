import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const whiteTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FFFFFF',
        },
    },
});

export default function TextInput({id, userInput, update, multiline, inputErrors, setInputErrors}) {

    const handleInputChange = (e) => {
        update(e);
        
        if (!e.target.value) {
            setInputErrors({
                ...inputErrors,
                [id]: true
            });
        }
        else {
            setInputErrors({
                ...inputErrors,
                [id]: false
            });
        }
    }

    return (
        <ThemeProvider theme={whiteTheme}>
            <TextField 
                required
                fullWidth
                multiline={multiline}
                value={userInput[id]}
                id={id}
                label={id}
                variant="outlined"
                autoComplete='off'
                error={inputErrors[id]}
                helperText={(inputErrors[id]) ? "Required Field" : ""}
                onChange={(e) => handleInputChange(e)}
            />
        </ThemeProvider>
    );
};

TextInput.defaultProps = {
    id: '',
    userInput: {},
    inputErrors: {},
    setInputErrors: () => {},
    update: () => {},
    multiline: false,
}
