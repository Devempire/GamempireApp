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
                        hintText='Enter Your UserName '
                        value={this.state.userName||''}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                    <TextField
                        hintText='Enter Your Password'
                        type='password'
                        value={this.state.password||''}
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
            message: this.state.userName +"logging",
            defaultId: 0,
            cancelId: 0
        };

        let options2 = {
            type: 'info',
            buttons: ['OK'],
            title: 'Login',
            message: "Wrong username or password",
            defaultId: 0,
            cancelId: 0
        };


        $.post('http://localhost:8080/user/find',
        {
            username:this.state.userName,
            password:this.state.password
        })
            .done((res) =>{
                dialog.showMessageBox(options);
            })
            .fail((res)=>{
                dialog.showMessageBox(options2);
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

        var error =true;
        if (this.state.firstName == null) {
            fname.innerHTML = "The field is empty.";
            error = false;
        } else if (!namePattern.test(this.state.firstName)) {
            fname.innerHTML = "Names can only contain alphabets.";
            error = false;
        } else {
            fname.innerHTML = "";
            error = true;
        }

        if (this.state.lastName == null) {
            lname.innerHTML = "The field is empty.";
            error = false;
        } else if (!namePattern.test(this.state.lastName)) {
            lname.innerHTML = "Names can only contain alphabets.";
            error = false;
        } else {
            lname.innerHTML = "";
            error = true;
        }

        if (this.state.userName == null) {
            user.innerHTML = "The field is empty.";
            error = false;
        } else if (!userPattern.test(this.state.userName)) {
            user.innerHTML = "Usernames must be at least 3 characters long and can only contain alphabets or digits.";
            error = false;
        } else {
            user.innerHTML = "";
            error = true;
        }

        if (this.state.password == null) {
            pass.innerHTML = "The field is empty.";
            error = false;
        } else if (!passPattern.test(this.state.password)) {
            pass.innerHTML = "Passwords must be at least 6 characters long, have at least 1 uppercase letter, l lowercase letter and 1 digit.";
            error = false;
        } else {
            pass.innerHTML = "";
            error = true;
        }

        if (this.state.confirmPass == null) {
            cpass.innerHTML = "The field is empty.";
            error = false;
        } else if (this.state.password != this.state.confirmPass) {
            cpass.innerHTML = "Passwords do not match.";
            error = false;
        } else {
            cpass.innerHTML = "";
            error = true;
        }

        if (this.state.email == null) {
            email.innerHTML = "The field is empty.";
            error = false;
        } else if (!emailPattern.test(this.state.email)) {
            email.innerHTML = "Invalid email.";
            error = false;
        } else {
            email.innerHTML = "";
            error = true;
        }

        if (this.state.confirmEmail == null) {
            cemail.innerHTML = "The field is empty.";
            error = false;
        } else if (this.state.email != this.state.confirmEmail) {
            cemail.innerHTML = "Emails do not match."
            error = false;
        } else {
            cemail.innerHTML = "";
            error = true;
        }
        console.log(error);
        if (error){
            this._register();
        }

    }

     _register(){
        let options = {
            type: 'info',
            buttons: ['Yes'],
            title: 'Signup',
            message: this.state.userName +"has registed",
            defaultId: 0,
            cancelId: 0
        };

        let options2 = {
            type: 'info',
            buttons: ['OK'],
            title: 'Signup',
            message: "Username or email already exist",
            defaultId: 0,
            cancelId: 0
        };


        $.post('http://localhost:8080/user/add', 
                {
                
                    username:this.state.userName,
                    password:this.state.password,
                    email:this.state.email,
                    firstname:this.state.firstName,
                    lastname:this.state.lastName

                }
        )
            .done((res) =>{
                dialog.showMessageBox(options);
            })
            .fail((res)=>{
                dialog.showMessageBox(options2);
            });

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
