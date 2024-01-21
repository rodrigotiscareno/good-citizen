import React from "react"
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

function EventInviteCriteria(props) {
    return (
        <>
            <h3>Select Invitation Criteria</h3>
            <FormControl component="fieldset">
                <RadioGroup row aria-label="position" name="position" defaultValue={1}>
                    <FormControlLabel
                        control={<Radio checked={props.criteria === 'Children'}
                            value={"Children"}
                            onChange={props.handleChange}
                            color="primary" />}
                        label="Children"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        control={<Radio checked={props.criteria === 'Young Adults'}
                            value={'Young Adults'}
                            onChange={props.handleChange}
                            color="primary" />}
                        label="Younger Adults"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        control={<Radio checked={props.criteria === 'Adults'}
                            value={'Adults'}
                            onChange={props.handleChange}
                            color="primary" />}
                        label="Adults"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        control={<Radio checked={props.criteria === 'Elderly'}
                            value={'Elderly'}
                            onChange={props.handleChange}
                            color="primary" />}
                        label="Elderly"
                        labelPlacement="top"
                    />
                    <FormControlLabel
                        control={<Radio checked={props.criteria === 'Open to Any Age'}
                            value={"Open to Any Age"}
                            onChange={props.handleChange}
                            color="primary" />}
                        label="Open to Any Age"
                        labelPlacement="top"
                    />
                </RadioGroup>
            </FormControl>
        </>
    )
}

export default EventInviteCriteria