# Getting Started

To get started with skapi, you'll need to create a service and import the skapi library in your project code. Once you've done this, you can connect your application to the skapi server to handle your customer security and database requests.

Here are the steps to get started with skapi:


## Creating a service

1. Create your account in [skapi](https://skapi.com)
2. Create a new service.


## Importing the skapi library

skapi works with both HTML and webpack-based projects. To use skapi in your project, you'll need to import the library either directly in the head tag (for HTML projects) or by installing it via npm (for webpack projects).

### For HTML projects

To import skapi in an HTML project, add the following script to the head tag of your html file:

``` html
<script src="https://broadwayinc.dev/jslib/skapi/0.0.62/skapi.js"></script>
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


## Connecting to your service

Once you have imported the skapi library, you can create a new Skapi instance by providing your 'service_id' and 'owner_id' as follows:

### For webpack projects
``` js
// main.js
import {Skapi} from 'skapi-js';
let skapi = new Skapi('service_id', 'owner_id')
```

### For HTML projects
``` html
<!DOCTYPE html>
<head>
  <script src="https://broadwayinc.dev/jslib/skapi/0.0.62/skapi.js"></script>
</head>
<script>
  let skapi = new Skapi('service_id', 'owner_id');
</script>
```

::: warning NOTE
Be sure to replace 'service_id' and 'owner_id' with the appropriate values that are provided in your skapi dashboard.
:::

### Optional parameters
The Skapi constructor accepts an optional options object as the third argument. This object can be used to customize the behavior of Skapi.

```js
let options = {
  autoLogin: false
}

let skapi = new Skapi('service_id', 'owner_id', options)
```

- options.autoLogin:
  If set to true, skapi will automatically login the user when the website is revisited.
  

## Obtaining Connection Information

After initializing the skapi object, you can retrieve information about the current connection by calling the getConnection() method. This method returns a promise that resolves with an object containing the following properties:

``` ts
{
  email: string; // The e-mail address of the service owner.
  ip: string; // The IP address of the current connection.
  locale: string; // The current locale of the connection.
  owner: string; // The user ID of the service owner.
  region: string; // The region where the service resource is located.
  service: string; // The service ID.
  timestamp: number; // The timestamp of the service creation.
}
```

Here's an example of how to use getConnection():
``` js
skapi.getConnection()
  .then(c => {
    // connection success
    console.log(c);
  })
  .catch(err => {
    // connection failed
    console.log(err);
    throw err;
  })
```

