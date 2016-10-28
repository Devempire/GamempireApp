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


        fetch('http://localhost:8080/user/find', {
            method: 'POST',
            body:
                {
                    username:this.state.userName,
                    password:this.state.password
                },
        })
            .then((res) =>{
                if(res.ok){
                    dialog.showMessageBox(options);
                }else{
                     dialog.showMessageBox(options2);

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
                    <div id='fname'>
                    </div>
                    <TextField
                        hintText='Last Name'
                        value={this.state.lastName || ""}
                        onChange={(event) => {this.setState({lastName: event.target.value})}}/>
                    <TextField
                        hintText='Username'
                        value={this.state.userName || ""}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                    <TextField
                        hintText='Password'
                        type='password'
                        value={this.state.password || ""}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>
                    <TextField
                        hintText='Confirm Password'
                        type='password'
                        value={this.state.confirmPass || ""}
                        onChange={(event) => {this.setState({confirmPass: event.target.value})}}/>
                    <TextField
                        hintText='Email'
                        value={this.state.email || ""}
                        onChange={(event) => {this.setState({email: event.target.value})}}/>
                    <TextField
                        hintText='Confirm Email'
                        value={this.state.confirmEmail || ""}
                        onChange={(event) => {this.setState({confirmEmail: event.target.value})}}/>

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
        var passPattern = new RegExp('^(?=.*[A-Za-z])(?=.*0-9)[A-Za-z0-9]{6,}$');
        var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$')
        if (!namePattern.test(this.state.firstName)) {
            React.render()
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
