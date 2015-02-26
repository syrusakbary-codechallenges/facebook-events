var React = require('react')
var range = require('lodash/utility/range')
var random = require('lodash/number/random')
var Event = require('./Event')
var EventCaption = require('./EventCaption')
var {MapEvent, MapEventCollection} = require('../mapevent')

var EventApp = React.createClass({
  getInitialState: function () {
    return {
      events: (new MapEventCollection(this.props.events || [])).fill(),
      minuteOffset: 0,
      startHour: this.props.startHour,
      endHour: this.props.endHour,
      width: this.props.width,
      height: this.props.height
    }
  },

  setEvents: function (events) {
    this.setState({events: (new MapEventCollection(events)).fill()});
    // Idempotent function
    return events; 
  },

  componentDidMount: function () {
    window.layOutDay = this.setEvents.bind(this);
  },

  componentWillUnmount: function () {
    window.layOutDay = function () {};
  },

  removeEvent: function (map_event) {
    this.state.events.remove(map_event);
    this.state.events.fill()
    this.setState({events:this.state.events});
  },

  renderMapEvent: function (map_event) {
      var {event, position} = map_event;
      var {top, left, bottom, right} = position;
      var width = (right-left)*this.state.width; // right/left are a precentage (0, 1]
      var proportion = (this.state.endHour-this.state.startHour)*60/this.state.height;
      var height = (bottom-top)/proportion;
      top = (top + this.state.minuteOffset)/ proportion;
      left = left*this.state.width;
      return <Event onRemove={this.removeEvent.bind(this, map_event)} key={event.key} name={event.name} location={event.location} top={top} left={left} width={width} height={height} />
  },

  renderCaptions: function () {
    var hours = (this.state.endHour-this.state.startHour)*2;
    var hours_range = range(this.state.startHour, this.state.endHour+.5, .5);
    var proportion = (hours+1)/hours;
    var captionHeight = this.state.height/hours;
    var captionStyle = {
      height: this.state.height*proportion,
      marginTop: -captionHeight/2
    };
    return <div id="event-captions" style={captionStyle}>
      {hours_range.map(function (hour, i) {
        return <EventCaption position={i} height={captionHeight} key={''+hour*10} main={hour==parseInt(hour)} hour={hour} />
      })}
    </div>
  },

  /* App extras :) */
  addRandomEvent: function () {
    var E_MIN_HEIGHT = 60;
    var E_MAX_HEIGHT = 200;
    var start = random(0, this.state.height-E_MIN_HEIGHT);
    var end = Math.min(E_MAX_HEIGHT+start, random(start+E_MIN_HEIGHT, this.state.height));
    key = random(1000+this.state.events.length, 2000);
    this.state.events.add({start, end, key});
    this.state.events.fill()
    this.setState({events:this.state.events});
  },

  resetEvents: function () {
    this.setEvents(this.props.events);
  },

  toggleSize: function () {
    this.setState({
      width: this.state.resetSize?this.props.width:400,
      height: this.state.resetSize?this.props.height:400,
      resetSize: !this.state.resetSize
    });
  },

  changeHours: function () {
    var startHour = this.state.toggleHours?this.props.startHour:0;
    var endHour = this.state.toggleHours?this.props.endHour:23.5;
    var minuteOffset = (this.props.startHour-startHour)*60;
    var toggleHours = !this.state.toggleHours;
    this.setState({startHour, endHour, minuteOffset, toggleHours});
  },

  render: function () {
    var canvasStyle = {
      height: this.state.height,
      width: this.state.width
    };
    return (
      <div id="event-app">
        {this.renderCaptions()}
        <div id="event-canvas-wrapper">
          <div id="event-canvas" style={canvasStyle}>
            {this.state.events.events.map(this.renderMapEvent)}
          </div>
        </div>
        <div id="event-extras">
          <a className="event-button" onClick={this.addRandomEvent} role="button">Add random event</a>
          <a className="event-button" onClick={this.resetEvents} role="button">Reset default events</a>
          <a className="event-button" onClick={this.toggleSize} role="button">Toggle size</a>
          <a className="event-button" onClick={this.changeHours} role="button">Toggle hours</a>
        </div>
      </div>
    );
  }
});

module.exports = EventApp;
