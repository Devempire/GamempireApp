'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Dropdown from 'react-dropdown';
//var ReactGridLayout = require('react-grid-layout');
var PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
var _ = require('lodash');
var WidthProvider = require('react-grid-layout').WidthProvider;
var ResponsiveReactGridLayout = require('react-grid-layout').Responsive;
ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

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
                        <font id='emailMsg' color='red'></font>
                    <TextField
                        hintText='Confirm Email'
                        value={this.state.confirmEmail || ""}
                        onChange={(event) => {this.setState({confirmEmail: event.target.value})}}/>
                        <font id='cemail' color='red'></font>
                    <div style={styles.buttons_container}>
                        <RaisedButton
                            label="Confirm" primary={true}
                            onClick={this._checkValid.bind(this)}/>
                    </div>
                </div>
            </MuiThemeProvider>
        )
    }

    _checkValid() {
        var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');
        var email = document.getElementById('emailMsg');
        var cemail = document.getElementById('cemail');

        if (this.state.email == null) {
            email.innerHTML = 'This field is empty.';
        } else if (!emailPattern.test(this.state.email)) {
            email.innerHTML = 'Invalid email.';
        } else {
            email.innerHTML = '';
        }

        if (this.state.confirmEmail == null) {
            cemail.innerHTML = 'This field is empty.';
        } else if (this.state.email != this.state.confirmEmail) {
            cemail.innerHTML = 'Emails do not match.';
        } else {
            cemail.innerHTML = '';
        }

        if (email.innerHTML == '' && cemail.innerHTML == '') {
            this._updateEmail();
        }
    }

    _updateEmail() {
        let option1 = {
            type: 'info',
            buttons: ['Yes'],
            title: 'Email',
            message: "The new email " + this.state.email + " is updated.",
            defaultId: 0,
            cancelId: 0
        };

        let option2 = {
            type: 'info',
            buttons: ['OK'],
            title: 'Email',
            message: "Email already exists.",
            defaultId: 0,
            cancelId: 0
        }

        $.ajax({
            url: 'http://localhost:8080/user/profile/update/email',
            type: 'PATCH',
            email:this.state.email,
            success: function(result) {
                dialog.showMessageBox(option1);
            }
        });
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

var AddRemoveLayout = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 100
    };
  },

  getInitialState() {
    return {};
  },

  // createElement(el) {
  //   var removeStyle = {
  //     position: 'absolute',
  //     right: '2px',
  //     top: 0,
  //     cursor: 'pointer'
  //   };
  //   var i = el.add ? '+' : el.i;
  //   return (
  //     <div key={i} data-grid={el}>
  //       {el.add ?
  //         <span className="add text" onClick={this.onAddItem} title="You can add an item by clicking here, too.">Add +</span>
  //       : <span className="text">{i}</span>}
  //       <span className="remove" style={removeStyle} onClick={this.onRemoveItem.bind(this, i)}>x</span>
  //     </div>
  //   );
  // },

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
    this.setState({layout: layout});
  },

  onRemoveItem() {
    // this.setState(_.reject(this.state.items, {i: i}));
    $(document).ready(function(){
        $("#second_r").click(function(){
            $("#second_w").remove();
        });
    });
  },

  render() {
    var removeStyle = {
      position: 'absolute',
      right: '2px',
      top: 0,
      cursor: 'pointer'
    };
    return (
      <div>
        <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}>
          <div key="1" data-grid={{x: 2, y: 0, w: 2, h: 2}}><span className="text">1</span></div>
          <div id="second_w" key="2" data-grid={{x: 4, y: 0, w: 2, h: 2}}><span id="second_r" className="remove" style={removeStyle} onClick={this.onRemoveItem()}>x</span>2</div>
          <div key="3" data-grid={{x: 6, y: 0, w: 2, h: 2}}><span className="text">3</span></div>
          <div key="4" data-grid={{x: 8, y: 0, w: 2, h: 2}}><span className="text">4</span></div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
});

module.exports = AddRemoveLayout;

let MyFirstGridComponent = ReactDOM.render(
        <AddRemoveLayout />,
        document.getElementById('main_content'));

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
