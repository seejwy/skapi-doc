---
home: false
---
# Getting Started

Welcome to skapi, the serverless backend API service that simplifies your application's security and database management. This guide will walk you through importing the skapi library into your project, creating a service, and connecting your application to the skapi server.

Follow these steps to get started with skapi:

## Creating a service

1. Register for an account at [skapi.com](https://www.skapi.com/signup).
2. Log in and create a new service from your [admin page](https://www.skapi.com/admin).

![How to create a service](/images/guide.gif)


## Initializing the skapi library

skapi is compatible with both vanilla and webpack-based projects. You need to import the library using the `<script>` tag or with npm.

### Using the script tag

To import skapi using the script tag, add the following script to the head tag of your HTML file:
```html
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
```

This is what your starter code should look like:
```html
<!DOCTYPE html>
<head>
    <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>
<body>
  <!-- Your content goes here -->
</body>
<script>
    // Initialize skapi
    // Replace 'service_id' and 'owner_id' with the values from your skapi dashboard.
    const skapi = new Skapi('service_id', 'owner_id');
    ...
</script>
```

The `Skapi` constructor accepts a third argument which is `{autologin: true}`. If `autologin` is `true`, it keeps users logged in until `logout()` is called.

### Using NPM and build tools such as webpack

To use skapi in a webpack-based project (such as Vue, React, or Angular), first install skapi-js using npm:

```sh
$ npm install skapi-js
```

Then, import the library into your main JavaScript file:

```javascript
// main.js
import { Skapi } from 'skapi-js'; // imports the library

// Initialize Skapi
// Replace 'service_id' and 'owner_id' with your service's values found in your skapi dashboard.
const skapi = new Skapi('service_id', 'owner_id');

```
![Get your owner's ID and service ID](/images/service.jpg)
::: warning NOTE
Don't forget to replace `service_id` and `owner_id` with the values provided in your skapi dashboard.
:::

### Calling an API

Now you can now use your initialized skapi object in your application.
The example below is calling the `getConnection()` method:

```js
// First, instantiate the skapi object
const skapi = new Skapi('service_id', 'owner_id');

// You can now call any skapi methods. Example, getConnection()
skapi.getConnection();
```

::: warning NOTE
You should only instantiate `skapi` once.
:::

### Auto Login

The Skapi constructor accepts an optional options object as the third argument.

```javascript
const options = {
  autoLogin: false, // set to false to prevent autologin
};

const skapi = new Skapi('service_id', 'owner_id', options);
```
By default, users will remain logged in when they revisit the website. You can set `autoLogin` to `false` to prevent that.

## Obtaining Connection Information

After initializing the skapi object, you can retrieve information about the current connection by calling the `getConnection()` method. This method returns a `promise` that resolves with an object containing the following properties:

```typescript
{
  email: string; // The email address of the service owner.
  ip: string; // The IP address of the current connection.
  locale: string; // The current locale of the connection.
  owner: string; // The user ID of the service owner.
  region: string; // The region where the service resource is located.
  service: string; // The service ID.
  timestamp: number; // The timestamp of the service creation.
}
```

Here's an example of how to use `getConnection()`:

```javascript
skapi
  .getConnection()
  .then((c) => {
    // Connection successful
    console.log(c);
  })
  .catch((err) => {
    // Connection failed
    console.log(err);
    throw err;
  });
```
If you need a refresher on working with promises, read [Working with Promises](/the-basics/#working-with-promises).