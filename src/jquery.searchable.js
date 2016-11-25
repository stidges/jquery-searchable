/*!
 * jQuery Searchable Plugin v{VERSION} (https://github.com/stidges/jquery-searchable)
 * Copyright 2014-{YEAR} Stidges
 * Licensed under MIT (https://github.com/stidges/jquery-searchable/blob/master/LICENSE)
 */
;((factory) => {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(($) => {

    'use strict';

    const pluginName = 'searchable';
    const pluginDataName = `plugin_${pluginName}`;
    const defaults = {
        selector: 'tbody tr',
        childSelector: 'td',
        searchField: '#search',
        striped: false,
        oddRow: {},
        evenRow: {},
        hide($elem) {
            $elem.hide();
        },
        show($elem) {
            $elem.show();
        },
        reset($elems) {
            $elems.css('display', '');
        },
        searchType: 'default',
        onSearchActive: false,
        onSearchEmpty: false,
        onSearchFocus: false,
        onSearchBlur: false,
        clearOnLoad: false
    };

    function Plugin(element, options) {
        this.$element = $(element);
        this.settings = $.extend({}, defaults, options);

        this.init();
    }

    Plugin.prototype = {
        init() {
            this.$searchElems = $(this.settings.selector, this.$element);
            this.$search = $(this.settings.searchField);
            this.matcherFunc = this.getMatcherFunction(this.settings.searchType);

            this.determineCallbacks();
            this.bindEvents();
            this.updateStriping();
        },

        determineCallbacks() {
            this.hasSearchActiveCallback = $.isFunction(this.settings.onSearchActive);
            this.hasSearchEmptyCallback = $.isFunction(this.settings.onSearchEmpty);
            this.hasSearchFocusCallback = $.isFunction(this.settings.onSearchFocus);
            this.hasSearchBlurCallback = $.isFunction(this.settings.onSearchBlur);
        },

        bindEvents() {
            this.$search.on('change keyup', (e) => {
                this.search(this.$search.val());

                this.updateStriping();
            });

            if (this.hasSearchFocusCallback) {
                this.$search.on('focus', this.settings.onSearchFocus);
            }

            if (this.hasSearchBlurCallback) {
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

        updateStriping() {
            const styles = ['oddRow', 'evenRow'];

            if (!this.settings.striped) {
                return;
            }

            this.$searchElems
                .filter((i, row) => {
                    const { display, visibility } = $(row).css(['display', 'visibility']);

                    return display !== 'none' && visibility !== 'hidden';
                })
                .each((i, row) => {
                    $(row).css(this.settings[styles[i % 2]]);
                });
        },

        search(term) {
            if ($.trim(term).length === 0) {
                this.settings.reset(this.$searchElems);
                this.updateStriping();

                if (this.hasSearchEmptyCallback) {
                    this.settings.onSearchEmpty(this.$element);
                }

                return;
            } else if (this.hasSearchActiveCallback) {
                this.settings.onSearchActive(this.$element, term);
            }

            const elemCount = this.$searchElems.length;
            const matcher = this.matcherFunc(term);

            for (let i = 0; i < elemCount; i++) {
                const $elem = $(this.$searchElems[i]);
                const children = $elem.find(this.settings.childSelector);
                const childCount = children.length;
                let hide = true;

                for (let x = 0; x < childCount; x++) {
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

        getMatcherFunction(type) {
            if (type === 'fuzzy') {
                return this.getFuzzyMatcher;
            } else if (type === 'strict') {
                return this.getStrictMatcher;
            }

            return this.getDefaultMatcher;
        },

        getFuzzyMatcher(term) {
            const letters = term.split('');
            let pattern = letters[0];

            for (let i = 1, len = letters.length; i < len; i++) {
                const letter = letters[i];
                pattern += `[^${letter}]*${letter}`;
            }

            const regexMatcher = new RegExp(pattern, 'gi');

            return (s) => regexMatcher.test(s);
        },

        getStrictMatcher(term) {
            term = $.trim(term);

            return (s) => s.indexOf(term) !== -1;
        },

        getDefaultMatcher(term) {
            term = $.trim(term).toLowerCase();

            return (s) => s.toLowerCase().indexOf(term) !== -1;
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each((i, elem) => {
            if (!$.data(elem, pluginDataName)) {
                $.data(elem, pluginDataName, new Plugin(elem, options));
            }
        });
    };

});
