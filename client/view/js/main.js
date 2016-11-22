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
            <div id="widget1" key="1" data-grid={{x: 0, y: 0, w: 4, h: 16}}><span id="remove1" style={removeStyle} onClick={this.onRemoveItem('1')}>x</span>
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

var Edit= React.createClass({
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
      items:[{i:"0",x:0,y:0,w:4,h:13}],
      pw:[],
      email:[],

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


 createProfile(el) {
    var i = el.i;
    return (
      <div key={i} data-grid={el}>
        <h3> Edit Your personal Info</h3>
        <hr/>
        <img src={'./img/user.jpg'}/>
        <button onClick={this.onAddchangepw}>change password</button>
        <button onClick={this.onAddchangeEmail}>change email</button>
      </div>
    );
  },

  onAddchangepw() {

    this.setState({
      pw: this.state.pw.concat({
        i: "change password",
        x: 0,
        y: 13,
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
        y: 13,
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
        <input type="password" name="oldpw" />
        </label>
        <br/>
        <label>
        New password:
        <input type="password" name="newpw" />
        </label>
        <br/>
        <input type="submit" value="Submit" />
        </form>
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
        <input type="text" name="email" />
        </label>
        <br/>
        <input type="submit" value="Submit" />
        </form>
      </div>
    );
  },

  render() {
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
