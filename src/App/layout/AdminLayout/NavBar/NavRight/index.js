import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';

import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";

import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';

class NavRight extends Component {
    handleLogout(e){
        e.preventDefault();
       localStorage.clear();
       window.location.href =  'login';
    }
    render() {
        return (
            <Aux>
                <ul className="navbar-nav ml-auto">
                    <li>
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-settings"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={Avatar1} className="img-radius" alt="User Profile"/>
                                    <span>{JSON.parse(localStorage.getItem('user_data')).name}</span>
                                </div>
                                <ul className="pro-body"><li><a href={DEMO.BLANK_LINK} onClick={this.handleLogout} className="dropdown-item"><i className="feather icon-log-out"/> Log Out</a></li>
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </Aux>
        );
    }
}

export default NavRight;
