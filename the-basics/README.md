# The Basics

Learn how to connect to your service, work with promises, and interact with forms using skapi. This section will guide you through the essential components of using skapi in your application.

## Connecting to your service

After importing the skapi library, create a new Skapi instance by providing your `service_id` and `owner_id` as follows:

### For webpack projects

```javascript
// main.js
import { Skapi } from 'skapi-js';
// Replace 'service_id' and 'owner_id' with the appropriate values from your skapi dashboard.
const skapi = new Skapi('service_id', 'owner_id');
```

### For HTML projects

```html
<!DOCTYPE html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>
<body>
  <script>
    // Replace 'service_id' and 'owner_id' with the appropriate values from your skapi dashboard.
    const skapi = new Skapi('service_id', 'owner_id');
  </script>
  ...
</body>
</html>
```

::: warning NOTE
Don't forget to replace `service_id` and `owner_id` with the values provided in your skapi dashboard.
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
  If set to `true` (default), skapi will automatically log in the user when they revisit the website.

## Obtaining Connection Information

After initializing the skapi object, retrieve information about the current connection by calling the `getConnection()` method. This method returns a promise that resolves with an object containing the following properties:

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

## Working with promises

All skapi methods return a promise, which means you need to resolve these methods to retrieve the desired data from the backend.

For this example, we will use `skapi.mock()`, which calls your server and pings your data back to you.

Here's an example:

```javascript
const data = skapi.mock({ msg: 'Hello' });
console.log(data); // Promise { <pending> }
```

When you run `mock()`, it returns a promise. To resolve the actual data you're fetching, do the following:

```javascript
skapi
  .mock({ msg: 'Hello' })
  .then((data) => {
    console.log(data); // {msg: 'Hello'}
  });
```

Keep in mind that promises run synchronously, so you need to be careful when chaining multiple skapi methods. For example:

```javascript
let my_data = '';
skapi
  .mock({ msg: 'This is the first ping. ' })
  .then((data) => {
    my_data += data.msg;
  });
skapi
  .mock({ msg: 'This is the second ping.' })
  .then((data) => {
    my_data += data.msg;
  });
```

In the code above, we are trying to run first 'skapi.mock()', and then append the data to myData. After that, we run the second 'skapi.mock()' to add more data. However, since JavaScript promises run synchronously (meaning they run at the same time), the above code will run both 'skapi.mock()' immediately. The data will not always be resolved in the order specified.

To ensure that the methods are run in the desired order, you can do the following:

```javascript
let my_data = '';
skapi
  .mock({ msg: 'This is the first ping. ' })
  .then((data) => {
    my_data += data.msg;
    skapi
      .mock({ msg: 'This is the second ping.' })
      .then((data) => {
        my_data += data.msg; // 'This is the first ping. This is the second ping.'
      });
  });
```

Alternatively, you can wrap the process in an async function and use the await syntax:

```javascript
async function run_in_order() {
  let my_data = '';
  let m1 = await skapi.mock({ msg: 'This is the first ping. ' });
  let m2 = await skapi.mock({ msg: 'This is the second ping.' });
  my_data = m1.msg + m2.msg;
}
run_in_order();
```

## Working with forms

skapi allows you to pass an HTML form SubmitEvent as an argument for methods that accept a form parameter. The input element names will be used as the parameter names for the method. You can also specify callback functions for the response and error in the second argument.

Here is an example of how to use a form with skapi:

```html
<form onsubmit="skapi.mock(event, { response: (r) => console.log(r), onerror: (err) => console.log(err) })">
  <input name="name">
  <input name="msg">
  <input type="submit">
</form>
```

This is equivalent to the following code:

```html
...
<input id="name">
<input id="msg">
<button onclick="mock()">Mock</button>
</body>
<script>
  async function mock() {
    let name = document.getElementById("name");
    let msg = document.getElementById("msg");

    try {
      let r = await skapi.mock({ name: name.value, msg: msg.value });
      // login success!
      console.log(r);
    } catch (err) {
      console.log(err);
    }
  }
  ...
</script>
```

If you specify a URL in the action property of the form element, the user will be redirected to that page upon a successful request. On the new page, you can use the skapi.getFormResponse() method to retrieve the resolved data from the previous request. However, if you specify a response callback in the second argument, the form will not redirect to a new page.

(index.html)
```html
...
<form onsubmit="skapi.mock(event, { onerror: (err) => console.log(err) })" action="welcome.html">
  <input name="name">
  <input name="msg">
  <input type="submit">
</form>
```

(welcome.html)
```html
<!DOCTYPE html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/skapi-js@latest/dist/skapi.js"></script>
</head>
<body>
  <script>
    // Replace 'service_id' and 'owner_id' with the appropriate values from your skapi dashboard.
    const skapi = new Skapi('service_id', 'owner_id');
    skapi
      .getFormResponse()
      .then((r) => {
        // Resolved data from skapi.mock()
        console.log(r);
      });
  </script>
  ...
</body>
</html>
```

By using the `skapi.getFormResponse()` method on the new page, you can access the resolved data from the previous request made using the `skapi.mock()` method.

Remember that if you provide a response callback in the second argument when calling `skapi.mock()`, the form will not redirect to a new page even if an action URL is specified. Instead, the response callback will be executed upon a successful request.

In summary, skapi provides a simple and efficient way to interact with your services. By understanding how to connect to your service, work with promises, and interact with forms, you can integrate skapi into your applications and improve their overall functionality.
