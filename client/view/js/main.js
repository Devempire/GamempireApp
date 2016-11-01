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
                <div >
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
                </div>
            </MuiThemeProvider>
        );
	}
}

$("#edit").click(function() {
	console.log('hey');
	let editProfileWndComponent = ReactDOM.render(
		<EditProfileWnd />,
		document.getElementById('main_content'));
});
