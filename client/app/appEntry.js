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
                <div className="input-group required">
                    <input className="input-group-field" type="text" id="username" placeholder="Enter your username" value={this.state.userName|| ''} onChange={(event)=> {this.setState({userName: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div className="input-group required">
                    <input className="input-group-field" type="password" id="passsword" placeholder="Enter your password" value={this.state.password|| ''} onChange={(event)=> {this.setState({password: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <hr/>
                <button className="button" onClick={this._handleLogin.bind(this)}>Login</button>
                <button className="button secondary" onClick={this._handleRegistry.bind(this)}>Sign up</button>
            </div>
        </div>

           
        );
    }

    _handleLogin() {
        

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
                electron.remote.getGlobal('sharedObject').token = res;
                window.location.href="./view/main.html";
               
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
            

        <form style={{height: "auto"}} id="loginContainer" className="row align-center align-middle"> 
            <div className="medium-6 large-6 column">
            <img className="gamEmpireLogo" src="view/img/GamEmpireLogo.png" />
            <div id='user' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field" required type="text" id="username" placeholder="Username" value={this.state.userName || ""}
                        onChange={(event) => {this.setState({userName: event.target.value})}}/>
                        <span className="input-group-label">*</span>
                </div>
                <div id='fname' className="validationError dropFade" style={{display: "none"}}></div>
                <div id='lname' className="validationError dropFade" style={{display: "none"}}></div>
                    <div className="input-group required">
                        <input className="input-group-field" required type="text" id="firstName" placeholder="First Name" value={this.state.firstName || ""}
                        onChange={(event) => {this.setState({firstName: event.target.value})}}/>
                        <span className="input-group-label">*</span>
                        <input className="input-group-field" required type="text" id="lastName" placeholder="Last Name" value={this.state.lastName || ""}
                        onChange={(event) => {this.setState({lastName: event.target.value})}}/>
                        <span className="input-group-label">*</span>
                    </div>
                <div id='pass' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field" required type="password" id="passsword" placeholder="Password"  value={this.state.password || ""}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div id='cpass' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field" required type="password" id="confirmPasssword" placeholder="Confirm Password" value={this.state.confirmPass || ""}
                        onChange={(event) => {this.setState({confirmPass: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div id='emailmsg' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field" required type="text" id="email" placeholder="Email" value={this.state.email || ""}
                        onChange={(event) => {this.setState({email: event.target.value})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <div id='cemailmsg' className="validationError dropFade" style={{display: "none"}}></div>
                <div className="input-group required">
                    <input className="input-group-field" required type="text" id="confirmEmail" placeholder="Confirm Email" value={this.state.confirmEmail || ""}
                        onChange={(event) => {this.setState({confirmEmail: event.target.value})}} />
                    <span className="input-group-label">*</span>
                </div>
                <div className="input-group required">
                    <input className="input-group-field" required type="date" id="birthday" value={this.state.birthday||''}
                        onChange={(event) => {this.setState({birthday: moment(event.target.value).format('YYYY-MM-DD')})}}/>
                    <span className="input-group-label">*</span>
                </div>
                <hr/>
                <button className="button" type="submit" onClick={this._checkValid.bind(this)}>Sign Up</button>
                <button className="button secondary" onClick={this._backToLogin.bind(this)}>Back to login</button>
            </div>
        </form>


            
        );
    }

    _checkValid(e) {
        e.preventDefault();
        var namePattern = new RegExp('^[a-zA-Z]{1,}$');
        var userPattern = new RegExp('^[a-zA-Z0-9]{3,}$');
        var passPattern = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$');
        var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');

        var fname = document.getElementById('fname');
        var lname = document.getElementById('lname');
        var user = document.getElementById('user');
        var pass = document.getElementById('pass');
        var cpass = document.getElementById('cpass');
        var email = document.getElementById('emailmsg');
        var cemail = document.getElementById('cemailmsg');

        if (this.state.firstName == null) {
             $("#fname").show();
            fname.innerHTML = "The field is empty. ";
        } else if (!namePattern.test(this.state.firstName)) {
             $("#fname").show();
            fname.innerHTML = "Names can only contain alphabets. ";
        } else {
            fname.innerHTML = "";
        }

        if (this.state.lastName == null) {
            $("#lname").show();
            lname.innerHTML = "The field is empty.";
        } else if (!namePattern.test(this.state.lastName)) {
            $("#lname").show();
            lname.innerHTML = "Names can only contain alphabets.";
        } else {
            lname.innerHTML = "";
        }

        if (this.state.userName == null) {
            $("#user").show();
            user.innerHTML = "The field is empty.";
        } else if (!userPattern.test(this.state.userName)) {
            $("#user").show();
            user.innerHTML = "Usernames must be at least 3 characters long and can only contain alphabets or digits.";
        } else {
            user.innerHTML = "";
        }

        if (this.state.password == null) {
            $("#pass").show();
            pass.innerHTML = "The field is empty.";
        } else if (!passPattern.test(this.state.password)) {
            $("#pass").show();
            pass.innerHTML = "Passwords must be at least 6 characters long, have at least 1 uppercase letter, l lowercase letter and 1 digit.";
        } else {
            pass.innerHTML = "";
        }

        if (this.state.confirmPass == null) {
            $("#cpass").show();
            cpass.innerHTML = "The field is empty.";
        } else if (this.state.password != this.state.confirmPass) {
            $("#cpass").show();
            cpass.innerHTML = "Passwords do not match.";
        } else {
            cpass.innerHTML = "";
        }

        if (this.state.email == null) {
            $("#emailmsg").show();
            email.innerHTML = "The field is empty.";
        } else if (!emailPattern.test(this.state.email)) {
            $("#emailmsg").show();
            email.innerHTML = "Invalid email.";
        } else {
            email.innerHTML = "";
        }

        if (this.state.confirmEmail == null) {
            $("#cemailmsg").show();
            cemail.innerHTML = "The field is empty.";
        } else if (this.state.email != this.state.confirmEmail) {
            $("#cemailmsg").show();
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
                    

                }
        )
            .done((res) =>{
                dialog.showMessageBox(options, (response) => {
                    if (response == 0) {
                        console.log('OK pressed!');
                        }
                    });
                this._backToLogin();
            })
            .fail((res)=>{
                dialog.showMessageBox(options2, (response) => {
                    if (response == 0) {
                        console.log('OK pressed!');
                        }
                    });
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
