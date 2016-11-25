'use strict';

function toHex(value) {
    return ('0' + parseInt(value).toString(16)).slice(-2);
}

function normalizeHex(hex) {
    if (hex.length === 7) {
        return hex;
    } else if (hex.length !== 4) {
        throw 'Invalid hex';
    }

    var hex = hex.slice(1).split('');

    return '#' + hex[0].repeat(2) + hex[1].repeat(2) + hex[2].repeat(2);
}

function rgb2hex(rgb) {
    if (rgb.indexOf('rgb') === -1) {
        return normalizeHex(rgb);
    }

    var rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);

    return '#' + toHex(rgb[1]) + toHex(rgb[2]) + toHex(rgb[3]);
}
