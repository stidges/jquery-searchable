/*!
 * jQuery Searchable Plugin v1.0.0
 * https://github.com/stidges/jquery-searchable
 *
 * Copyright 2014 Stidges
 * Released under the MIT license
 */
;(function( $, window, document, undefined ) {

    var pluginName = 'searchable',
        defaults   = {
            selector: 'tbody tr',
            childSelector: 'td',
            searchField: '#search',
            striped: false,
            oddRow: { },
            evenRow: { },
            hide: function( elem ) { elem.hide(); },
            show: function( elem ) { elem.show(); },
            searchType: 'default',
            onSearchActive: false,
            onSearchEmpty: false,
            onSearchFocus: false,
            onSearchBlur: false,
            clearOnLoad: false
        },
        searchActiveCallback = false,
        searchEmptyCallback = false,
        searchFocusCallback = false,
        searchBlurCallback = false;

    function isFunction(value) {
        return typeof value === 'function';
    }

    function Plugin( element, options ) {
        this.$element   = $( element );
        this.settings   = $.extend( {}, defaults, options );

        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.$searchElems = $( this.settings.selector, this.$element );
            this.$search      = $( this.settings.searchField );
            this.matcherFunc  = this.getMatcherFunction( this.settings.searchType );

            this.determineCallbacks();
            this.bindEvents();
            this.updateStriping();
        },

        determineCallbacks: function() {
            searchActiveCallback = isFunction( this.settings.onSearchActive );
            searchEmptyCallback = isFunction( this.settings.onSearchEmpty );
            searchFocusCallback = isFunction( this.settings.onSearchFocus );
            searchBlurCallback = isFunction( this.settings.onSearchBlur );
        },

        bindEvents: function() {
            var that = this;

            this.$search.on( 'change keyup', function() {
                that.search( $( this ).val() );

                that.updateStriping();
            });

            if ( searchFocusCallback ) {
                this.$search.on( 'focus', this.settings.onSearchFocus );
            }

            if ( searchBlurCallback ) {
                this.$search.on( 'blur', this.settings.onSearchBlur );
            }

            if ( this.settings.clearOnLoad === true ) {
                this.$search.val( '' );
                this.$search.trigger( 'change' );
            }

            if ( this.$search.val() !== '' ) {
                this.$search.trigger( 'change' );
            }
        },

        updateStriping: function() {
            var that     = this,
                styles   = [ 'oddRow', 'evenRow' ],
                selector = this.settings.selector + ':visible';

            if ( !this.settings.striped ) {
                return;
            }

            $( selector, this.$element ).each( function( i, row ) {
                $( row ).css( that.settings[ styles[ i % 2 ] ] );
            });
        },

        search: function( term ) {
            var matcher, elemCount, children, childCount, hide, $elem, i, x;

            if ( $.trim( term ).length === 0 ) {
                this.$searchElems.css( 'display', '' );
                this.updateStriping();

                if ( searchEmptyCallback ) {
                    this.settings.onSearchEmpty( this.$element );
                }

                return;
            } else if ( searchActiveCallback ) {
                this.settings.onSearchActive( this.$element, term );
            }

            elemCount = this.$searchElems.length;
            matcher   = this.matcherFunc( term );

            for ( i = 0; i < elemCount; i++ ) {
                $elem      = $( this.$searchElems[ i ] );
                children   = $elem.find( this.settings.childSelector );
                childCount = children.length;
                hide       = true;

                for ( x = 0; x < childCount; x++ ) {
                    if ( matcher( $( children[ x ] ).text() ) ) {
                        hide = false;
                        break;
                    }
                }

                if ( hide === true ) {
                    this.settings.hide( $elem );
                } else {
                    this.settings.show( $elem );
                }
            }
        },

        getMatcherFunction: function( type ) {
            if ( type === 'fuzzy' ) {
                return this.getFuzzyMatcher;
            } else if ( type === 'strict' ) {
                return this.getStrictMatcher;
            }

            return this.getDefaultMatcher;
        },

        getFuzzyMatcher: function( term ) {
            var regexMatcher,
                pattern = term.split( '' ).reduce( function( a, b ) {
                    return a + '[^' + b + ']*' + b;
                });

            regexMatcher = new RegExp( pattern, 'gi' );

            return function( s ) {
                return regexMatcher.test( s );
            };
        },

        getStrictMatcher: function( term ) {
            term = $.trim( term );

            return function( s ) {
                return ( s.indexOf( term ) !== -1 );
            };
        },

        getDefaultMatcher: function( term ) {
            term = $.trim( term ).toLowerCase();

            return function( s ) {
                return ( s.toLowerCase().indexOf( term ) !== -1 );
            };
        }
    };

    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, 'plugin_' + pluginName ) ) {
                $.data( this, 'plugin_' + pluginName, new Plugin(this, options) );
            }
        });
    };

})( jQuery, window, document );
