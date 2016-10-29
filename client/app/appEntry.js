'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

const events = window.require('events');
const path = window.require('path');
const fs = window.require('fs');

const electron = window.require('electron');
const {ipcRenderer, shell} = electron;
const {dialog} = electron.remote;

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';


let muiTheme = getMuiTheme({
    fontFamily: 'Microsoft YaHei'
});

injectTapEventPlugin();

class MainWindow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            renderChild: true,
            userName: null,
            password: null
        };

        this.handleChildUnmount = this.handleChildUnmount.bind(this);
    }

    handleChildUnmount() {
        this.setState({renderChild: false});
    }

    render() {
        {this.state.renderChild ? <SignUpWindow unmountMe={this.handleChildUnmount} /> : null}
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    
                    <TextField
                        hintText='Enter UserName or Email '
                        value={this.state.userName}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                    <TextField
                        hintText='Enter Password'
                        type='password'
                        value={this.state.password}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>

                    <div style={styles.buttons_container}>
                        <RaisedButton
                            label="Log In" primary={true}
                            onClick={this._handleLogin.bind(this)}/>
                        <RaisedButton
                            label="Sign Up" primary={false} style={{marginLeft: 60}}
                            onClick={this._handleRegistry.bind(this)}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    _handleLogin() {
        let options = {
            type: 'info',
            buttons: ['Yes'],
            title: 'Login',
            message: this.state.userName,
            defaultId: 0,
            cancelId: 0
        };

        fetch('http://localhost:8080/user/test', {
            method: 'GET'
        });


        dialog.showMessageBox(options, (response) => {
            if (response == 0) {
                console.log("test");
                console.log('OK pressed!');

            }
        });
        
        
    }

    _handleRegistry() {
        let signUpWndComponent = ReactDOM.render(
        <SignUpWindow />,
        document.getElementById('content'));
    }
}

class SignUpWindow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstName: null,
            lastName: null,
            userName: null,
            password: null,
            confirmPass: null,
            email: null,
            confirmEmail: null
        };
    }

    dismiss() {
        this.props.unmountMe();
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    
                    <TextField
                        hintText='First Name'
                        value={this.state.firstName || ""}
                        onChange={(event) => {this.setState({firstName: event.target.value})}}/>
                    <font id='fname' color='red'></font>
                    <TextField
                        hintText='Last Name'
                        value={this.state.lastName || ""}
                        onChange={(event) => {this.setState({lastName: event.target.value})}}/>
                    <font id='lname' color='red'></font>
                    <TextField
                        hintText='Username'
                        value={this.state.userName || ""}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                    <font id='user' color='red'></font>
                    <TextField
                        hintText='Password'
                        type='password'
                        value={this.state.password || ""}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>
                    <font id='pass' color='red'></font>
                    <TextField
                        hintText='Confirm Password'
                        type='password'
                        value={this.state.confirmPass || ""}
                        onChange={(event) => {this.setState({confirmPass: event.target.value})}}/>
                    <font id='cpass' color='red'></font>
                    <TextField
                        hintText='Email'
                        value={this.state.email || ""}
                        onChange={(event) => {this.setState({email: event.target.value})}}/>
                    <font id='email' color='red'></font>
                    <TextField
                        hintText='Confirm Email'
                        value={this.state.confirmEmail || ""}
                        onChange={(event) => {this.setState({confirmEmail: event.target.value})}}/>
                    <font id='cemail' color='red'></font>

                    <div style={styles.buttons_container}>
                        <RaisedButton
                            label="Create Account" primary={true}
                            onClick={this._checkValid.bind(this)}/>
                        <RaisedButton
                            label="Back" primary={false} style={{marginLeft: 60}}
                            onClick={this._backToLogin.bind(this)}/>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }

    _checkValid() {
        var namePattern = new RegExp('^[a-zA-Z]{1,}$');
        var userPattern = new RegExp('^[a-zA-Z0-9]{3,}$');
        var passPattern = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$');
        var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');
        var fname = document.getElementById('fname');
        var lname = document.getElementById('lname');
        var user = document.getElementById('user');
        var pass = document.getElementById('pass');
        var cpass = document.getElementById('cpass');
        var email = document.getElementById('email');
        var cemail = document.getElementById('cemail')

        if (this.state.firstName == null) {
            fname.innerHTML = "The field is empty.";
        } else if (!namePattern.test(this.state.firstName)) {
            fname.innerHTML = "Names can only contain alphabets.";
        } else {
            fname.innerHTML = "";
        }

        if (this.state.lastName == null) {
            lname.innerHTML = "The field is empty.";
        } else if (!namePattern.test(this.state.lastName)) {
            lname.innerHTML = "Names can only contain alphabets.";
        } else {
            lname.innerHTML = "";
        }

        if (this.state.userName == null) {
            user.innerHTML = "The field is empty.";
        } else if (!userPattern.test(this.state.userName)) {
            user.innerHTML = "Usernames must be at least 3 characters long and can only contain alphabets or digits.";
        } else {
            user.innerHTML = "";
        }

        if (this.state.password == null) {
            pass.innerHTML = "The field is empty.";
        } else if (!passPattern.test(this.state.password)) {
            pass.innerHTML = "Passwords must be at least 6 characters long, have at least 1 uppercase letter, l lowercase letter and 1 digit.";
        } else {
            pass.innerHTML = "";
        }

        if (this.state.confirmPass == null) {
            cpass.innerHTML = "The field is empty.";
        } else if (this.state.password != this.state.confirmPass) {
            cpass.innerHTML = "Passwords do not match.";
        } else {
            cpass.innerHTML = "";
        }

        if (this.state.email == null) {
            email.innerHTML = "The field is empty.";
        } else if (!emailPattern.test(this.state.email)) {
            email.innerHTML = "Invalid email."
        } else {
            email.innerHTML = "";
        }

        if (this.state.confirmEmail == null) {
            cemail.innerHTML = "The field is empty.";
        } else if (this.state.email != this.state.confirmEmail) {
            cemail.innerHTML = "Emails do not match."
        } else {
            cemail.innerHTML = "";
        }
    }

    _backToLogin() {
        let mainWndComponent = ReactDOM.render(
        <MainWindow />,
        document.getElementById('content'));
    }
}

const styles = {
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 100,
        height: 100,
        marginBottom: 40
    },
    buttons_container: {
        paddingTop: 30,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
};


let mainWndComponent = ReactDOM.render(
    <MainWindow />,
    document.getElementById('content'));
