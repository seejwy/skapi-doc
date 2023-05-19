# The Basics

Learn how to work with promises, and interact with forms using skapi. This section will guide you through the essentials of using skapi in your application.

## Working with promises

All skapi methods return a `Promise`. That means you need to resolve these methods to retrieve the data from the backend.

For this example, we will use a mock method, `skapi.mock()`, which calls your server and returns the function argument back to you.

Here's an example:

```javascript
const data = skapi.mock({ msg: 'Hello' });
console.log(data); // Promise { <pending> }
```

The `mock()` method returns a `Promise`. To see the data you are trying to fetch, you need to wait for the promise to resolve.

Here is an example demonstrating how you can resolve a promise using `then`.

```javascript
skapi
  .mock({ msg: 'Hello' })
  .then((data) => {
    console.log(data); // {msg: 'Hello'}
  });
```

:::tip Note
You could also resolve a promise using async/await.
:::

Keep in mind that promises run synchronously, so you need to be careful when chaining multiple skapi methods. For example:

```javascript
let my_data = 'Result: ';
skapi
  .mock({ msg: 'This is the first ping. ' })
  .then((data) => {
    console.log("This runs first");
    my_data += data.msg;
  });
skapi
  .mock({ msg: 'This is the second ping.' })
  .then((data) => {
    console.log("This runs second");
    my_data += data.msg;
  });
  
  console.log(my_data);

  // 
```
**Result**
```js
Result:
This runs second
This runs first
```


In the example above, we run `mock()` twice in succession. We are waiting for the promise to resolve with `then` and adding the response into `my_data`. However, since JavaScript promises run synchronously (meaning each statement is executed one after another in a sequential manner), the second call to `mock()` will execute before `then` for the first `mock()` executes. The data will not always be resolved in the order specified. `my_data` also does not have any of the content from the `then` blocks because it is logged right after calling the two `mock()` methods. That is also why `my_data` is printed first.

To ensure that the methods are run in the desired order, you can nest your calls in the `then` blocks. For example:

```javascript
let my_data = 'Result: ';
skapi
  .mock({ msg: 'This is the first ping. ' })
  .then((data) => {
    console.log("This runs first");
    my_data += data.msg;
    skapi
      .mock({ msg: 'This is the second ping.' })
      .then((data) => {
        console.log("This runs second");
        my_data += data.msg; // 'This is the first ping. This is the second ping.'
      });
  });
```
**Result**
```js
This runs first
This runs second
Result: This is the first ping. This is the second ping.
```

Alternatively, you can use the `async/await` to resolve your promises. To do so, you can wrap the process in an `async` function and use the `await` syntax:

```javascript
async function run_in_order() {
  let my_data = 'Result: ';
  let m1 = await skapi.mock({ msg: 'This is the first ping. ' });
  let m2 = await skapi.mock({ msg: 'This is the second ping.' });
  my_data = m1.msg + m2.msg;
}
run_in_order();
```
**Result**
```js
Result: This is the first ping. This is the second ping.
```

:::warning Note
 The `Promise` represents the eventual completion or failure of that operation, and it allows you to handle the result or error once it becomes available.
 :::

## Working with forms

skapi allows you to pass an HTML form `SubmitEvent` as an argument for methods that accept `SubmitEvent` in the parameter. The input element `name` attribute will be used as the parameter names for the method. 

You can also specify callback functions using `response` and `onerror` to handle the response and error in the second argument.

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

If you specify a URL in the `action` of the form element, the user will be redirected to that page upon a successful request. On the new page, you can use the `skapi.getFormResponse()` method to retrieve the resolved data from the previous request. However, if you specify a `response` callback in the second argument, the form will not redirect to a new page.

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
