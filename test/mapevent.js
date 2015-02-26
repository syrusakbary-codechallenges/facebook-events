var assert = require('assert');
var {utils, MapEvent, MapEventCollection} = require('mapevent');
var {columnize, distributeEvents} = utils;

var getColumnsFunction = function(f, columns) {
    return columns.map(function(column) {
        return column.map(f);
    });
};

var getSuperColumnsFunction = function(f, columnsGroup) {
    return columnsGroup.map(getColumnsFunction.bind(null, f));
};

var getKey = function(map_event) {
    return map_event.event.key;
}

var getLeft = function(map_event) {
    return map_event.position.left;
}
var getWidth = function(map_event) {
    return map_event.position.right - map_event.position.left;
}

var getSuperColumnsKeys = getSuperColumnsFunction.bind(null, getKey);
var getColumnsLeft = getColumnsFunction.bind(null, getLeft);
var getColumnsWidth = getColumnsFunction.bind(null, getWidth);

var fakeMapEvents = getColumnsFunction.bind(null, function(event) {
    return new MapEvent(event, {});
});

describe('mapevent', function() {
    var map_events;
    var events;
    describe('MapEvent', function() {
        describe('collidesVertically', function() {
            var map_event;
            var collision;
            it('Intersected MapEvents should collide', function() {
                map_event = new MapEvent({}, {top: 0, bottom: 100});
                collision = new MapEvent({}, {top: 10, bottom: 110});
                assert.equal(map_event.collidesVertically(collision), true);
            });
            it('Separated MapEvents shouldn\'t collide', function() {
                map_event = new MapEvent({}, {top: 0, bottom: 100});
                collision = new MapEvent({}, {top: 100, bottom: 110});
                assert.equal(map_event.collidesVertically(collision), false);
            });
        });
        describe('verticalOrder', function() {
            var map_event;
            var map_event2;
            it('should respect top order', function() {
                map_event = new MapEvent({}, {top: 0, bottom: 100});
                map_event2 = new MapEvent({}, {top: 10, bottom: 100});
                assert.equal(MapEvent.verticalOrder(map_event, map_event2), -1);
                assert.equal(MapEvent.verticalOrder(map_event2, map_event), 1);
            });
            it('should respect bottom order', function() {
                map_event = new MapEvent({}, {top: 0, bottom: 100});
                map_event2 = new MapEvent({}, {top: 0, bottom: 90});
                assert.equal(MapEvent.verticalOrder(map_event, map_event2), 1);
                assert.equal(MapEvent.verticalOrder(map_event2, map_event), -1);
            });
        });
    });
    describe('columnize', function() {
        it('should group columns', function() {
            events = [
                {start: 0, end: 100, key: 1},
                {start: 60, end: 110, key: 2},
                {start: 100, end: 150, key: 3}
            ];
            map_events = new MapEventCollection(events);
            var columnized = columnize(map_events.events);
            assert.deepEqual(getSuperColumnsKeys(columnized), [
                [
                    [1, 3],
                    [2]
                ]
            ]);
        });
        it('should separate column groups', function() {
            events = [
                {start: 0, end: 50, key: 1},
                {start: 60, end: 110, key: 2},
                {start: 100, end: 150, key: 3}
            ];
            map_events = new MapEventCollection(events);
            var columnized = columnize(map_events.events);
            assert.deepEqual(getSuperColumnsKeys(columnized), [
                [
                    [1]
                ],
                [
                    [2],
                    [3]
                ]
            ]);
        });
        it('should pack column groups', function() {
            events = [
                {start: 0, end: 100, key: 1},
                {start: 10, end: 20, key: 2},
                {start: 10, end: 20, key: 3},
                {start: 20, end: 30, key: 4}
            ];
            map_events = new MapEventCollection(events);
            var columnized = columnize(map_events.events);
            assert.deepEqual(getSuperColumnsKeys(columnized), [
                [
                    [1],
                    [2, 4],
                    [3]
                ]
            ]);
        });
    });
    describe('distributeEvents', function() {
        it('should distribute regular', function() {
            var events = fakeMapEvents([
                [1, 2],
                [3, 4]
            ]);
            distributeEvents(events);
            assert.deepEqual(getColumnsLeft(events), [
                [0, 0],
                [0.5, 0.5]
            ]); // %{LEFT}
        });
        it('should distribute irregular', function() {
            var events = fakeMapEvents([
                [1],
                [2, 3],
                [4, 5],
                [7]
            ]);
            distributeEvents(events);
            assert.deepEqual(getColumnsLeft(events), [
                [0],
                [0.25, 0.25],
                [0.5, 0.5],
                [0.75]
            ]); // %{LEFT}
        });
        it('should have same width', function() {
            var events = fakeMapEvents([
                [1],
                [2, 3],
                [4, 5],
                [7]
            ]);
            distributeEvents(events);
            assert.deepEqual(getColumnsWidth(events), [
                [0.25],
                [0.25, 0.25],
                [0.25, 0.25],
                [0.25]
            ]); // 25% width each
        });
        it('sigle column should have full width', function() {
            var events = fakeMapEvents([
                [1]
            ]);
            distributeEvents(events);
            assert.deepEqual(getColumnsWidth(events), [
                [1]
            ]); // 100% width
        });

    });
});