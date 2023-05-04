# Authentication

Methods related to authentication.

## Creating an Account

To create a new account(user) in your service, you can use the `signup()` method. This method accepts some mandatory parameters as well as some optional options.

Here's an example of how to use `signup(params, options?)`:

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

### parameters

``` ts
type parameters = {
  email: string; // The email address to use for the account. The email should be at least 5 characters and a maximum of 64 characters.
  password: string; // The password to use for the account. The password should be at least 6 characters and a maximum of 60 characters.
  name?: string; // The user's name to be used in their login profile.
  email_public?: boolean; // Set to true to make the email address visible to others.
  phone_number?: string; // The user's phone number. The format should be "+0012341234". This will not be visible to others unless the phone_number_public option is set to true.
  phone_number_public?: boolean; // Set to true to make the phone number visible to others.
  address?: string; // The user's address to be used in their login profile. This will not be visible to others unless the address_public option is set to true.
  address_public?: boolean; // Set to true to make the address visible to others.
  birthdate?: string; // The user's birthdate to be used in their login profile. The format should be "YYYY-MM-DD". This will not be visible to others unless the birthdate_public option is set to true.
  birthdate_public?: boolean; // Set to true to make the birthdate visible to others.
  gender?: string; // The user's gender to be used in their login profile. Can be "female" or "male". Other values can be used if neither of these are applicable. This will not be visible to others unless the gender_public option is set to true.
  gender_public?: boolean; // Set to true to make the gender visible to others.
};
```
`signup` accepts `SubmitEvent` as its parameter. See [Working with forms](/the-basics/#working-with-forms) for more information.

### options (Optional)

```ts
type options = {
  signup_confirmation?: boolean | string;
  email_subscription?: boolean;
  login?: boolean;
  response?(response: any): any; // A callback function to be called upon success.
  onerror?(error: Error): any; // A callback function to be called on error.
};
```

- signup_confirmation:
  - If `true`, the user will receive an email containing a confirmation link to verify their email. Clicking the link will confirm their signup, and allow them access to your service.
  - You can specify a URL `string` to redirect the user to when they click the confirmation link. 
::: warning NOTE
If the user fails to confirm within a day, their signup will be invalidated, and they will need to sign up again. 
:::
::: warning NOTE
You should always use this option to prevent automated signup by bots
:::

- login:
  - If `true`, the user will be automatically logged in to the service upon successful signup.
  - Will not work with `options.signup_confirmation`
- email_subscription:
  - If `true`, the user will be subscribed to service newsletters when the account is created.
  - Must be used with `options.signup_confirmation`

### Return

Returns a [User Profile](/data-types/#user-profile) object when `options.login` is `true`.

If `options.login` is not set or is set to `false`, the method returns one of the following message strings:
- "SUCCESS: The account has been created. User's signup confirmation is required."
- "SUCCESS: The account has been created."

### Errors
```ts
{
  code: 'EXISTS';
  message: "User's signup confirmation is required.";
  name: 'SkapiError';
}
```

## Signup Confirmation

When an account is created with `options.signup_confirmation` set to `true`, users must verify their email before logging into your service. If you need to resend the confirmation email, use the `resendSignupConfirmation()` method. 
::: warning Note
To resend signup confirmation emails, users must have at least one login or signup attempt to the service.
:::
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

Use the `login()` method to log a user into your service.
If `signup_confirmation` was set to `true` in signup,
users will not be able to log in until they have confirmed their account.

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

</template>
</CodeSwitcher>

### parameters

```ts
type parameters = {
  email:string; // User's login E-Mail.
  password:string; // User's login password.
}
```
`login` accepts `SubmitEvent` as its parameter. See [Working with forms](/the-basics/#working-with-forms) for more information.

### Return

Returns a [User profile](/data-types/#user-profile) object when log in is successful.

### Errors
```ts
{
  code: "SIGNUP_CONFIRMATION_NEEDED";
  message: "User's signup confirmation is required.";
;
}
|
{
  code: 'USER_IS_DISABLED';
  message: 'This account is disabled.';
}
|
{
  code: 'INCORRECT_USERNAME_OR_PASSWORD';
  message: 'Incorrect username or password.';
}
```

## User's Profile

Once a user has been logged in, you can call `skapi.getProfile()` to retrieve the [User's Profile](/data-types/#user-profile).
If a user is not logged in, `skapi.getProfile()` will return null.

```js
skapi.getProfile().then(profile=>{
  console.log(profile);
})
```
## Logout

Logs user out from the service.

```js
skapi.logout();
```

### Return
```ts
'SUCCESS: The user has been logged out.'
```

## Forgot password

To reset a forgotten password:

1. Request a verification code using the `forgotPassword()` method.

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
skapi.forgotPassword({email: 'someone@gmail.com'});
// User receives an e-mail with a verification code.
```
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

</template>
</CodeSwitcher>

2. The user will receive an email containing a verification code.
3. Use the `resetPassword()` method to reset the password with their verification code.

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

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

4. Upon successful password reset, the user's account password will be set to the new password provided.

::: danger WARNING
Users will not be able to receive a verification code if their email is not verified, causing them to lose their accounts forever.

We highly recommend encouraging users to verify their email.
:::

## Recovering a Disabled Account

Disabled accounts can be reactivated within 3 months using the `skapi.recoverAccount()` method. To recover accounts, the following criteria must be met:

- account email must be verified.
- have at least one sign-in attempt using the disabled account 
 

**If the account is unverified, it cannot be recovered**.

The `recoverAccount()` method sends the account owner an email containing a confirmation link. In addition, the `recoverAccount()` method accepts an optional `URL: string` argument, redirecting the user to the URL upon successful account recovery.

Here is an example of how to use the `recoverAccount()` method:

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
