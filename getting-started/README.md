# Getting Started

Welcome to skapi, the serverless backend API service that simplifies your application's security and database management. This guide will walk you through importing the skapi library into your project, creating a service, and connecting your application to the skapi server.

Follow these steps to get started with skapi:

## Creating a service

1. Register for an account at [skapi.com](https://www.skapi.com).
2. Log in and create a new service from your dashboard.

## Initializing the skapi library

skapi is compatible with both vanilla and webpack-based projects. You need to import the library using the `<script>` tag or with npm.

### Using the script tag

To import skapi using the script tag, add the following script to the head tag of your HTML file:
```html
<script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
```

This is what it should look like
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
    <script>
        // Initialize skapi
        // Replace 'service_id' and 'owner_id' with the appropriate values from your skapi dashboard.
        const skapi = new Skapi('service_id', 'owner_id');
        ...
    </script>
</html>
```

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
::: warning NOTE
Don't forget to replace `service_id` and `owner_id` with the values provided in your skapi dashboard.
:::

### Calling an API

Now you can now use your initialized skapi object in your application.
The example below is calling the `getConnection()` method:

```js
const skapi = new Skapi('service_id', 'owner_id');
skapi.getConnection();
```

::: warning NOTE
You should only call `new Skapi()` once.
:::

### Optional parameters

The Skapi constructor accepts an optional options object as the third argument. Use this object to customize Skapi's behavior.

```javascript
const options = {
  autoLogin: false,
};

const skapi = new Skapi('service_id', 'owner_id', options);
```

- `options.autoLogin`:
  If set to `true` (default), skapi will automatically log the user in when they revisit the website.

## Obtaining Connection Information

After initializing the skapi object, you can retrieve information about the current connection by calling the `getConnection()` method. This method returns a promise that resolves with an object containing the following properties:

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
If you need a refresher on working with promises, [click here](/the-basics/#working-with-promises).