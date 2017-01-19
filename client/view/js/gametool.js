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
var unirest = require('unirest');

const originalLayouts = getFromLS('layouts') || {};

//Hearthstone Deck Builder
var HSBuilder = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      className: "layout",
      cols: {lg: 12, md: 12, sm: 12, xs: 4, xxs: 4},
      rowHeight: 20,
      verticalCompact: true
    };
    this.handleChildUnmount = this.handleChildUnmount.bind(this);
  },

  handleChildUnmount() {
  	this.setState({renderChild: false});
  },

  getInitialState() {
    
    return {
    	layouts: JSON.parse(JSON.stringify(originalLayouts)),
    	selectclass:'',
    	response:undefined,
    	showStore:false,
      showDeckBuilder:false,
      decks:[]
    };

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

  show() {
    this.setState({showStore: true});
  },

  showBuilder(event) {
    this.setState({selectclass: event.target.value});
    this.setState({showDeckBuilder: true});
    unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Neutral?collectible=1")
    .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
    .end(function (result) {
      console.log(result.status, result.headers, result.body);
    });
    if (event.target.value == 'Druid') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Druid?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Hunter') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Hunter?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Mage') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Mage?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Paladin') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Paladin?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Priest') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Priest?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Rogue') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Rogue?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Shaman') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Shaman?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Warlock') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Warlock?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    } else if (event.target.value == 'Warrior') {
      unirest.get("https://omgvamp-hearthstone-v1.p.mashape.com/cards/classes/Warrior?collectible=1")
      .header("X-Mashape-Key", "Y9iQPzINlFmshaXFeSThXj9Pj1ADp1SpHN4jsnHLjKJ1v2rjJ1")
      .end(function (result) {
        console.log(result.status, result.headers, result.body);
      });
    }
  },

  handleSubmit(event) {

  },

  render() {
  	{this.state.renderChild ? <SignUpWindow unmountMe={this.handleChildUnmount} /> : null}
    return (
      <div>
	      <ResponsiveReactGridLayout layouts={this.state.layouts} onLayoutChange={this.onLayoutChange} 
	          onBreakpointChange={this.onBreakpointChange} {...this.props}>
	          
	          {_.map(this.state.decks, this.deckBuilder)}
	      </ResponsiveReactGridLayout>

  		  <div className="row dropFade" style={{display: this.state.showStore ? 'block' : 'none'}}>
	        <h5>Choose a Class: </h5>
	        <select value={this.state.selectclass} onChange={this.showBuilder}>
	            <option className="disabled" value="" disabled>Choose a Class</option>
	            <option value="Druid">Druid</option>
	            <option value="Hunter">Hunter</option>
	            <option value="Mage">Mage</option>
	            <option value="Paladin">Paladin</option>
	            <option value="Priest">Priest</option>
	            <option value="Rogue">Rogue</option>
	            <option value="Shaman">Shaman</option>
	            <option value="Warlock">Warlock</option>
	            <option value="Warrior">Warrior</option>
	        </select>
	        <br/>
	        <br></br>

	      </div>

        <div className="row dropFade" style={{display: this.state.showDeckBuilder ? 'block' : 'none'}}>
          <form onSubmit={this.handleSubmit}>
          <h5>Create a Deck: </h5>
          
          <br/>
          <br></br>

          <button className="button" type="submit" value="Submit" >Submit</button>

        </form>
        </div>

	      <div className="row">
        	<button style={{display: this.state.showStore ?  'none':'block' }} className="button secondary hollow" id="show" onClick={this.show}>+</button>
        </div>
      </div>
	  )
  } 
});

let gameTool = ReactDOM.render(
        <HSBuilder />,
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
