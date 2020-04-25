import React, { Component } from 'react';
import {Redirect} from "react-router-dom";

export default class dashboard extends Component {

    render() {
        if (!sessionStorage.getItem("userData")) {
            return (
                <Redirect to={'/login/'}/>
            )
        }
        return (
            <div>
                it is dashboard
            </div>
        )
    }
}

