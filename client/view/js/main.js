'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Dropdown from 'react-dropdown'

const events = window.require('events');
const path = window.require('path');
const fs = window.require('fs');

const electron = window.require('electron');
const {ipcRenderer, shell} = electron;
const {dialog} = electron.remote;
var session = electron.remote;

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

let muiTheme = getMuiTheme({
    fontFamily: 'Microsoft YaHei'
});

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
    dropdown: {
        display: 'block',
        color: 'black'
    }
};

const month_options = [
    'January', 'February', 'March'
];

const day_options = [
    '01', '02', '03'
];

const year_options = [
    '1994', '1995', '1996'
];

injectTapEventPlugin();

class EditProfileWnd extends React.Component {

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
            dateOfBirth: null,
            games: null,
            gamerType: null,
            friends: null,
            mic: null
		};
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
                    <font size="4">Birthday</font>
                    <div style={styles.dropdown}>
                        <Dropdown options={month_options} onChange={this._onSelect} value={'Month'} />
                        <Dropdown options={day_options} onChange={this._onSelect} value={'Day'} />
                        <Dropdown options={year_options} onChange={this._onSelect} value={'Year'} />
                    </div>
                </div>
            </MuiThemeProvider>
        );
	}
}

class ViewProfileWnd extends React.Component {

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
            dateOfBirth: null,
            games: null,
            gamerType: null,
            friends: null,
            mic: null
        };
        this.list=[];
        this.list = this.loadProfile(this.list);
    }

    loadProfile(list){
        
        var token = session.getGlobal('sharedObject').token;
        $.post( "http://localhost:8080/user/load",
                {'token' :token

                }
        )
        .done(function(data) {
            //get user profile by user id
            console.log(data);
          $.get("http://localhost:8080/user/profile/"+data._id +"/info").done(function(d){
             list.push(d.firstname);
             list.push(d.lastname);
             list.push(d.email);
             list.push(d.dateOfbirth);
             console.log(list);
             

             });

        });
    }

    render() {
        return (

            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <h3>My Profile</h3>
                    <hr />
                   <ul>
                    <li>{this.list[0]}</li>
                    <li>{this.list[1]}</li>
                    <li>{this.list[2]}</li>
                    <li>{this.list[3]}</li>
                    </ul>
                    

                    
                    </div>
                </MuiThemeProvider>
        );
    }
}

class ChangeEmailWnd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            email: null,
            confirmEmail: null
        };
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <TextField
                        hintText='New Email'
                        value={this.state.email || ""}
                        onChange={(event) => {this.setState({email: event.target.value})}}/>
                    <TextField
                        hintText='Confirm Email'
                        value={this.state.confirmEmail || ""}
                        onChange={(event) => {this.setState({confirmEmail: event.target.value})}}/>
                </div>
            </MuiThemeProvider>
        )
    }
}

class ChangePasswordWnd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            password: null,
            confirmPass: null
        };
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <TextField
                        hintText='New Password'
                        value={this.state.password || ""}
                        onChange={(event) => {this.setState({password: event.target.value})}}/>
                    <TextField
                        hintText='Confirm Password'
                        value={this.state.confirmPass || ""}
                        onChange={(event) => {this.setState({confirmPass: event.target.value})}}/>
                </div>
            </MuiThemeProvider>
        )
    }
}

$("#edit").click(function() {
    let editProfileWndComponent = ReactDOM.render(
        <EditProfileWnd />,
        document.getElementById('main_content'));
});

$("#view").click(function() {
    console.log('yo');
    let viewProfileWndComponent = ReactDOM.render(
        <ViewProfileWnd />,
        document.getElementById('main_content'));
});

$("#emailchange").click(function() {
    let changeEmailWndComponent = ReactDOM.render(
        <ChangeEmailWnd />,
        document.getElementById('main_content'));
});

$("#passchange").click(function() {
    let changePasswordWndComponent = ReactDOM.render(
        <ChangePasswordWnd />,
        document.getElementById('main_content'));
});

$("#logout").click(function() {
    window.location.pathname = '../../index.html';
});
