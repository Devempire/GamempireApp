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
var moment = require('moment');



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
            

        <div id="loginContainer" className="row align-center align-middle">
            <div className="medium-6 large-6 column">
            <img className="gamEmpireLogo" src="view/img/GamEmpireLogo.png" />
                <div className="required">
                    <input type="text" id="username" placeholder="Enter your username" value={this.state.userName|| ''} onChange={(event)=> {this.setState({userName: event.target.value})}}/>
                </div>
                <div className="required">
                    <input type="password" id="passsword" placeholder="Enter your password" value={this.state.password|| ''} onChange={(event)=> {this.setState({password: event.target.value})}}/>
                </div>
                <hr/>
                <button className="button" onClick={this._handleLogin.bind(this)}>Login</button>
                <button className="button secondary" onClick={this._handleRegistry.bind(this)}>Sign up</button>
            </div>
        </div>

           
        );
    }

    _handleLogin() {
        let options = {
            type: 'info',
            buttons: ['Yes'],
            title: 'Login',
            message: this.state.userName +" logging",
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
                electron.remote.getGlobal('sharedObject').token = res;
                window.location.href="./view/add.html";
               
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
            confirmEmail: null,
            birthday: moment().format('YYYY-MM-DD'),
        };

    }

    dismiss() {
        this.props.unmountMe();
    }

    render() {
        return (
            

        <div id="loginContainer" className="row align-center align-middle">
            <div className="medium-6 large-6 column">
            <img className="gamEmpireLogo" src="view/img/GamEmpireLogo.png" />
                <div className="required">
                    <input required type="text" id="username" placeholder="Username" value={this.state.userName|| ''} onChange={(event)=> {this.setState({userName: event.target.value})}}/>
                </div>
                <div className="textInputGroup">
                    <div className="required">
                        <input required type="text" id="firstName" placeholder="First Name" />
                    </div>
                    <div className="required">
                        <input required type="text" id="lastName" placeholder="Last Name" />
                    </div>
                </div>
                <div className="required">
                    <input required type="password" id="passsword" placeholder="Password" value={this.state.password|| ''} onChange={(event)=> {this.setState({password: event.target.value})}}/>
                </div>
                <div className="required">
                    <input required type="password" id="confirmPasssword" placeholder="Confirm Password" />
                </div>
                <div className="required">
                    <input required type="email" id="email" placeholder="Email" />
                </div>
                <div className="required">
                    <input required type="email" id="confirmEmail" placeholder="Confirm Email" />
                </div>
                <div className="required">
                    <input required type="date" id="birthday"/>
                </div>
                <hr/>
                <button className="button">Sign Up</button>
            </div>
        </div>


            
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
        var cemail = document.getElementById('cemail');

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
            email.innerHTML = "Invalid email.";
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

        if (fname.innerHTML == "" && lname.innerHTML == "" && user.innerHTML == "" 
            && pass.innerHTML == "" && cpass.innerHTML == "" 
            && email.innerHTML == "" && cemail.innerHTML == "") {
            
            this._register();
        }

    }

     _register(){
        let options = {
            type: 'info',
            buttons: ['Yes'],
            title: 'Signup',
            message: this.state.userName +" has registed",
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

        console.log(this.state.birthday);
        $.post('http://localhost:8080/user/add', 
                {
                
                    username:this.state.userName,
                    password:this.state.password,
                    email:this.state.email,
                    firstname:this.state.firstName,
                    lastname:this.state.lastName,
                    birthday:this.state.birthday,
                    img:'../client/view/img/user.jpg'

                }
        )
            .done((res) =>{
                dialog.showMessageBox(options);
                this._backToLogin();
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



let mainWndComponent = ReactDOM.render(
    <MainWindow />,
    document.getElementById('content'));
