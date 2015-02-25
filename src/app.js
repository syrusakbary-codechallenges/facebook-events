var React = require('react');
var EventApp = require('./components/EventApp');

React.render(
  <EventApp startHour={window.START_HOUR} endHour={window.END_HOUR} width={window.CANVAS_WIDTH} height={window.CANVAS_HEIGHT} events={window.DEFAULT_EVENTS} />,
  document.getElementById('app')
);
