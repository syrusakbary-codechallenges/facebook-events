var React = require('react')

var EventCaption = React.createClass({
    render: function() {
        var hour = parseInt(this.props.hour);
        var minute = parseInt((this.props.hour - hour) * 60);
        var ampm = (hour >= 12 && hour < 24) ? 'pm' : 'am';
        hour = hour % 12;
        if (hour == 0) {
            hour = 12;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        var style = {
            height: this.props.height,
            lineHeight: this.props.height + 'px',
            top: this.props.height * this.props.position
        }
        return <div style={style} className={"event-caption "+(this.props.main?"event-caption--main":'')} data-ampm={ampm} {...this.props}>
          <span className="event-caption__hour">
            {hour}:{minute}
          </span>
        </div>
    }
});

module.exports = EventCaption;
