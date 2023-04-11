# Getting Started

To get started with skapi, you'll need to create a service and import the skapi library in your project code. Once you've done this, you can connect your application to the skapi server to handle your customer security and database requests.

Here are the steps to get started with skapi:


## Creating a service

1. Create your account in [skapi](https://www.skapi.com/signup)
2. Create a new service from your dashboard.


## Importing the skapi library

skapi works with both HTML and webpack-based projects. To use skapi in your project, you'll need to import the library either directly in the head tag (for HTML projects) or by installing it via npm (for webpack projects).

### For HTML projects

To import skapi in an HTML project, add the following script to the head tag of your html file:

``` html
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
```

### For webpack projects

To use skapi in a webpack-based project (such as Vue, React, or Angular), install skapi-js from npm:

```
$ npm i skapi-js
```

Then, import the library in your main file:

``` js
// main.js
import {Skapi} from 'skapi-js';
```