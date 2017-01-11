'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
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


const originalLayouts = getFromLS('layouts') || {};

//Profile page
var Profile = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 12, sm: 12, xs: 4, xxs: 4},
      rowHeight: 20,
      verticalCompact: false
    };
  },

  getInitialState() {
    //var layout = this.generateLayout();
    
    return {
      layouts: JSON.parse(JSON.stringify(originalLayouts)),
      profile:{i:"profile",x: 100, y: 100, w: 0, h: 0, static: true},
      addgame:{i:"add",x: 100, y:100 , w: 0, h: 0, static: false},
      games:[],
      response:undefined,
      username:null,
      lastname:null,
      firstname:null,
      newCounter: 0,
      selectinterest:null,
      selectgame:'',
      showStore:false,
      img:null
    };
  },

  loadProfile(){
    var token = electron.remote.getGlobal('sharedObject').token;

    $.post( "http://localhost:8080/user/load",{
        'token': token
        }).done((d)=> {
            $.get('http://localhost:8080/user/profile/'+ d._id + '/info').done((res)=>{
                var g=res.gameinventory.length;

                this.setState({response: res,
                                username:res.username,
                                firstname:res.firstname,
                                lastname:res.lastname});
                for (var i = 0; i < g; i++) {
                    if (i < 3) {
                          var width = 4;
                          var height = 13;
                          var row = 0;
                        } else {
                          var width = 12;
                          var height = 2;
                          var row = 14;
                        }
                      this.setState({
                                games: this.state.games.concat({
                                  i: res.gameinventory[i].game,
                                  x: 0+i*4,
                                  y: row,
                                  w: width,
                                  h: height,
                                  int:res.gameinventory[i].interest,
                                  useringame:res.gameinventory[i].useringame,  
                                })
                });
                
                }
                
        });
    });
  },

  componentWillMount: function(){
    this.loadProfile();
  },

   resetLayout() {
    this.setState({layouts: {}});
  },


  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  },

  onLayoutChange(layout, layouts) {
    saveToLS('layouts', layouts);
    this.setState({layouts});
    
  },

  handleChange(event) {
      this.setState({selectgame: event.target.value});
    },
  show() {
      this.setState({showStore: true});
    },
 
    handleChange2(event) {
     var options = event.target.options;
     var values = [];
     for (var i = 0, l = options.length; i < l; i++) {
       if (options[i].selected) {
         values.push(options[i].value);
       }
     };
     
     this.setState({selectinterest:values});
     
   },
 
    handleSubmit(event) {
      alert('Your favorite Game is: ' + this.state.selectgame);
      event.preventDefault();
      var token = electron.remote.getGlobal('sharedObject').token;
      $.post( "http://localhost:8080/user/load",
               {
                   'token' :token
                }).done((d)=> {
                   $.ajax({
                           url:"http://localhost:8080/user/profile/updategames",   
                           type:"PUT",
                           contentType: 'application/json; charset=utf-8',
                           data:JSON.stringify({    
                               _id:d._id,
                               game:this.state.selectgame,
                               useringame:$("#gameusername").val(),
                               interest:this.state.selectinterest
                           })
                       }).done((res)=>{
                          this.setState({
                                games: this.state.games.concat({
                                  i: this.state.selectgame,
                                  x: 0,
                                  y: 0,
                                  w: 4,
                                  h: 6,
                                  int:this.state.selectinterest,
                                  useringame:$("#gameusername").val(),  
                                })
                              });
                       }).fail((err)=>{
                                   alert("opps!");
                               });
                           });

 
     },
 

  

  onGame(el){
    var i = el.i;
    return (
    <div key={i} data-grid={el}>
    <h2>{el.i} </h2>
    <div className="gameImage" style={{background: 'url(./img/dota2_logo.jpg)'}}>
    <div className="row">
    {/*<p>interest:</p>
    <p>{el.int}</p>
    <p>username in game : {el.useringame} </p>
    <button className="button" onClick={this.editgame(el)}>Edit</button>*/}
    </div>
    </div>
    <ul className="menu horizontal">
      <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
</svg>
</a></li>
      <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
</svg>
</a></li>
      <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
</svg>
</a></li>
    </ul>
    </div>
    );
  },

  editgame(){
    //
  },

  goToEdit() {
    let edit = ReactDOM.render(
        <Edit />,
        document.getElementById('main_content'));
  },

  render() {
    if (this.state.response) {
      return (
        <div>
        <div className="row">
        <div className="column small-8"><h3>Profile</h3></div>
        <div className="column small-4"><button className="button" onClick={this.resetLayout}>Reset Layout</button></div>
        </div>
        
          <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={this.onLayoutChange} 
              onBreakpointChange={this.onBreakpointChange} {...this.props}>
              
              {_.map(this.state.games, this.onGame)}
          </ResponsiveReactGridLayout>

          <div className="row">
          <div style={{display: this.state.showStore ? 'block' : 'none'}}>
                <form onSubmit={this.handleSubmit}>
                <h5>Add Games:</h5>
                <select value={this.state.selectgame} onChange={this.handleChange}>
                    <option value="" disabled>Select your option</option>
                    <option value="Hearthstone">Hearthstone</option>
                    <option value="Overwatch">Overwatch</option>
                    <option value="Dota2">Dota2</option>
                    <option value="League of lengends">League of lengends</option>
                </select>
                <br/> User:
                <br></br>
                <input id="gameusername" type="text" placeholder="YourTag#0000"/>
                <input type="submit" value="Submit" />
                
            </form></div>
          <button className="button" id="show" onClick={this.show}>Add Game</button>
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading</div>
        );
    }
  }
});

