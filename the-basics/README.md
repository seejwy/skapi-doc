# The Basics


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
  <script src="https://broadwayinc.dev/jslib/skapi/latest/skapi.js"></script>
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

## Working with promises

All skapi methods return a promise, which means that you need to resolve these methods in order to retrieve the desired data from the backend.

Here is an example:

``` js
let data = skapi.method1();
console.log(data) // Promise { <pending> }
```

When you run method1(), it returns a promise. To resolve the actual data that you are fetching, you can do the following:

``` js
skapi.method1().then(data => {
  console.log(data) // Your data!
})
```

Keep in mind that promises run synchronously, so you need to be careful when chaining multiple skapi methods. For example:

``` js
let my_data;
skapi.method1().then(data => {
  my_data = data;
});
skapi.method2().then(data => {
  my_data = my_data + data;
})
```

In the code above, we are trying to run method1 first, and then append the data to myData. After that, we run method2 to add more data. However, since JavaScript promises run synchronously (meaning they run at the same time), the above code will run both method1 and method2 immediately. The data will not be resolved in the order specified.

To ensure that the methods are run in the desired order, you can do the following:

``` js
let my_data;
skapi.method1().then(data => {
  my_data = data;
  skapi.method2().then(data => {
    my_data = my_data + data;
  })
});
```

Alternatively, you can wrap the process in an async function and use the await syntax:

``` js
async function run_in_order(){
  let my_data;
  let m1 = await skapi.method1();
  let m2 = await skapi.method2();
  my_data = m1 + m2;
}
run_in_order();
```

## Working with forms

skapi allows you to pass an HTML form SubmitEvent as an argument for methods that accept a form parameter. The input element names will be used as the parameter names for the method. You can also specify callback functions for the response and error in the second argument.

Here is an example of how to use a form with skapi:

``` html
<form onsubmit='skapi.login(event, { response: r => console.log(r), onerror: err => console.log(err) })'>
  <input name='email'>
  <input name='password'>
  <input type='submit' value='Login'>
</form>
```

This is equivalent to the following code:

``` html
  ...
  <input id='email'>
  <input id='password'>
  <button onclick='login()'>Login</button>
</body>
<script>
    async function login() {
      let params = {
        email: email.value,
        password: password.value
      }
      try{
        let response = await skapi.login(params);
        // login success!
        console.log(response);
      }
      catch(err) {
        console.log(err)
      }
    }
    ...
</script>
```

If you specify a URL in the action property of the form element, the user will be redirected to that page upon a successful request. On the new page, you can use the skapi.getFormResponse() method to retrieve the resolved data from the previous request. However, if you specify a response callback in the second argument, the form will not redirect to a new page.

(index.html)
``` html
<form onsubmit='skapi.login(event, { onerror: err => console.log(err) })' action='welcome.html'>
  <input name='email'>
  <input name='password'>
  <input type='submit' value='Login'>
</form>
```

(welcome.html)
``` html
<script>
  skapi.getFormResponse().then(r => {
    // Resolved data from skapi.login()
    console.log(r);
  });  
  ...
</script>
```