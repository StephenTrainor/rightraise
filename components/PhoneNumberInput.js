import TextField from "@mui/material/TextField";
import { PatternFormat } from "react-number-format";

export default function PhoneNumberInput(props) {
    const { id, mask, locationPrefix, userInput, inputErrors, setInputErrors, setUserInput, errorText, update, ...otherProps } = props;

    const handleInputChange = (values, sourceInfo) => {
        setUserInput({
            ...userInput,
            [id]: values.value
        });

        if (values.value === '') {
            setInputErrors({
                ...inputErrors,
                [id]: true,
            });
        }
        else {
            setInputErrors({
                ...inputErrors,
                [id]: false,
            });
        }
    };

    return (
        <PatternFormat
            id={id}
            label={id}
            error={inputErrors[id]}
            helperText={(inputErrors[id] ? (errorText[id] ? errorText[id] : "Required Field") : "")}
            value={userInput[id]}
            required
            fullwidth
            variant="outlined"
            autoComplete="off"
            customInput={TextField}
            onValueChange={(values, sourceInfo) => handleInputChange(values, sourceInfo)}
            mask={mask}
            allowEmptyFormatting
            format={`+${locationPrefix} (###) ### ####`}
            otherProps
        />
    );
}

PhoneNumberInput.defaultProps = {
    mask: "_",
    locationPrefix: "1",
    errorText: {},
    userInput: {},
    inputErrors: {},
    setInputErrors: () => {},
    setUserInput: () => {},
}
