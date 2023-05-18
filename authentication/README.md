# Authentication

Methods related to authentication.

## Creating an Account

### `signup(params, options?): Promise<User | string>` [api&nbsp;reference](/api-reference/user/#signup)

To create a new account (user) in your service, you can use the `signup()` method.

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
  signup_confirmation: true // If set to true, users must confirm their email to complete signup.
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
        signup_confirmation: true, 
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

</template>
</CodeSwitcher>

The `signup` accepts `SubmitEvent` as its parameter. See [Working with forms](/the-basics/#working-with-forms) for more information.

::: warning NOTE
If the user fails to confirm within a day, their signup will be invalidated, and they will need to sign up again. 
:::
::: warning NOTE
You should always use the `signup_confirmation` option to prevent automated signup by bots.
:::

## Signup Confirmation

When an account is created with `options.signup_confirmation` set to `true`, users must verify their email before logging into your service. If you need to resend the confirmation email, use the `resendSignupConfirmation()` method. 

### Example: Resending Signup Confirmation Email

```js
// user tries to login
try {
  let user = await skapi.login('user@email.com', 'password');
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

### redirectUrl (optional)
When a URL string is provided as an argument, users will be redirected to the URL when they click on the confirmation email link.

### Return
```ts
'SUCCESS: Signup confirmation E-Mail has been sent.'
```

### Errors
```ts
{
  code: 'INVALID_REQUEST',
  message: 'Least one login attempt is required.' | '"Url" is an invalid url.'
}
```

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

This example demonstrates a login form that uses the `login()` method to handle the form submission. The `response` callback function is executed upon successful login, and the `onerror` callback function is executed if the login fails.

</template>
</CodeSwitcher>

## User's Profile

### [`getProfile(): Promise<User | null>`](/api-reference/user/#getProfile)

The `getProfile(?)` method allows you to retrieve the user's profile once they have been logged in. It returns the [User's Profile](/data-types/#user-profile) object.
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

### [`forgotPassword(params, options?): Promise<string>`](/api-reference/user/#forgotPassword)

### [`resetPassword(params, options?): Promise<string>`](/api-reference/user/#resetPassword)

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
    <input type="text" name="code" required>
    <br>
    <input type="password" name="new_password" required>
    <br>
    <input type="submit" value="Change Password">
</form>
```

</template>
</CodeSwitcher>

::: warning WARNING
If a user's email is not verified, they will not be able to receive a verification code and may lose access to their account permanently. 

It is highly recommended to encourage users to verify their email addresses.
:::

## Recovering a Disabled Account

### [`recoverAccount(redirect: boolean | string): Promise<string>`](/api-reference/user/#recoverAccount)

Disabled accounts can be reactivated within 3 months using the `recoverAccount()` method. This method allows users to reactivate their disabled accounts under the following conditions:

- The account email must be verified.
- The recoverAccount() method must be called from the catch block of a failed login attempt using the disabled account.
 
 :::danger
**If the account is unverified, it cannot be recovered**.
 :::

The `recoverAccount()` method sends an email to the account owner, containing a confirmation link for account recovery. Additionally, you can provide an optional URL `string` argument to the `recoverAccount()` method, which will redirect the user to the specified URL upon successful account recovery.

### Example: Recovering a Disabled Account

Here's an example demonstrating how to use the recoverAccount() method:

```js
try {
  await skapi.signin('user@email.com','password'); // user attempt to login
} catch(failed) {
  console.log(failed.message); // This account is disabled.
  console.log(failed.code); // USER_IS_DISABLED
  if(failed.code === 'USER_IS_DISABLED') {
    // Send a recovery email to the user with a link.
    // When the user click on the link, the user will be redirected when account recovery is successful.
    await skapi.recoverAccount("http://mywebsite.com/welcome-back");
  }
}
```

In the example above, the `recoverAccount()` method is called from the catch block of a failed login attempt using a disabled account. If the login attempt fails with the error code "USER_IS_DISABLED," the `recoverAccount()` method is called to send a recovery email to the user. The recovery email contains a link, and when the user clicks on the link, they will be redirected to the specified URL ("http://mywebsite.com/welcome-back") upon successful account recovery.