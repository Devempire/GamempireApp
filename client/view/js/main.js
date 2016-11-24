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
var moment = require('moment');

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

var AddRemoveLayout = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 20,
      verticalCompact: false
    };
  },

  getInitialState() {
    var layout = this.generateLayout();
    //var t = this.getAPI();
    //console.log(t);
    return {
      layout: layout,
      //value: "",
      //text: t
    };
  },

  generateLayout() {
    var p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
      return {x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 2, h: y, i: i.toString()};
    });
  },


  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout) {
    this.setState({layout: layout});
  },


  onRemoveItem(i) {
    $(document).ready(function(){
        $("#remove" + i).click(function(){
            $("#widget" + i).remove();
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
        <ResponsiveReactGridLayout layout={this.state.layout} onLayoutChange={this.onLayoutChange} 
            onBreakpointChange={this.onBreakpointChange} {...this.props}>
            <div id="widget1" key="1" data-grid={{x: 0, y: 0, w: 4, h: 16}}>
            <h3> Profile </h3>
            <hr/>
            <img src={'./img/user.jpg'}/>

            <button id="edit"> Edit Profile</button>  

            </div>
            <div id="widget2" key="2" data-grid={{x: 0, y: 16, w: 2, h: 10}}><span id="remove2" style={removeStyle} onClick={this.onRemoveItem('2')}>x</span>
            <h4> Game 1</h4>
            <p> detail</p>
            <hr/>
            <h4> interest</h4>

            
            </div>
            <div id="widget3" key="3" data-grid={{x: 2, y: 16, w: 2, h: 10}}><span id="remove3" style={removeStyle} onClick={this.onRemoveItem('3')}>x</span>
            <h4> Game 2</h4>
            <p> detail</p>
            <hr/>
            <h4> interest</h4>
            </div>

            <div id="widget4" key="4" data-grid={{x: 4, y: 16, w: 2, h: 10}}><span id="remove3" style={removeStyle} onClick={this.onRemoveItem('3')}>x</span>
            <h4> Game 3</h4>
            <p> detail</p>
            <hr/>
            <h4> interest</h4>
            </div>

        </ResponsiveReactGridLayout>
      </div>
    );
  }
});

var Edit = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
      rowHeight: 20,
      verticalCompact: false
    };
  },

  getInitialState() {
    var layout = this.generateLayout();

    return {

      layout: layout,
      items:[{i:"0",x:0,y:0,w:4,h:20}],
      pw:[],
      email:[],
      response:undefined,
      username:null,
      lastname:null,
      firstname:null,
      birthday:null,

    };
  },

  generateLayout() {
    var p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
      return {x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 2, h: y, i: i.toString()};
    });
  },

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout) {
    this.setState({layout: layout});
  },

  loadProfile(){
    var token = electron.remote.getGlobal('sharedObject').token;

    $.post( "http://localhost:8080/user/load",{
        'token': token
        }).done((d)=> {
            $.get('http://localhost:8080/user/profile/'+ d._id + '/info').done((res)=>{
                
                this.setState({response: res,
                                username:res.username,
                                firstname:res.firstname,
                                lastname:res.lastname,
                                birthday:res.dateofbirth
                });
                console.log(this.state.response);
        });
    });
  },

  componentWillMount: function(){
    this.loadProfile();
  },


  createProfile(el) {
    
    var i = el.i;
    return (
      <div key={i} data-grid={el}>
        <h3> Edit Your personal Info</h3>
        <hr/>
        <img src={'./img/user.jpg'}/>
        

        <form>
            Username: <br></br>
            <input type="text" id="userName" value={this.state.username} onChange={(event) => {this.setState({username: event.target.value})}}/>
            <font id='uname' color='red'></font>
            <br></br>
            First Name: <br></br>
            <input type="text" id="firstName" value={this.state.firstname} onChange={(event) => {this.setState({firstname: event.target.value})}} />
            <font id='fname' color='red'></font>
            <br></br>
            Last Name: <br></br>
            <input type="text" id="lastName" value={this.state.lastname} onChange={(event) => {this.setState({lastname: event.target.value})}}/>
            <font id='lname' color='red'></font>
            <br></br>
            Birthday: <br></br>
            <input type="date" id="birthday" value={this.state.birthday} onChange={(event) => {this.setState({birthday: moment(event.target.value).format('YYYY-MM-DD')})}}/>
            <br></br>
        </form>
            <button onClick={this.checkValid}> Submit </button>
            <button onClick={this.onAddchangepw}>change password</button>
            <button onClick={this.onAddchangeEmail}>change email</button>
            
      </div>
    );
  },

  onRemoveItem() {
    this.setState({pw: _.reject(this.state.pw, {i: "change password"})});
  },

  onRemoveItem1() {
    this.setState({email: _.reject(this.state.email, {i: "change email"})});
  },

  onAddchangepw() {

    this.setState({
      pw: this.state.pw.concat({
        i: "change password",
        x: 0,
        y: 16,
        w: 4,
        h: 10
      })
    });
  },

  onAddchangeEmail() {

    this.setState({
      email: this.state.email.concat({
        i: "change email",
        x: 4,
        y: 16,
        w: 4,
        h: 10
      })
    });
  },

  changePW(el) {
    var i = el.i;
    return (
      <div key={i} data-grid={el}>
        <h3> Edit Your password</h3>
        <hr/>
        <form>
        <label>
        Old password:
        <input type="password" id="oldpw" />
        <font id='oldpass' color='red'></font>
        </label>
        <br/>
        <label>
        New password:
        <input type="password" id="newpw" />
        <font id='newpass' color='red'></font>
        </label>
        <br/>
        </form>
        <button onClick={this.checkPw}> Submit </button>
      </div>
    );
  },

  changeEmail(el) {
    var i = el.i;
    return (
      <div key={i} data-grid={el}>
        <h3> Edit Your Email</h3>
        <hr/>
        <form>
        <label>
        New email
        <input type="text" id="email" />
        <font id='newemail' color='red'></font>
        </label>
        </form>
        <button onClick={this.checkEmail}> Submit </button>
      </div>
    );
  },

  render() {
     if(this.state.response){
    return (
      <div>
        
        <ResponsiveReactGridLayout onLayoutChange={this.onLayoutChange} onBreakpointChange={this.onBreakpointChange}
            {...this.props}>
            {_.map(this.state.items, this.createProfile)}
            {_.map(this.state.pw, this.changePW)}
            {_.map(this.state.email, this.changeEmail)}
        </ResponsiveReactGridLayout>
      </div>
    );
    }else{
        return (<div> Loading</div>);
    }
  },

  checkValid() {

      let option1 = {
          type: 'info',
          buttons: ['Yes'],
          title: 'Update personal info',
          message: "Successfully updated.",
          defaultId: 0,
          cancelId: 0
      };

      var namePattern = new RegExp('^[a-zA-Z]{1,}$');
      var userPattern = new RegExp('^[a-zA-Z0-9]{3,}$');
      var fname = $('#firstName').val();
      var errorfname = document.getElementById('fname');
      var lname = $('#lastName').val();
      var errorlname = document.getElementById('lname');
      var uname = $('#userName').val();
      var erroruname = document.getElementById('uname');

      if (fname == "") {
          errorfname.innerHTML = "The field is empty.";
      } else if (!namePattern.test(fname)) {
          errorfname.innerHTML = "Names can only contain alphabets.";
      } else {
          errorfname.innerHTML = "";
      }

      if (lname == "") {
          errorlname.innerHTML = "The field is empty.";
      } else if (!namePattern.test(lname)) {
          errorlname.innerHTML = "Names can only contain alphabets.";
      } else {
          errorlname.innerHTML = "";
      }

      if (uname == "") {
          erroruname.innerHTML = "The field is empty.";
      } else if (!userPattern.test(uname)) {
          erroruname.innerHTML = "Usernames must be at least 3 characters long and can only contain alphabets or digits.";
      } else {
          erroruname.innerHTML = "";
      }

      if (errorfname.innerHTML == "" && errorlname.innerHTML == "" && erroruname.innerHTML == "") {
          var token = electron.remote.getGlobal('sharedObject').token;
           $.post( "http://localhost:8080/user/load",
              {
                  'token' :token
              }).done((d)=> {
                  $.ajax({
                          url:"http://localhost:8080/user/profile/update",   
                          type:"PUT",
                          data:{    
                              _id:d._id,
                              "firstname":fname,
                              "lastname":lname,
                              "username":uname,
                              "birthday":this.state.birthday
                          }
                      }).done((res)=>{
                                  erroruname.innerHTML = "";
                                  dialog.showMessageBox(option1);
                              }).fail((err)=>{
                                  erroruname.innerHTML = "Username already exist!";
                              });
                          });
      }
  },

    checkPw(){

        let option1 = {
          type: 'info',
          buttons: ['Yes'],
          title: 'Update Password',
          message: "Successfully updated!",
          defaultId: 0,
          cancelId: 0
        };
        var passPattern = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,}$');
        var newpw = $('#newpw').val();
        var oldpw =$('#oldpw').val();
        console.log(newpw);
        console.log(oldpw);
        var errornewpass = document.getElementById('newpass');
        var erroroldpass = document.getElementById('oldpass');
        if (newpw == "") {
            errornewpass.innerHTML = "The field is empty.";
        } else if (!passPattern.test(newpw)) {
            errornewpass.innerHTML = "At least 6 length (1 Upper & 1 Lower letter & 1 digits)";
        } else if (newpw == oldpw) {
            errornewpass.innerHTML = "Do not use your old password";
        } else {
            errornewpass.innerHTML = "";
        }

        if(errornewpass.innerHTML == ""){
             var token = electron.remote.getGlobal('sharedObject').token;
            $.post( "http://localhost:8080/user/load",
                {
                    'token' :token
                }).done((d) => {
                    $.post("http://localhost:8080/user/profile/checkold", {
                        _id:d._id,
                        "password":oldpw
                    }).done( (res) =>{
                        erroroldpass.innerHTML ="";
                        $.ajax({
                            url:"http://localhost:8080/user/profile/updatePW",   
                            type:"PUT",
                            data:{    
                                _id:d._id,
                                "password":newpw
                            }
                        }).done((res2)=>{
                            dialog.showMessageBox(option1);
                            this.onRemoveItem();

                        });
                    }).fail((err)=>{
                        erroroldpass.innerHTML = "The old password not match.";
                    });
                });

        }


    },

    checkEmail(){

        let option1 = {
          type: 'info',
          buttons: ['Yes'],
          title: 'Update Email',
          message: "Successfully updated!",
          defaultId: 0,
          cancelId: 0
        };
        var emailPattern = new RegExp('^[a-zA-Z0-9]{1,}@[a-zA-Z]{1,}[.]{1}[a-zA-Z]{1,}$');
        var email = $('#email').val();
        var errornewemail = document.getElementById('newemail');

        if (email == "") {
            errornewemail.innerHTML = "The field is empty.";
        } else if (!emailPattern.test(email)) {
            errornewemail.innerHTML = "Not correct email format";
        } else {
            errornewemail.innerHTML = "";
        }

        if(errornewemail.innerHTML == ""){
             var token = electron.remote.getGlobal('sharedObject').token;
            $.post( "http://localhost:8080/user/load",
                {
                    'token' :token
                }).done((d) => {
                    $.ajax({
                        url:"http://localhost:8080/user/profile/updateEmail",   
                        type:"PUT",
                        data:{    
                            _id:d._id,
                            "email":email
                            }
                        }).done((res)=>{
                            errornewemail.innerHTML = "";
                            dialog.showMessageBox(option1);
                            this.onRemoveItem1();

                        }).fail((res)=>{
                            errornewemail.innerHTML = "The Email already exist!";
                        });

                });

        }



    }
});

let profilewidget = ReactDOM.render(
        <AddRemoveLayout />,
        document.getElementById('main_content'));

$("#edit").click(function() {
    let edit = ReactDOM.render(
        <Edit />,
        document.getElementById('main_content'));
});
