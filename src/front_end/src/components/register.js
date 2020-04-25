import React, {Component} from 'react'
import FacebookLogin from "react-facebook-login";
import {GoogleLogin} from "react-google-login";
import {Redirect} from 'react-router-dom'

export default class registerUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                name: "",
                password: "",
                confirmPwd: "",
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
        this.handleConfirmPwdChange = this.handleConfirmPwdChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleGoogleResponseSuccess = this.handleGoogleResponseSuccess.bind(this);
        this.handleGoogleResponseFailure = this.handleGoogleResponseFailure.bind(this);
        this.handleFacebookResponseSuccess = this.handleFacebookResponseSuccess.bind(this);
        this.handleFacebookResponseSuccess = this.handleFacebookResponseSuccess.bind(this);
    }



    handlePasswordChange(event) {
        const val = event.target.value;
        this.setState(prevState =>{
            prevState.formData.password = val;
            return prevState
        })
    }


    handleNameChange(event) {
        const val = event.target.value;
        this.setState(prevState =>{
            prevState.formData.name = val;
            return prevState
        })
    }

    handleEmailChange(event) {
        const val = event.target.value;
        this.setState(prevState => {
            prevState.formData.email = val;
            return prevState
        })
    }
    handleConfirmPwdChange(event) {
        const val = event.target.value;
        this.setState(prevState => {
            prevState.formData.confirmPwd = val;
            return prevState
        })
    }

    handleSignup(data) {
        let url = "";
        if (data.type === 'self') url="user/";
        else if (data.type === "social") url="suser/";
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
                    console.log(sessionStorage.getItem("userData").Name);
                    this.setState({redirectToDashboard: true})
                }
            })
    }

    handleFormSubmit(event) {
        event.preventDefault();
        // if (this.state.formData.name === "") {
        //     alert("Plese enter your name");
        //     return;
        // }
        //
        // if (this.state.formData.password === "") {
        //     alert("Please enter Password");
        //     return;
        // }
        if (this.state.formData.password !== this.state.formData.confirmPwd) {
            alert("Your Password fields doesn't match");
            return;
        }
        // var post_dict = { name: this.state.formData.name, emai};
        let post_dict = {
                name: this.state.formData.name,
                password: this.state.formData.password,
                email: this.state.formData.email,
                type: this.state.formData.type
            };
        this.handleSignup.bind(this)(post_dict);
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
        this.handleSignup.bind(this)(this.state.socialData);

    }

    handleGoogleResponseFailure(response) {
        console.log(response)
    }

    handleFacebookResponseSuccess(response) {
        this.setState(prevState => {
            prevState.socialData.name = response.name;
            prevState.socialData.email = response.email;
            prevState.socialData.token = response.accessToken;
            prevState.socialData.provider = 'facebook';
            prevState.socialData.providerId = response.userID;
            prevState.socialData.profilePic = response.picture.data.url;
            return prevState

        });
        // console.log(response, '\n', this.state.socialData);
        this.handleSignup.bind(this)(this.state.socialData);
    }

    handleFacebookResponseFailure(response) {
        console.log(response)
    }

    render() {
        if (this.state.redirectToDashboard) {
            return (
                <Redirect to={'/dashboard/'}/>
            )
        }
        console.log("redirect", this.state.redirectToDashboard);
        return (
            <div>
                <form onSubmit={this.handleFormSubmit}>
                    <label>
                        Your Name
                        <input type="text" value={this.state.name} onChange={this.handleNameChange} required/>
                        <br/>
                    </label>
                    <label>
                        Email Id
                        <input type="email" value={this.state.email} onChange={this.handleEmailChange} required/>
                        <br/>
                    </label>
                    <label>
                        Password
                        <input type="password" value={this.state.password} onChange={this.handlePasswordChange} required/>
                        <br/>
                    </label>
                    <label>
                        Confirm Password
                        <input type="password" value={this.state.confirmPwd} onChange={this.handleConfirmPwdChange} required/>
                        <br/>
                    </label>

                    {/*<label>*/}
                        {/*Last Name*/}
                        {/*<input type="text" value={this.state.lastName} onChange={this.handleLastNameChange}/>*/}
                        {/*<br/>*/}
                    {/*</label>*/}

                    {/*<label>*/}
                        {/*Phone Number*/}
                        {/*<input type="number" value={this.state.phoneNumber} onChange={this.handlePhoneNumberChange}/>*/}
                        {/*<br/>*/}
                    {/*</label>*/}
                    <button type="submit">Register</button>
                </form>
                <h3>OR</h3>
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
                    buttonText="Signup with google"
                    onSuccess={this.handleGoogleResponseSuccess}
                    onFailure={this.handleGoogleResponseFailure}/>
                {/*<span>{this.state.submitted}</span>*/}
            </div>
        );
    }

}