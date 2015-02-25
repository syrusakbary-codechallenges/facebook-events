class MapEvent {
    constructor(event, position) {
        this.event = event;
        this.position = position;
    }

    collidesVertically(event) {
        return event.position.bottom > this.position.top && event.position.top < this.position.bottom;
    }

    static verticalOrder(e1, e2) {
        if (e1.position.top < e2.position.top) return -1;
        if (e1.position.top > e2.position.top) return 1;
        if (e1.position.bottom < e2.position.bottom) return -1;
        if (e1.position.bottom > e2.position.bottom) return 1;
        return 0;
    }
}

class MapEventCollection {
    constructor(events) {
        this.events = (events || []).map(this.toMap);
    }

    toMap(event, i) {
        event.key = event.key || i;
        return new MapEvent(event, {
            top: event.start,
            bottom: event.end
        })
    }

    add(event) {
        this.events.push(this.toMap(event));
    }

    remove(event) {
        var i = this.events.indexOf(event);
        if (i > -1) {
            this.events.splice(i, 1);
        }
    }

    fill() {
        var columnsGroup = columnize(this.events);
        for (var i in columnsGroup) {
            var columns = columnsGroup[i];
            distributeEvents(columns);
        }
        return this;
    }
}

var columnize = function(events) {
    map_events = events.sort(MapEvent.verticalOrder);
    var lastEventEnding = null,
        columns = [],
        columnsGroup = [];

    for (var i in map_events) {
        var e = map_events[i];
        if (columns.length && e.position.top >= lastEventEnding) {
            columnsGroup.push(columns);
            columns = [];
        }
        var col = columns.length && fitsInColumn(e, columns);
        if (!col) {
            // Create new column and place it in columns
            col = [];
            columns.push(col);
        }
        col.push(e);
        lastEventEnding = Math.max(e.position.bottom, lastEventEnding);
    }
    if (columns.length) {
        columnsGroup.push(columns);
    }
    return columnsGroup;
}

var fitsInColumn = function(event, columns) {
    for (var i in columns) {
        var col = columns[i];
        var lastEventInCol = col[col.length - 1];
        if (!event.collidesVertically(lastEventInCol)) {
            return col;
        }
    }
    return false;
};

var distributeEvents = function(columns) {
    for (var i in columns) {
        var column = columns[i];
        for (var j in column) {
            var map_event = column[j];
            map_event.position.left = i / columns.length;
            map_event.position.right = map_event.position.left + 1 / columns.length;
        }
    }
}

module.exports = {
    MapEvent,
    MapEventCollection,
    /* exposing utils for testing proposes */
    utils: {
        columnize,
        fitsInColumn,
        distributeEvents
    }
}
