# Authentication

## Creating an Account

To create a new account with skapi, you can use the `signup()` method. This method allows you to specify a variety of parameters to create the account, as well as some optional options.

Here's an example of how to use `signup(params, options?)`:

```ts
let parameters = {
  email: "user@email.com",
  password: "password", // The password should be at least 6 characters.
  name: "User's name"
};

let options = {
  login: true // If set to true, the user will be automatically logged in to the service upon successful signup.
};

skapi.signup(parameters, options).then(r => console.log(r));
```

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

### Options (Optional)

Optional parameters for the `signup()` method.

- signup_confirmation:
  - If `options.signup_confirmation` is set to `true`, the user will receive an email to confirm their signup. Once they click the link in the email, their signup will be confirmed, and they will be able to log in to your service. If the user does not confirm within a day, their signup will be invalid, and they will need to sign up again. Alternatively, you can specify a URL to redirect the user to when they click the confirmation link. It is advised to let your users confirm their signup to prevent automated bots.
- login:
  - If set to `true`, the user will be automatically logged in to the service upon successful signup.
- email_subscription:
  - If set to `true`, the user is subscribed to the service newsletters when account is created. `options.signup_confirmation` must be `true`.

```ts
type options = {
  signup_confirmation?: boolean | string;
  email_subscription?: boolean;
  login?: boolean;
  response?(response: any): any; // A callback function to be called upon success.
  onerror?(error: Error): any; // A callback function to be called on error.
};
```
### Returns

Returns an [User profile object](/data-types/#user-profile) when `options.login` is `true`.

If `options.login` is not set or is set to `false`, the method returns one of the following message strings:
- "SUCCESS: The account has been created. User's signup confirmation is required."
- "SUCCESS: The account has been created."

## Signup Confirmation

When the user created an account with `options.signup_confirmation` = `true` in `signup()` options,
User will need to click the link in the email to log in to your service.
If a user didn't receive or lost their signup confirmation email, you can allow them to request another one by using the `resendSignupConfirmation()` method.
To resend the user's signup confirmation email, the user must have at least one attempt to login to your service.

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

## Login

Use the `login` method to log a user into your service.
If the `options.signup_confirmation` was set to `true` in the `skapi.signup()` options,
the user will not be able to log in until they have confirmed their signup confirmation email.

```js
let parameters = {
  email: 'user@email.com',
  password: 'password'
}

skapi.login(parameters).then(account => console.log(account));
```

### parameters

```ts
// Params accepts SubmitEvent

type parameters = {
  email:string; // User's login E-Mail.
  password:string; // User's login password.
}
```

### Returns

Returns an [User profile object](/data-types/#user-profile) when log in is successful.

### Errors
```ts
{
  code: 'INVALID_REQUEST';
  message: string;
  name: 'SkapiError';
}
|
{
  code: 'SIGNUP_CONFIRMATION_NEEDED';
  message: "User's signup confirmation is required.";
  name: 'SkapiError';
}
|
{
  code: 'USER_IS_DISABLED';
  message: 'This account is disabled.';
  name: 'SkapiError';
}
|
{
  code: 'INCORRECT_USERNAME_OR_PASSWORD';
  message: 'Incorrect username or password.';
  name: 'SkapiError';
}
```

## User's Profile

Once a user has been logged in, you can call `skapi.getProfile()` to retrieve [User's Profile](/data-types/#user-profile).
If the user is not logged in, `skapi.getProfile()` will return null.

```js
skapi.getProfile().then(account=>{
  console.log(account);
})
```

### redirectUrl (optional)
When a URL string is provided as an argument, you can redirect the user to the URL once they click on the confirmation email link.

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

To reset a forgotten password, a user can follow the steps below:

- Request a reset password code by calling `skapi.forgotPassword(params)`, where `params` is an object containing the user's email address.
- The user will receive an email containing a verification code.
- Use the `skapi.resetPassword(params)` method to reset the password, passing in an object containing the user's email, the verification code, and the new password.
- Upon successful password reset, the user's account password will be set to the new password provided.

```js
let params = {
  email: 'user@email.com'
}

skapi.forgotPassword(params);
// User receives an e-mail with a verification code.
```

```js
// User can now use the verification code to reset password.
let params = {
  email: 'user@email.com',
  code: 'xxxx...',
  new_password: 'users_new_password' // The password should be at least 6 characters and 60 characters maximum.
}
skapi.resetPassword({ email, code, new_password })
    .then(()=>{
        // New password is set.
    });
```

::: warning NOTE
If the user's account does not have a verified e-mail address, user will not be able to receive any verification code.
Advise users to verify their e-mail.
:::

## Recovering a Disabled Account

If a user's account has been disabled, it is possible to recover it within 3 months by using the `skapi.recoverAccount()` method. In order to initiate the account recovery process, the user must have at least one sign-in attempt associated with their disabled account and their email must have been verified. If the account is unverified, it cannot be recovered.

The `skapi.recoverAccount()` method sends a signup confirmation email to the user with a confirmation link. It also accepts an optional URL argument, which will be used to redirect the user to a specific page upon successful account recovery.

Here is an example of how to use the `skapi.recoverAccount()` method:

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
