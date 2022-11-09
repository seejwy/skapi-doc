# Getting Started

When you are building your application (website, app... etc),
you need a backend **service** to handle your customers security and network requests.

To get started, first thing we need to do is to create a service, and import skapi in your project code.

## Creating a service

1. Create your account in [skapi](https://skapi.com)
2. Create a new service.
   
## Importing skapi

skapi works well on both HTML and webpack based projects.<br>
If you are working on vanilla HTML project, You can import skapi directly from your headers tag.<br>
For webpack based projects (Vue, React, Angular...etc), you can install skapi-js from npm.<br>

### For vanilla HTML

If you are working on vanila HTML, Import the script from your head tag in your `index.html`.
``` html
<html>
  <head>
    <script src="https://skapi.com/lib/skapi.js">
  </head>
</html>
```

### For webpack projects

If you are working on webpack projects(Vue, React, Angular...etc), install skapi-js from npm.
```
$ npm i skapi-js
```
... then on your main file import.
``` js
// main.js
import {Skapi} from 'skapi-js';
```

## Connecting to your service

Now to make use of your service in your application, we need to connect your application to your backend **service**.

1. Get your service ID and owners ID from your dashboard.
2. Establish your **service** connection by initializing the skapi class.

### For vanilla HTML

If you are working on vanila HTML, Add `<script>` tag below your `<head>` tag.

``` html
<html>
  <head>
    <script src="https://skapi.com/lib/skapi.js"></script>
  </head>
  <script>
    const skapi = new Skapi('your_service_id', 'your_user_id');
  </script>
</html>
```

### For webpack projects
For webpack users, Initialize skapi right below your import.
``` js
// main.js
import {Skapi} from 'skapi-js';
const skapi = new Skapi('your_service_id', 'your_user_id');
```

You only need to initialize `skapi` once in web site.

Now you can execute your service methods by running `window.skapi[method_name](*arg)` from anywhere in your project.