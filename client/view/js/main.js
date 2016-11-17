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
      rowHeight: 100,
      verticalCompact: false
    };
  },

  getInitialState() {
    var layout = this.generateLayout();
    var t = this.getAPI();
    console.log(t);
    return {
      layout: layout,
      value: "",
      text: t
    };
  },

  generateLayout() {
    var p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var y = _.result(p, 'y') || Math.ceil(Math.random() * 4) + 1;
      return {x: i * 2 % 12, y: Math.floor(i / 6) * y, w: 2, h: y, i: i.toString()};
    });
  },

  /**getAPI() {
    var result = null;
    $.ajax({
        url: "https://api.lootbox.eu/pc/us/M3ng2er-1667/profile",
        type: "GET",
        dataType: "html",
        async: false,
        success: function(data) {
            result = data;
        }
    });
    return result;
  }, **/

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

  handleChange(event) {
    this.setState({value: event.target.value});
  },

  handleSubmit(event) {
    alert('Your favorite Game is: ' + this.state.value);
    event.preventDefault();
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
            <div id="widget1" key="1" data-grid={{x: 3, y: 0, w: 2, h: 2}}><span id="remove1" style={removeStyle} onClick={this.onRemoveItem('1')}>x</span>
            <form onSubmit={this.handleSubmit}>Games:

            <select value={this.state.value} onChange={this.handleChange}>
            <option value="Hearthstone">Hearthstone</option>
            <option value="Overwatch">Overwatch</option>
            <option value="League of Legends">League of Legends</option>
            <option value="Dota2">Dota2</option>
            </select>
            <input type="submit" value="Submit"/>
            </form>
            </div>
            <div id="widget2" key="2" data-grid={{x: 5, y: 0, w: 2, h: 2}}><span id="remove2" style={removeStyle} onClick={this.onRemoveItem('2')}>x</span>
            <p>{this.state.text}</p>
            </div>
            <div id="widget3" key="3" data-grid={{x: 7, y: 0, w: 2, h: 2}}><span id="remove3" style={removeStyle} onClick={this.onRemoveItem('3')}>x</span>3</div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
});

module.exports = AddRemoveLayout;

let MyFirstGridComponent = ReactDOM.render(
        <AddRemoveLayout />,
        document.getElementById('main_content'));


function getAPI() {
        var a=123423
        $.get("https://api.lootbox.eu/pc/us/M3ng2er-1667/profile").done(function(res){
            a=res.data.username;
            console.log(a); 
            return a;
        });
         
       
     };
