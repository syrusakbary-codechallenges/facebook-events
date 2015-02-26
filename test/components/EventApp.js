var assert = require('assert');
var EventApp = require('components/EventApp');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;

describe('EventApp', function(){
    var width, height, startHour, endHour, events;

    beforeEach(function() {
        width = 600;
        height = 720;
        startHour = 9;
        endHour = 21;
        events = [
            {start: 30, end: 150},
            {start: 540, end: 600},
            {start: 560, end: 620},
            {start: 610, end: 670}
        ];
    });

    it('should size well the canvas', function() {
        var renderedComponent = TestUtils.renderIntoDocument(
            <EventApp startHour={startHour} endHour={endHour} width={width} height={height} />
        );
        var el = renderedComponent.getDOMNode();
        var canvas = el.querySelector('#event-canvas');
        assert.equal(parseInt(canvas.style.width), width);
        assert.equal(parseInt(canvas.style.height), height)
    });

    it('should render X events', function() {
        var width = 600;
        var height = 720;
        var renderedComponent = TestUtils.renderIntoDocument(
            <EventApp startHour={startHour} endHour={endHour} width={width} height={height} events={events} />
        );
        var components = TestUtils.scryRenderedDOMComponentsWithClass(renderedComponent, 'event')
        assert.equal(events.length, components.length);
    });
});
