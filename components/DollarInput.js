import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';

export default function DollarInput(props) {
    const {inputErrors, setInputErrors, userInput, setUserInput, prefix, decimalScale, allowNegative, allowLeadingZeros, fixedDecimalScale, id, ...otherProps} = props;

    const handleInputChange = (values, sourceInfo) => {
        setUserInput({
            ...userInput,
            [id]: values.floatValue
        })

        if (typeof values.value === 'undefined') {
            setInputErrors({
                ...inputErrors,
                [id]: true,
            });
        }
        else{
            setInputErrors({
                ...inputErrors,
                [id]: false,
            });
        }
    };

    return (
        <NumericFormat 
            required
            fullWidth
            variant="outlined"
            autoComplete="off"
            customInput={TextField}
            prefix={prefix}
            decimalScale={decimalScale}
            allowNegative={allowNegative}
            allowLeadingZeros={allowLeadingZeros}
            fixedDecimalScale={fixedDecimalScale}
            onValueChange={(values, sourceInfo) => handleInputChange(values, sourceInfo)}
            id={id}
            label={id}
            error={inputErrors[id]}
            helperText={(inputErrors[id] ? "Required Field" : "")}
            value={userInput[id]}
            otherProps
        />
    );
};

DollarInput.defaultProps = {
    prefix: "$",
    decimalScale: 2,
    allowNegative: false,
    allowLeadingZeros: false,
    fixedDecimalScale: true,
    userInput: {},
    inputErrors: {},
    setInputErrors: () => {},
    setUserInput: () => {},
}
