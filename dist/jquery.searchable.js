/*!
 * jQuery Searchable Plugin v2.0.0 (https://github.com/stidges/jquery-searchable)
 * Copyright 2014-2016 Stidges
 * Licensed under MIT (https://github.com/stidges/jquery-searchable/blob/master/LICENSE)
 */
;(function ($) {

    'use strict';

    var pluginName = 'searchable';
    var pluginDataName = 'plugin_' + pluginName;
    var defaults = {
        selector: 'tbody tr',
        childSelector: 'td',
        searchField: '#search',
        striped: false,
        oddRow: {},
        evenRow: {},
        hide: function hide(elem) {
            elem.hide();
        },
        show: function show(elem) {
            elem.show();
        },

        searchType: 'default',
        onSearchActive: false,
        onSearchEmpty: false,
        onSearchFocus: false,
        onSearchBlur: false,
        clearOnLoad: false
    };
    var searchActiveCallback = false;
    var searchEmptyCallback = false;
    var searchFocusCallback = false;
    var searchBlurCallback = false;

    function Plugin(element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);

        this.init();
    }

    Plugin.prototype = {
        init: function init() {
            this.$searchElems = $(this.settings.selector, this.$element);
            this.$search = $(this.settings.searchField);
            this.matcherFunc = this.getMatcherFunction(this.settings.searchType);

            this.determineCallbacks();
            this.bindEvents();
            this.updateStriping();
        },
        determineCallbacks: function determineCallbacks() {
            searchActiveCallback = $.isFunction(this.settings.onSearchActive);
            searchEmptyCallback = $.isFunction(this.settings.onSearchEmpty);
            searchFocusCallback = $.isFunction(this.settings.onSearchFocus);
            searchBlurCallback = $.isFunction(this.settings.onSearchBlur);
        },
        bindEvents: function bindEvents() {
            var _this = this;

            this.$search.on('change keyup', function (e) {
                _this.search(_this.$search.val());

                _this.updateStriping();
            });

            if (searchFocusCallback) {
                this.$search.on('focus', this.settings.onSearchFocus);
            }

            if (searchBlurCallback) {
                this.$search.on('blur', this.settings.onSearchBlur);
            }

            if (this.settings.clearOnLoad === true) {
                this.$search.val('');
                this.$search.trigger('change');
            }

            if (this.$search.val() !== '') {
                this.$search.trigger('change');
            }
        },
        updateStriping: function updateStriping() {
            var _this2 = this;

            var styles = ['oddRow', 'evenRow'];
            var selector = this.settings.selector + ':visible';

            if (!this.settings.striped) {
                return;
            }

            $(selector, this.$element).each(function (i, row) {
                $(row).css(_this2.settings[styles[i % 2]]);
            });
        },
        search: function search(term) {
            if ($.trim(term).length === 0) {
                this.$searchElems.css('display', '');
                this.updateStriping();

                if (searchEmptyCallback) {
                    this.settings.onSearchEmpty(this.$element);
                }

                return;
            } else if (searchActiveCallback) {
                this.settings.onSearchActive(this.$element, term);
            }

            var elemCount = this.$searchElems.length;
            var matcher = this.matcherFunc(term);

            for (var i = 0; i < elemCount; i++) {
                var $elem = $(this.$searchElems[i]);
                var children = $elem.find(this.settings.childSelector);
                var childCount = children.length;
                var hide = true;

                for (var x = 0; x < childCount; x++) {
                    if (matcher($(children[x]).text())) {
                        hide = false;
                        break;
                    }
                }

                if (hide === true) {
                    this.settings.hide($elem);
                } else {
                    this.settings.show($elem);
                }
            }
        },
        getMatcherFunction: function getMatcherFunction(type) {
            if (type === 'fuzzy') {
                return this.getFuzzyMatcher;
            } else if (type === 'strict') {
                return this.getStrictMatcher;
            }

            return this.getDefaultMatcher;
        },
        getFuzzyMatcher: function getFuzzyMatcher(term) {
            var letters = term.split('');
            var pattern = letters[0];

            for (var i = 1, len = letters.length; i < len; i++) {
                var letter = letters[i];
                pattern += '[^' + letter + ']*' + letter;
            }

            var regexMatcher = new RegExp(pattern, 'gi');

            return function (s) {
                return regexMatcher.test(s);
            };
        },
        getStrictMatcher: function getStrictMatcher(term) {
            term = $.trim(term);

            return function (s) {
                return s.indexOf(term) !== -1;
            };
        },
        getDefaultMatcher: function getDefaultMatcher(term) {
            term = $.trim(term).toLowerCase();

            return function (s) {
                return s.toLowerCase().indexOf(term) !== -1;
            };
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function (i, elem) {
            if (!$.data(elem, pluginDataName)) {
                $.data(elem, pluginDataName, new Plugin(elem, options));
            }
        });
    };
})(jQuery, window, document);