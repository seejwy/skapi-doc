# The Basics

**skapi** class methods provides everything you need to operate your web service.\
Execute class methods with approporiate arguments guided in the documentations.

Before we jump in to the features of skapi,
I'd like to show you how the documentation will be written so we will not get confused.

## Reading the Doc
Let's look at the example below.

``` js
// example
let params = {
    A: 'some_data',
    B: true,
    C: 1,
}
let options = {
    A: ['A','B','C'],
    B: [0, true]
}
window.skapi.method(params, options);
```

The code above is running a **method** called `method`.\
The method named `method` takes two **arguments** which is `params` and `options`.\
Of course, the method named `method` does not actually exists in **skapi**.\
This is just a demonstration to guide how the data types are documented.

The example code above will be documented as below:

### `skapi.method(params, options?)`

This is a documentation example for method called `method`.

- **`params: {}`**

  The params takes `object` as an argument.

  - `A: string`

    Parameter named "A" takes a `string` typed data.
  - `B: boolean`

    Parameter named "B" takes `boolean` typed data.
  - `C?: number | string`

    Optional parameter named "C" takes `number` or `string` typed data.

- **`options?: {} | null`**

  The options is optional.
  options takes `object` or `null` as an argument.

  - `A: Array<string>`

    Parameter named "A" takes a array of `string` typed data.
  - `B?: Array<number | boolean>`

    Optional parameter named "B" takes array `boolean` or `number` typed data.

- **Returns**
  
  Returns an `object` with property "a" as `string` and "b" as `number`
  ``` ts
  {
    a:string;
    b:number;
  }
  ```

## Working with forms

If the method argument type accepts `form` you can pass vanilla HTML forms as an argument.\
**skapi** takes each input element name as a parameter name.

``` html
<body>
  <form onsubmit='skapi.login(this)' onerror='loginFailed(event)' action='/welcome'>
    <input name='email'>
    <input name='password'>
    <input type='submit'>
  </form>
</body>
<script>
    let skapi = new Skapi('your_service_id', 'your_user_id');
    function loginFailed(err) {
      // executes when failed
      console.log(err);
    }
</script>
```

... is equivelant as

``` html
<body>
    <input id='email'>
    <input id='password'>
    <button onclick='submit()'>Submit</button>
</body>
<script>
    let skapi = new Skapi('your_service_id', 'your_user_id');

    async function submit(){
      let params = {
        email: email.value,
        password: password.value
      }
      try{
        let user = await skapi.login(params);
        // login success!
        console.log(user);
      }
      catch(err) {
        // failed
      }
    }
</script>
```

## Working with promises

All the skapi methods returns a promise.
Which means all the skapi methods needs to be resolved to get the actual data you want to fetch from the backend.

Let's look at the example code below:

``` js
let data = skapi.method1();
console.log(data) // Promise { <pending> }
```

When you run `method1()` it returns you a promise.\
To resolve an actual data you are fetching you must do:

``` js
skapi.method1().then(data=>{
  console.log(data) // Your data!
  // Do what you want with your data!
})
```

Since promises runs syncronously, Some times you need to be careful.

``` js
let my_data;
skapi.method1().then(data=>{
  my_data = data;
});
skapi.method2().then(data=>{
  my_data = my_data + data;
})
```

Here, we are trying to run `method1` first, and append the data to `my_data`.\
Then run `method2` to add more data after that.\
But since Javascript promises run syncronously (meaning runs at the same time),\
The methods above will run at the same time.\
The `method2` will not wait for `method1` to be resolved and both methods will execute immediatley.
The data will not be resolved in the order above.\
Because it is not always certain which data will be resolved first.

``` js
let my_data;
skapi.method1().then(data=>{
  my_data = data;
  skapi.method2().then(data=>{
    my_data = my_data + data;
  })
});
```

You can do it this way


``` js
async function run_in_order(){
  let my_data;
  let m1 = await skapi.method1();
  let m2 = await skapi.method2();
  my_data = m1 + m2;
}
run_in_order();
```

You can wrap all the process in async function and use await syntax.