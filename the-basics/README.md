# The Basics


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