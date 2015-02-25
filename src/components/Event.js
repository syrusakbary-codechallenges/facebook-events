var React = require('react');
var transform = require('browsernizr/test/css/transforms');
var Modernizr = require('browsernizr');

var csstransformsAvailable = Modernizr.csstransforms;

var Event = React.createClass({
  getDefaultProps: function () {
    return {
      name: "Sample Item",
      location: "Sample Location"
    }
  },

  render: function () {
    
    var style = {
      width: this.props.width,
      height: this.props.height
    }
    if (csstransformsAvailable) {
      var transform = "translateY("+this.props.top+"px) translateX("+this.props.left+"px)";
      style.WebkitTransform = style.transform =  transform;
    }
    else {
      style.top = this.props.top;
      style.left = this.props.left;
    }
    return <div className="event" style={style}>
      <div className="event-wrapper">
        <h3 className="event__name">{this.props.name}</h3>
        <span className="event__location">{this.props.location}</span>
        <a className="event__remove" onClick={this.props.onRemove}>Remove event</a>
      </div>
    </div>
  }
});

module.exports = Event;
