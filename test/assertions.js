'use strict';

QUnit.assert.visibleRowCount = function($elems, expected, message) {
    var actual = $elems.filter(function() {
        var style = $(this).css(['display', 'visiblity']);

        return style.display !== 'none' && style.visiblity !== 'hidden';
    }).length;

    this.pushResult({
        result: actual === expected,
        actual: actual,
        expected: expected,
        message: message
    });
};

QUnit.assert.color = function(actual, expected, message) {
    actual = rgb2hex(actual);
    expected = rgb2hex(expected);

    this.pushResult({
        result: actual === expected,
        actual: actual,
        expected: expected,
        message: message
    });
};
