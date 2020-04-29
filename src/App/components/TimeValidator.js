import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class TimeValidator extends ValidatorComponent {

    render() {
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <>
                <DatePicker
                    {...rest}
                    ref={(r) => { this.input = r; }}
                    wrapperClassName="col-12"
                    className={this.state.isValid ? 'form-control' : 'form-control invalid'}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                />
                {this.errorText()}
            </>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }
        
        return (
            <small className="form-text text-danger text-left">{this.getErrorMessage()}</small>
        );
    }
}

export default TimeValidator;