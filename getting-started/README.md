# Getting Started

Welcome to skapi, the serverless-based backend API service designed to simplify your application's security and database management. This guide will walk you through creating a service, importing the skapi library into your project, and connecting your application to the skapi server.

Follow these steps to get started with skapi:

## Creating a service

1. Register for an account at [skapi.com](https://www.skapi.com).
2. Log in and create a new service from your dashboard.

## Importing the skapi library

skapi is compatible with both HTML and webpack-based projects. Depending on your project type, you'll need to import the library either directly in the head tag (for HTML projects) or by installing it via npm (for webpack projects).

### For HTML projects

To import skapi into an HTML project, add the following script to the head tag of your HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
    ...
</head>
<body>
    ...
</body>
</html>
```

### For webpack projects

To use skapi in a webpack-based project (such as Vue, React, or Angular), first install skapi-js from npm:

```sh
$ npm install skapi-js
```

Then, import the library into your main JavaScript file:

```javascript
// main.js
import { Skapi } from 'skapi-js';
```

Next, you can begin integrating skapi into your application's logic.