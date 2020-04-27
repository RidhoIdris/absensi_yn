import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';

class InputValidator extends ValidatorComponent {

    render() {
        const { errorMessages, validators, requiredError, validatorListener, ...rest } = this.props;

        return (
            <>
                <input 
                    className={this.state.isValid ? 'form-control' : 'form-control invalid'}
                    {...rest}
                    ref={(r) => { this.input = r; }}
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

export default InputValidator;