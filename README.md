jQuery Searchable Plugin
========================

*Latest version: v1.1.0* (View the [changelog](#changelog))

Tiny, fast jQuery plugin to search through elements as you type. This plugin is created and maintained by **Stidges** ( [Twitter](http://twitter.com/stidges) | [Github](http://github.com/stidges) ).

## Features

- **Lightweight**. This plugin is only ~1kB minified and gzipped!
- **Fast**. This plugin is optimized for fast, lagless searching even through large element sets.
- **Multiple search types**. This plugin provides three different search types out-of-the-box! Fuzzy matching, strict (case sensitive) matching and default (case insensitive) matching.
- **Automatic row striping**. When searching through a table, rows get hidden when they don't match. When using a CSS framework like [Bootstrap](http://getbootstrap.com) this would mess up your table striping. This plugin makes allows you to define the CSS to be applied to odd and even rows, and updates them while searching.
- **Custom show/hide**. You can define custom functions for showing and hiding the elements while searching.
- **Search anything**. This plugin isn't restricted to use on tables, any set of elements that has 'rows' with 'columns' inside them can be used.

## Demo

[Click here](http://bootsnipp.com/snippets/93XX) to view a demo of this plugin in action (Hosted on [Bootsnipp](http://bootsnipp.com))

## Getting started

### Basic usage

After downloading this plugin, include it in your HTML file after loading jQuery:

```html
<script src="jquery.js"></script>
<script src="jquery.searchable.js"></script>
```

**Note**: If you want to support older browsers like <IE9, you can use the `jquery.searchable-ie.js` instead of `jquery.searchable.js`. This version includes a polyfill for the `Array.prototype.reduce` function and is therefore slightly larger (a couple hundred bytes).

After that, you can simply initialize the plugin on the desired element. This example uses a table with an id of 'table'. By default, the plugin uses an input with an id of 'search' (read about how to change this in the Configuration section below):

```js
$( '#table' ).searchable();
```

### Configuration

This plugin provides the following configuration options:

| Option  | Default value  | Description  |
| :------ | :------------- | :----------- |
| selector | `'tbody tr'` | Defines the main selector within the element on which the plugin is initialized. This selects the 'rows' within the element. |
| childSelector | `'td'` | Defines the child selector within the 'selector' defined above. This selects the 'columns' within the 'selector' element. |
| searchField | `'#search'` | The input element that is used for the search input filter |
| striped | `false` | Defines whether the element is striped and should be re-striped upon searching (either `true` or `false`) |
| oddRow | `{ }` | Defines the CSS object to apply to the odd rows (when `striped` is set to `true`). |
| evenRow | `{ }` | Defines the CSS object to apply to the even rows (when `striped` is set to `true`). |
| hide | `function` | Allows you to define a custom hiding function. This function accepts one parameter, which is the element (row) being hidden. By default it will use `elem.hide()` to hide the row. |
| show | `function` | Allows you to define a custom show function. This function accepts one parameters, which is the element (row) being hidden. By default it will use `elem.show()` to show the row. |
| searchType | `'default'` | Defines the matcher to be used when searching. Allowed values are `'fuzzy'`, `'strict'` and `'default'`. |
| onSearchActive | `false` | Allows you to define a function to be called when the search is active. This function will be called whenever the user is typing into the search input and the search input is not empty. The searchable element and the search term will be passed to the function. |
| onSearchEmpty | `false` | Allows you to define a function to be called when the search input is empty. This function will be called once when the search input is empty or cleared. The searchable element will be passed to the function. |
| onSearchFocus | `false` | Allows you to define a function to be called when the search input is focussed. The `this` context of this function will be the search input element. |
| onSearchBlur | `false` | Allows you to define a function to be called when the search input is blurred. The `this` context of this function will be the search input element. |
| clearOnLoad | `false` | Determines whether the search input should be cleared on page load (either `true` or `false`). |

### Example usage

This example uses the configurations shown above to customize the plugin:

```js
$( '#element' ).searchable({
    selector      : '.row',
    childSelector : '.column',
    searchField   : '#mySearchInput',
    striped       : true,
    oddRow        : { 'background-color': '#f5f5f5' },
    evenRow       : { 'background-color': '#fff' },
    hide          : function( elem ) {
        elem.fadeOut(50);
    },
    show          : function( elem ) {
        elem.fadeIn(50);
    },
    searchType    : 'fuzzy',
    onSearchActive : function( elem, term ) {
        elem.show();
    },
    onSearchEmpty: function( elem ) {
        elem.hide();
    },
    onSearchFocus: function() {
        $( '#feedback' ).show().text( 'Type to search.' );
    },
    onSearchBlur: function() {
        $( '#feedback' ).hide();
    },
    clearOnLoad: true
});
```

## Changelog

**Version 1.0.0:**

- Initial release.

**Version 1.1.0:**

- Added some events that allow you to call custom functions during the search lifecycle: onSearchActive, onSearchEmpty, onSearchFocus, onSearchBlur (view the [configuration](#configuration) for more information).
- Added the `clearOnLoad` setting which allows you to clear the search input on page load / refresh.

## Contributing & Issues

Please feel free to submit any issues or pull requests, they are more then welcome. When submitting an issue, please specify the version number and describe the issue in detail so that it can be solved as soon as possible!

## License

Copyright (c) 2014 - Stidges - Licensed under [the MIT license](LICENSE).