//Edit page
var Edit = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 12, sm: 12, xs: 4, xxs: 4},
      rowHeight: 20,
      verticalCompact: false
    };
  },

  getInitialState() {
    var layout = this.generateLayout();

    return {

      layout: layout,
      items:{i:"edit",x:0,y:0,w:10,h:21,static: true},
      pw:[],
      email:[],
      response:undefined,
      username:null,
      lastname:null,
      firstname:null,
      birthday:null

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
        <input className='profilepic' id='profilepic' type='image' onClick={this.openFileExp} src={'./img/user.jpg'} draggable="false"/>
        <input className='uploadedpic' onChange={this.uploadPic} id='uploadedpic' type='file' accept="image/*"/>
        <br></br>
        <font id='uploadmsg' color='red'></font>

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
        <button onClick={this.onAddchangepw}>Change Password</button>
        <button onClick={this.onAddchangeEmail}>Change Email</button>
        <button onClick={this.backToProfile}>Back</button>

      </div>
    );
  },

  openFileExp() {
    $("input[id='uploadedpic']").click();
  },

  uploadPic() {

    let option1 = {
      type: 'info',
      buttons: ['Yes'],
      title: 'Update profile picture',
      message: "Successfully updated.",
      defaultId: 0,
      cancelId: 0
    };

    let option2 = {
      type: 'info',
      buttons: ['Yes'],
      title: 'Update profile picture',
      message: "Upload failed.",
      defaultId: 0,
      cancelId: 0
    };

    var pic = document.getElementById("uploadedpic").files;
    if (pic.length != 0) {
      document.getElementById("profilepic").src = pic[0].path;
    }

    // var pic = document.getElementById("uploadedpic").files;
    // console.log(pic);
    // if (pic.length != 0) {
    //   document.getElementById("profilepic").src = pic[0].path;
    //   var image = fs.readFileSync(pic[0].path);
    //   var token = electron.remote.getGlobal('sharedObject').token;
    //        $.post( "http://localhost:8080/user/load",
    //           {
    //               'token' :token
    //           }).done((d)=> {
    //               $.ajax({
    //                       url:"http://localhost:8080/user/profile/updatePic",   
    //                       type:"PUT",
    //                       data:{    
    //                           _id:d._id,
    //                           "img":pic[0].path
    //                       }
    //                   }).done((res)=>{
    //                       dialog.showMessageBox(option1);
    //                   }).fail((err)=>{
    //                       dialog.showMessageBox(option2);
    //                   });
    //               });
    // }
  },

  onRemoveItem() {
    this.setState({pw: _.reject(this.state.pw, {i: "change password"})});
  },

  onRemoveItem1() {
    this.setState({email: _.reject(this.state.email, {i: "change email"})});
  },

  onAddchangepw() {
    if(this.state.pw.length==0){
    this.setState({
      pw: this.state.pw.concat({
        i: "change password",
        x: 0,
        y: 16,
        w: 4,
        h: 10
      })
    });
    }
  },

  onAddchangeEmail() {
  if(this.state.email.length==0){
    this.setState({
      email: this.state.email.concat({
        i: "change email",
        x: 4,
        y: 16,
        w: 4,
        h: 10
      })
    });
  }
  },

  backToProfile() {
    let profilewidget = ReactDOM.render(
        <Profile />,
        document.getElementById('main_content'));
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
        <label>
        Confirm password:
        <input type="password" id="cnewpw" />
        <font id='cnewpass' color='red'></font>
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
            { this.createProfile(this.state.items)}
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
        var cnewpw=$('#cnewpw').val();
        console.log(newpw,oldpw,cnewpw);
        var errornewpass = document.getElementById('newpass');
        var erroroldpass = document.getElementById('oldpass');
        var errorcnewpass = document.getElementById('cnewpass');
        if (newpw == "") {
            errornewpass.innerHTML = "The field is empty.";
        } else if (!passPattern.test(newpw)) {
            errornewpass.innerHTML = "At least 6 length (1 Upper & 1 Lower letter & 1 digits)";
        } else if (newpw == oldpw) {
            errornewpass.innerHTML = "Do not use your old password";
        } else {
            errornewpass.innerHTML = "";
        }
        if (cnewpw == "") {
            errorcnewpass.innerHTML = "The field is empty.";
        }  else if (cnewpw != newpw) {
            errorcnewpass.innerHTML = "The new password does not match";
        } else {
            errorcnewpass.innerHTML = "";
        }


        if(errornewpass.innerHTML == "" && errorcnewpass.innerHTML == ""){
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
        <Profile />,
        document.getElementById('main_content'));

function getFromLS(key) {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8')) || {};
    } catch(e) {/*Ignore*/}
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (global.localStorage) {
    global.localStorage.setItem('rgl-8', JSON.stringify({
      [key]: value
    }));
  }
}
