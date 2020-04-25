import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import {Redirect} from "react-router-dom";

export default class login extends Component {
    constructor(props) {
        super(props);
        this.state ={
            formData: {
                password: "",
                email: "",
                type: "self"
            },
            socialData: {
                name: '',
                email: '',
                providerId: '',
                provider: '',
                token: '',
                profilePic: '',
                type: "social"
            },
            redirectToDashboard: false,
            submitted: false
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this)
        this.handleGoogleResponseSuccess = this.handleGoogleResponseSuccess.bind(this)
        this.handleGoogleResponseFailure = this.handleGoogleResponseFailure.bind(this)
        this.handleFacebookResponseFailure = this.handleFacebookResponseFailure.bind(this)
        this.handleFacebookResponseSuccess = this.handleFacebookResponseSuccess.bind(this)
    }

    handleEmailChange(event) {
        const val = event.target.value;
        this.setState(prevState => {
            prevState.formData.email = val;
            return prevState
        })
    }

    handlePasswordChange(event) {
        const val = event.target.value;
        this.setState(prevState =>{
            prevState.formData.password = val;
            return prevState
        })
    }

    handleLogin(data) {
        let url = "";
        if (data.type === 'self') url="login/";
        else if (data.type === "social") url="slogin/";
        delete data.type;

        console.log("ide");
        fetch('http://localhost:7777/' + url, {
            method: 'POST',
            body: JSON.stringify(data)
                }
            ).then(response => {
            if(response.status >= 200 && response.status < 300) {
                this.setState({submitted: true});

            }
            return response.json()
        }).then(data => {
                console.log(data.message);
                if (data.message === "Success") {
                    sessionStorage.setItem("userData", JSON.stringify(data.userData));
                    this.setState({redirectToDashboard: true})
                }
            })
    }

    handleFormSubmit(event) {
        event.preventDefault();
        // var post_dict = { name: this.state.formData.name, emai};
        let post_dict = {
                password: this.state.formData.password,
                email: this.state.formData.email,
                type: this.state.formData.type
            };
        this.handleLogin.bind(this)(post_dict);

    }
    handleFacebookResponseFailure(response) {
         console.log(response);
    }
    handleFacebookResponseSuccess(response) {

    }
    handleGoogleResponseSuccess(response) {
        this.setState(prevState => {
            prevState.socialData.name = response.profileObj.name;
            prevState.socialData.email = response.profileObj.email;
            prevState.socialData.token = response.accessToken;
            prevState.socialData.provider = 'google';
            prevState.socialData.providerId = response.profileObj.googleId;
            prevState.socialData.profilePic = response.profileObj.imageUrl;
            return prevState
        });

        // console.log(response, '\n', this.state.socialData);
        this.handleLogin.bind(this)(this.state.socialData);
    }
    handleGoogleResponseFailure(response) {
        console.log(response)
    }


    render() {
        if (this.state.redirectToDashboard || sessionStorage.getItem("userData")) {
            return (
                <Redirect to={'/dashboard/'}/>
            )
        }
        return (
            <div style={{textAlign: 'center'}}>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Email
                        <input type="email" value={this.state.email} onChange={this.handleEmailChange} required/>
                    </label>
                    <br/>
                    <label>
                        Password
                        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} required/>
                    </label>
                    <br/>
                    <button type="submit" onSubmit={this.handleFormSubmit}>Login</button>
                </form>
                <FacebookLogin
                      appId="728259304176965"
                      autoLoad={false}
                      fields="name,email,picture"
                      scope="public_profile, email"
                      textButton="Signup with facebook"
                      onFailure={this.handleFacebookResponseFailure}
                      callback={this.handleFacebookResponseSuccess}/>
                <GoogleLogin
                    clientId="66692974917-0berrgnh3qlp92c551rust1q366s2bd4.apps.googleusercontent.com"
                    buttonText="Login with google"
                    onSuccess={this.handleGoogleResponseSuccess}
                    onFailure={this.handleGoogleResponseFailure}/>
            </div>
        );
    }
}

