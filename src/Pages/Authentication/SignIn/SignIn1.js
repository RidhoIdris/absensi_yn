import React from 'react';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
import Vars from '../../../store/_vars';
import Swal from 'sweetalert2';
import axios from 'axios';
import { ValidatorForm } from 'react-form-validator-core';
import InputValidator from '../../../App/components/InputValidator';

class SignUp1 extends React.Component {

    constructor(){
        super();
        if (localStorage.getItem('token') != null) {
            window.location.assign('dashboard');
        }
        this.state = {
            submitted : false,
            email : '',
            password : '',
        }
    }

    login = (e) => {
        e.preventDefault();
        this.setState({
            submitted : true
        },()=>{
            axios({
                method: 'POST',
                url: Vars.base_api_url+'auth/login',
                data : {
                    email : this.state.email,
                    password : this.state.password,
                }
                
            })
            .then(response=>{
                localStorage.setItem('user_data',JSON.stringify(response.data.user_data));
                localStorage.setItem('token',response.data.access_token);
                let timerInterval
                Swal.fire({
                    title: 'Login Berhasil!',
                    timer: 2000,
                    icon : 'success',
                    allowOutsideClick: false,
                    onBeforeOpen: () => {
                        Swal.showLoading()
                    },
                    onClose: () => {
                        clearInterval(timerInterval)
                    }
                    }).then(() => {
                        window.location.assign('dashboard')
                })
            })
            .catch(error=>{
                this.setState({ submitted: false });
                localStorage.clear();
                Swal.fire('Oops...', error.response.data.status, 'error')
                // console.log(error.response);
            })
        })
        // window.location.href='dashboard';
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    render () {
        return(
            <Aux>
                <Breadcrumb/>
                <div className="auth-wrapper">
                    <div className="auth-content">
                        <div className="auth-bg">
                            <span className="r"/>
                            <span className="r s"/>
                            <span className="r s"/>
                            <span className="r"/>
                        </div>
                        <div className="card">
                        <ValidatorForm
                            ref="form"
                            onSubmit={this.login}
                        >
                            <div className="card-body text-center">
                                <div className="mb-4">
                                    <i className="feather icon-unlock auth-icon"/>
                                </div>
                                <h3 className="mb-4">Login</h3>
                                <div className="form-group mb-3">
                                    <InputValidator 
                                        onChange={this.handleChange} 
                                        type="text"
                                        name="email"
                                        value={this.state.email}
                                        validators={['required', 'isEmail']}
                                        errorMessages={['this field is required', 'email is not valid']}
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <InputValidator 
                                        onChange={this.handleChange}
                                        type="password" 
                                        name="password"
                                        value={this.state.password}
                                        validators={['required']}
                                        errorMessages={['this field is required']}
                                        placeholder="Passoword"
                                    />

                                </div>
                                <button disabled={this.state.submitted} className="btn btn-primary shadow-2 mb-4">{this.state.submitted ? 'Loading...' : 'SignIn'}</button>
                            </div>
                            </ValidatorForm>
                        </div>
                    </div>
                </div>
            </Aux>
        );
    }
}

export default SignUp1;