# The Basics

Learn how to work with promises, and interact with forms using skapi. This section will guide you through the essentials of using skapi in your application.

## Working with promises

All skapi methods return a `Promise`. That means you need to resolve these methods to retrieve the data from the backend.

For this example, we will use a `mock()` method within the `skapi` object, which calls your server and returns the function argument back to you.

Here's an example:

```javascript
const data = skapi.mock({ msg: 'Hello' });
console.log(data); // Promise { <pending> }
```

The `mock()` method returns a `Promise`. To see the data you are trying to fetch, you need to wait for the promise to resolve.

Here is an example demonstrating how you can resolve a promise using `then()`.

```javascript
skapi.mock({ msg: 'Hello' }).then((data) => {
    console.log(data); // {msg: 'Hello'}
});
```


Keep in mind that promises run synchronously, so you need to be careful when chaining multiple skapi methods. For example:

```javascript
skapi.mock({ msg: 'This is the first ping. ' }).then((data) => {
    console.log(data.msg);
});

skapi.mock({ msg: 'This is the second ping. ' }).then((data) => {
    console.log(data.msg);
});
```
**Result**
```js
This is the second ping.
This is the first ping.
```

In the code above, we are trying to run first `skapi.mock()`, and then append the data to myData. After that, we run the second 'skapi.mock()' to add more data. However, since JavaScript promises run synchronously (meaning they run at the same time), the above code will run both 'skapi.mock()' immediately. The data will not always be resolved in the order specified.

To ensure that your code gets resolved in desired order, you can nest your calls in the `then()` blocks.

For example:

```javascript
let my_data = 'Result: ';
skapi
  .mock({ msg: 'This is the first ping.' })
  .then((data) => {
    console.log(data.msg);

    skapi
      .mock({ msg: 'This is the second ping.' })
      .then((data) => {
        console.log(data.msg);
      });
  });
```
**Result**
```js
This is the first ping. 
This is the second ping.
```

Alternatively, you can use the `async/await` to resolve your promises in order.

To do so, you can wrap the process in an `async` function and use the `await` syntax:

```javascript
async function run_in_order() {
  let m1 = await skapi.mock({ msg: 'This is the first ping. ' });
  console.log(m1.msg);
  let m2 = await skapi.mock({ msg: 'This is the second ping.' });
  console.log(m2.msg);
}
run_in_order();
```

**Result**
```js
This is the first ping.
This is the second ping.
```

## Working with forms

skapi allows you to pass an HTML form `SubmitEvent` as an argument for methods that accept `SubmitEvent` in the parameter. The input element `name` attribute will be used as the parameter names for the method. 

You can also specify callback functions using `response` and `onerror` to handle the response and error in the second argument.

Here is an example of how to use a form with skapi:

```html
<form onsubmit="skapi.mock(event, { response: (r) => console.log(r), onerror: (err) => alert(err.message) })">
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
<script>
  async function mock() {
    let name = document.getElementById("name");
    let msg = document.getElementById("msg");

    try {
      let r = await skapi.mock({ name: name.value, msg: msg.value });
      // login success!
      console.log(r);
    } catch (err) {
      alert(err.message);
    }
  }
  ...
</script>
```

If you specify a URL in the `action` of the form element, the user will be redirected to that page upon a successful request. On the new page, you can use the `skapi.getFormResponse()` method to retrieve the resolved data from the previous request. However, if you specify a `response` callback in the second argument, the form will not redirect to a new page.

Example below shows how users can submit a form in `index.html`, then fetch the resolved data from a new redirected page `welcome.html`.

(index.html)
```html
...
<form onsubmit="skapi.mock(event, { onerror: (err) => alert(err.message) })" action="welcome.html">
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
  ...
</body>
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
</html>
```

By using the `skapi.getFormResponse()` method on the new page, you can access the resolved data from the previous request made using the `skapi.mock()` method.

In summary, skapi provides a simple and efficient way to interact with your services. By understanding how to connect to your service, work with promises, and interact with forms, you can integrate skapi into your applications and improve their overall functionality.
