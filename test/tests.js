$(function() {

    'use strict';

    QUnit.module('searchable()', function() {
        QUnit.test('should be defined on a jquery object', function(assert) {
            assert.expect(1);
            assert.ok($('#t1 .table').searchable, 'searchable() should be defined on a jQuery object.');
        });

        QUnit.test('should not reinitialize the plugin on multiple calls', function(assert) {
            assert.expect(1);

            var instance1 = $('#t1 .table').searchable().data('plugin_searchable');
            var instance2 = $('#t1 .table').searchable().data('plugin_searchable');

            assert.equal(instance1, instance2, 'The same plugin instance should be returned on multiple calls');
        });
    });

    QUnit.module('searching', {
        beforeEach: function() {
            this.settings = {
                searchField: '#t1 .search',
                selector: 'tbody tr',
                childSelector: 'td'
            };
            this.$table = $('#t1 .table');
            this.$search = $('#t1 .search');
            this.$rows = this.$table.find('tbody tr');
        }
    }, function() {
        QUnit.test('should reset the row visiblity when the input term is empty', function(assert) {
            assert.expect(2);

            this.$table.searchable(this.settings);
            this.$rows.css('display', 'none');
            assert.visibleRowCount(this.$rows, 0, 'The table body should initially not contain any visible rows');

            this.$search.val('').trigger('change');
            assert.visibleRowCount(this.$rows, 3, 'The table body should contain 3 visible rows after resetting the filter');
        });

        QUnit.test('should hide the rows that do not match the input term', function(assert) {
            assert.expect(2);

            this.$table.searchable(this.settings);
            assert.visibleRowCount(this.$rows, 3, 'The table body should initially contain 3 rows');

            this.$search.val('foo').trigger('change');
            assert.visibleRowCount(this.$rows, 1, 'The table body should contain 1 row after filtering');
        });

        QUnit.test('should match in a case-insensitive manner when using the default matcher', function(assert) {
            assert.expect(1);

            this.$table.searchable(this.settings);
            this.$search.val('FOO').trigger('change');

            assert.visibleRowCount(this.$rows, 1, 'Filtering should be case-insensitive when using default matcher');
        });

        QUnit.test('should match in a case-sensitive manner when using the strict matcher', function(assert) {
            assert.expect(1);

            this.$table.searchable($.extend({ searchType: 'strict' }, this.settings));
            this.$search.val('FOO').trigger('change');

            assert.visibleRowCount(this.$rows, 0, 'Filtering should be case-sensitive when using strict matcher');
        });

        QUnit.test('should fuzzy match when using the fuzzy matcher', function(assert) {
            assert.expect(1);

            this.$table.searchable($.extend({ searchType: 'fuzzy' }, this.settings));
            this.$search.val('lrM').trigger('change');

            assert.visibleRowCount(this.$rows, 1, 'Filtering should be fuzzy when using fuzzy matcher');
        });
    });

    QUnit.module('striping', {
        beforeEach: function() {
            this.settings = {
                searchField: '#t2 .search',
                selector: 'tbody tr',
                childSelector: 'td',
                striped: true,
                oddRow: { 'background-color': '#cccccc' },
                evenRow: { 'background-color': '#ffffff' }
            };
            this.$table = $('#t2 .table');
            this.$search = $('#t2 .search');
            this.$rows = this.$table.find('tbody tr');
        }
    }, function() {
        QUnit.test('should be updated after initialization', function(assert) {
            assert.expect(2);

            this.$table.searchable(this.settings);

            assert.color(this.$rows.eq(0).css('background-color'), '#ccc', '');
            assert.color(this.$rows.eq(1).css('background-color'), '#fff', '');
        });

        // Running inside a hidden div should still update striping correctly.
        // (https://github.com/stidges/jquery-searchable/issues/4)
        QUnit.test('should work inside of a hidden parent element', function(assert) {
            assert.expect(2);

            $('#t2 .hide-me').hide();

            this.$table.searchable(this.settings);

            assert.color(this.$rows.eq(0).css('background-color'), '#ccc', '');
            assert.color(this.$rows.eq(1).css('background-color'), '#fff', '');
        });

        QUnit.test('should be updated after searching', function(assert) {
            assert.expect(3);

            this.$table.searchable(this.settings);
            this.$search.val('foo').trigger('change');

            assert.visibleRowCount(this.$rows, 2, '');
            assert.color(this.$rows.eq(0).css('background-color'), '#ccc', '');
            assert.color(this.$rows.eq(2).css('background-color'), '#fff', '');
        });
    });

    QUnit.module('events', {
        beforeEach: function() {
            this.settings = {
                searchField: '#t1 .search',
                selector: 'tbody tr',
                childSelector: 'td',
            };
            this.$table = $('#t1 .table');
            this.$search = $('#t1 .search');
            this.$rows = this.$table.find('tbody tr');
        }
    }, function() {
        QUnit.test('should trigger onSearchFocus callback when search input is focussed', function(assert) {
            assert.expect(1);
            var called = false;
            this.$table.searchable($.extend({ onSearchFocus: function() { called = true; }}, this.settings));
            this.$search.triggerHandler('focus');
            assert.ok(called, 'When search input is focussed the onSearchFocus callback should be triggered');
        });

        QUnit.test('should trigger onSearchBlur callback when search input is blurred', function(assert) {
            assert.expect(1);
            var called = false;
            this.$table.searchable($.extend({ onSearchBlur: function() { called = true; }}, this.settings));
            this.$search.triggerHandler('blur');
            assert.ok(called, 'When search input is blurred the onSearchBlur callback should be triggered');
        });

        QUnit.test('should trigger onSearchActive callback with the entered search term when searching', function(assert) {
            assert.expect(1);
            var result = null;
            this.$table.searchable($.extend({ onSearchActive: function($elem, term) { result = term; }}, this.settings));
            this.$search.val('foo').trigger('change');
            assert.equal(result, 'foo', 'When searching the onSearchActive callback should be triggered with the entered search term')
        });

        QUnit.test('should trigger onSearchEmpty callback when the search term is empty', function(assert) {
            assert.expect(1);
            var called = false;
            this.$table.searchable($.extend({ onSearchEmpty: function() { called = true; }}, this.settings));
            this.$search.val('').trigger('change');
            assert.ok(called, 'When the search term is empty the onSearchEmpty callback should be triggered');
        });

        // Before, the check if a certain callback was passed was stored in global variables,
        // this caused callbacks not to be called if another searchable instance was initialized
        // without callbacks after a searchable instance with callbacks.
        QUnit.test('should not store the callback function check in a global variable', function(assert) {
            assert.expect(1);
            var called = false;
            $('#t1 .table').searchable($.extend({ onSearchEmpty: function() { called = true; } }, this.settings));
            $('#t2 .table').searchable($.extend({ searchField: '#t2 .search' }, this.settings));
            $('#t1 .search').val('').trigger('change');
            assert.ok(called, '');
        });
    });

});
