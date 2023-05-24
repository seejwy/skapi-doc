# Authentication

Methods related to authentication.

## Creating an Account

### [`signup(params, options?): Promise<User | string>`](/api-reference/user/#signup)

To create a new account (user) in your service, you can use the `signup()` method. Users will appear in your service's list of users after they have logged in for the first time.

### Example: Creating an Account
Here's an example of how to use `signup()`:

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
let parameters = {
  email: "user@email.com",
  password: "password", // Password must be between 6 and 60 characters.
  name: "User's name"
};

let options = {
  login: true // If set to true, users will be automatically logged in on signup.
};

skapi.signup(parameters, options)
  .then(res => console.log({res}))
  .catch(err => console.log({err}));
```

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.signup(event, 
    { 
        login: true, 
        response: (res) => {console.log({res})}, // response runs on successful signup
        onerror: err => console.log({err}) // onerror runs when signup fails 
    })">
    <input type="email" name="email" placeholder="E-Mail" required>
    <br>
    <input id="password" type="password" name="password" placeholder="Password" required>
    <br>
    <input id="confirm_password" type="password" placeholder="Confirm Password" required>
    <br>
    <input name="name" placeholder="Your name">
    <br>
    <input type="submit" value="Create Account">
</form>
```

The `signup()` method accepts `SubmitEvent` as its parameter. See [Working with forms](/the-basics/#working-with-forms) for more information.

</template>
</CodeSwitcher>

### Additional Parameters (Optional)

- `options`(Type: `Object`, optional):
  - `login`(`boolean`): If `true`, the user will be automatically logged in to the service upon successful signup. (default: `true`)
  - `signup_confirmation`(`boolean`): If `true` users must verify their email before they can login. (default: `false`). See [Signup Confirmation](/authentication/#signup-confirmation)

See [full list of parameters](/api-reference/user/#signup)

::: warning NOTE
If the user fails to confirm within a day, their signup will be invalidated, and they will need to sign up again. 
:::
::: warning NOTE
You should always use the `signup_confirmation` option to prevent automated signup by bots.
:::

## Signup Confirmation

### [`resendSignupConfirmation(redirect?): Promise<string>`](/api-reference/user/#resendSignupConfirmation)

When an account is created with `signup_confirmation` set to `true`, users must verify their email before logging into your service. If you need to resend the confirmation email, use the `resendSignupConfirmation()` method. 

### Example: Resending Signup Confirmation Email

```js
// user tries to login
try {
  let user = await skapi.login({email: 'user@email.com', password: 'password'});
} catch(err) {
  /**
   * {
   *  code: 'SIGNUP_CONFIRMATION_NEEDED',
   *  message: "User's signup confirmation is required.",
   *  name: 'SkapiError'
   * }
   */
  
  if(err.code === 'SIGNUP_CONFIRMATION_NEEDED') {
    // now you can resend signup confirmation E-Mail to user@email.com.
    let redirectUrl = "/redirect/on/success"
    await skapi.resendSignupConfirmation(redirectUrl);
  }

  else
    throw err;
}
```

In this example, when a user tries to log in and receives a `SIGNUP_CONFIRMATION_NEEDED` error, you can use the `resendSignupConfirmation()` method to resend the confirmation email to the user's email address. Provide a `redirectUrl` parameter to specify the URL to redirect the user after successful confirmation.

::: warning Note
To resend signup confirmation emails, users must have at least one login or signup attempt to the service.
:::

## Login

### [`login(params, options?): Promise<User>`](/api-reference/user/#login)

Use the `login()` method to log a user into your service.
If `signup_confirmation` was set to `true` during signup,
users will not be able to log in until they have confirmed their account.

### Example: Logging in a User

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
let parameters = {
  email: 'user@email.com',
  password: 'password'
}

skapi.login(parameters)
  .then(res => console.log({res}))
  .catch(err => console.log({err}));
```

In this example, the `login()` method is used to log in a user with the specified email and password. The response will contain the user information upon successful login.

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.login(event, 
    { 
        response: (res) => {console.log({res})}, // response runs on successful signup
        onerror: err => console.log({err}) // onerror runs when signup fails 
    })">
    <input type="email" name="email" placeholder="E-Mail" required>
    <br>
    <input id="password" type="password" name="password" placeholder="Password" required>
    <br>
    <input type="submit" value="Login">
</form>
```

This example demonstrates a login form that uses the `login()` method to handle the form submission. The `response` callback will return the user information upon successful login.

</template>
</CodeSwitcher>

## User's Profile

### [`getProfile(options?): Promise<User | null>`](/api-reference/user/#getprofile)

The `getProfile()` method allows you to retrieve the profile of a user that is logged in. It returns the [User's Profile](/api-reference/data-types/#user-profile) object.
If a user is not logged in, `getProfile()` returns `null`.

### Example: Retrieving User's Profile

```js
skapi.getProfile().then(profile=>{
  console.log(profile);
})
```
## Logout

### [`logout(): Promise<string>`](/api-reference/user/#logout)

The `logout()` method logs the user out from the service.

### Example: Logging Out

```js
skapi.logout();
```

### Return
```ts
'SUCCESS: The user has been logged out.'
```

## Forgot password

### [`forgotPassword(params, options?): Promise<string>`](/api-reference/user/#forgotpassword)

### [`resetPassword(params, options?): Promise<string>`](/api-reference/user/#resetpassword)

To reset a forgotten password, you can use the following methods:

### Step 1: Request Verification Code

Use the `forgotPassword()` method to request a verification code.

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
skapi.forgotPassword({email: 'someone@gmail.com'});
// User receives an e-mail with a verification code.
```

In this example, the `forgotPassword()` method is called with the user's email as a parameter. The user will receive an email containing a verification code that they can use to reset their password.

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.forgotPassword(event, 
    { 
        response: (res) => {console.log({res})}, // response runs on successful signup
        onerror: err => console.log({err}) // onerror runs when signup fails 
    })">
    <input type="email" name="email" placeholder="E-Mail" required>
    <br>
    <input type="submit" value="Request Verification Code">
</form>
```

In this example, a form is used to submit the email address. When the form is submitted, the `forgotPassword()` method is called with the email parameter.

</template>
</CodeSwitcher>

### Step 2: Reset Password

The user will receive an email containing a verification code. After the user receives the verification code, they can use the `resetPassword()` method to reset their password.

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

In this example, the `resetPassword()` method is called with the user's email, the verification code received via email, and the new password. Upon successful password reset, the user's account password will be set to the new password provided.

```js
skapi.resetPassword({
  email: 'someone@gmail.com', 
  code: '123456', // code sent to user's registered email address
  new_password: 'new_password' // The password should be at least 6 characters and 60 characters maximum.
}).then(() => {
  // new password is set
});
```
</template>
<template v-slot:form>

In this example, a form is used to submit the email, verification code, and new password. When the form is submitted, the `resetPassword()` method is called with the corresponding parameters.

```html
<form onsubmit="skapi.resetPassword(event, 
    { 
        response: (res) => {console.log({res})}, // response runs on successful signup
        onerror: err => console.log({err}) // onerror runs when signup fails 
    })">
    <input type="email" name="email" placeholder="E-Mail" required>
    <br>
    <input type="text" name="code" placeholder="Verification Code" required>
    <br>
    <input type="password" name="new_password" placeholder="New Password" required>
    <br>
    <input type="submit" placeholder="Confirm Password" value="Change Password">
</form>
```

</template>
</CodeSwitcher>

:::danger WARNING
If a user's email is not verified, they will not be able to receive a verification code and may lose access to their account permanently. 

It is highly recommended to encourage users to verify their email addresses.
:::