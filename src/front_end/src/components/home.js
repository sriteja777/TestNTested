import React, { Component } from 'react';
import {Link} from "react-router-dom";


export default class home extends Component {
    render() {
        return (
            <div>
            {!sessionStorage.getItem("userData") &&
                    < li > < Link to={'/login'}>Login</Link></li>
                    }
                    {sessionStorage.getItem("userData") &&
                        < li > < Link to={'/logout'}>Logout</Link></li>
                    }
            </div>
        )
    }
}