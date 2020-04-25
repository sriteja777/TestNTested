import React, {Component} from 'react'
import {Redirect} from 'react-router-dom'
export default class logout extends Component{
    render() {
        sessionStorage.removeItem("userData");
        alert("You have successfully logged out");

        return (
            <div>You have successfully logged out
                <Redirect to={'/'}/>
            </div>
        )
    }
}