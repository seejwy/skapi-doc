# Authentication

Authentication methods helps you to setup signup, login, logout, content restrictions for your users.

## Creating account

First thing you would want to build is a signup for your user.
Example below shows simple signup.

``` js
let signup = await skapi.signup({ email, password });
```


### `skapi.signup(params, options?)`

- **`params: {}`**

  - `email: string`

    E-Mail to use for login.\
    E-Mail should be at least more than 5 characters up to 64 character max.

  - `email_public: boolean`

    Sets user's E-Mail to be public.

  - `password: string`

    Users password for login.\
    Users password should be at least more than 6 characters up to 60 character max.

  - `address?: string`

    Users address to use in login profile.\
    Users address will not be seen in public unless user sets to public.
  
  - `address_public?: boolean`

    Sets user's address to be public.

  - `birthdate?: string`

    User's birthdate to use in login profile.\
    The format should be: "1969-07-16"\
    Users birthdate will not be seen in public unless user sets to public.
  
  - `birthdate_public?: boolean`

    Sets user's birthdate to be public.

  - `gender?: string`

    User's gender to use in login profile.\
    Can be "female" and "male".\
    Other values may be used when neither of the defined values are applicable.\
    Users gender will not be seen in public unless user sets to public.
  
  - `gender_public?: boolean`

    Sets user's gender to be public.

  - `name?: string`

    User's name to use in login profile.

  - `phone_number?: string`

    User's phone number. Format: "+0012341234"\
    Phone number is only visible to others when set to public.

  - `phone_number_public?: boolean`

    Sets user's phone number to be public.

  - `email_subscription?: boolean`
    
    User can receive your service letters if set to `true`
  

- **`options?: {}`**

  - `confirmation: boolean | string`

    If `true` user will receive an E-Mail for signup confirmation.\
    Once user clicks on the link in the E-Mail, user signup is confirmed and user will able to login to your service.\
    If user fails to confirm within a day, Signup will not be valid and user will have to signup again.

    You can also give URL address to redirect the link when confirmation link is clicked.

  - `login?: boolean`

    If `true` user is automatically logged in to the service when signup is successful.

  - `response?: (resp:{}) => any`

    Callback on success.

  - `onerror?: (err: Error) => any`

    Callback on error.

- **Returns**
  
  Returns an user `object` when `options.login` is `true`.\
  Otherwise returns a message string.
  ``` ts
  {
    /** Service id of the user account. */
    service: string;
    /** User ID of the service owner. */
    service_owner?: string;
    /** Access level of the user's account. */
    access_group?: number;
    /** User's ID. */
    user_id: string;
    /** Country code of where user signed up from. */
    locale: string;
    /**
     * User's E-Mail for signin.<br>
     * 64 character max.<br>
     * When E-Mail is changed, E-Mail verified state will be changed to false.<br>
     * E-Mail is only visible to others when set to public.<br>
     * E-Mail should be verified to set to public.
     * */
    email?: string;
    /** Shows true when user has verified their E-Mail. */
    email_verified?: boolean;
    /**
     * User's phone number. Format: "+0012341234"<br>
     * When phone number is changed, phone number verified state will be changed to false.<br>
     * Phone number is only visible to others when set to public.<br>
     * Phone number should be verified to set to public.
     */
    phone_number?: string;
    /** Shows true when user has verified their phone number. */
    phone_number_verified?: boolean;
    /** User's name */
    name?: string;
    /** User's address */
    address?: string;
    /**
     * User's gender. Can be "female" and "male".<br>
     * Other values may be used when neither of the defined values are applicable.
     */
    gender?: string;
    /** User's birthdate. String format: "1969-07-16" */
    birthdate?: string;
    /** User has subscribed to service e-mail when positive number. E-mail should be verified. */
    email_subscription?: number;
    /** User's E-mail is public when positive number. E-Mail should be verified. */
    email_public?: boolean;
    /** User's phone number is public when positive number. Phone number should be verified. */
    phone_number_public?: boolean;
    /** User's address is public when positive number. */
    address_public?: boolean;
    /** User's gender is public when positive number. */
    gender_public?: boolean;
    /** User's birthdate is public when positive number. */
    birthdate_public?: boolean;
    /** Shows 'PASS' if the user's account signup was successful.  */
    signup_ticket?: string;
  } |
  "SUCCESS: The account has been created. User's email confirmation is required." |
  "SUCCESS: The account has been created."
  ```
- **Errors**
  ``` ts
  {
    code: 'INVALID_PARAMETER',
    message: string,
    name: 'SkapiError'
  }
  ```


## Login

Login user to your service.\
If `options.confirmation = true` on [skapi.signup](/authentication/#skapi-signup-params-options), User will not be able to login unless they have confirmed their signup confirmation E-Mail.\
Once user is logged in, User will be automatically logged in when they revisits the website if `autoLogin` is `true` in skapi initialization.

``` js
let user = await skapi.login({ email, password });
```

### `skapi.login(params: {} | Form, options?: {})`


- **`params?: {} | Form`**

    `params` can take HTML forms.

  - `email: string`

    User's login E-Mail.

  - `password: string`

    User's login password.

- **`options?: {}`**

  - `response?: (resp:{}) => any`

    Callback on success.

  - `onerror?: (err: Error) => any`

    Callback on error.

- **Returns**

    ``` ts
    {
        /** Service id of the user account. */
        service: string;
        /** User ID of the service owner. */
        service_owner?: string;
        /** Access level of the user's account. */
        access_group?: number;
        /** User's ID. */
        user_id: string;
        /** Country code of where user signed up from. */
        locale: string;
        /**
         * User's E-Mail for signin.<br>
        * 64 character max.<br>
        * When E-Mail is changed, E-Mail verified state will be changed to false.<br>
        * E-Mail is only visible to others when set to public.<br>
        * E-Mail should be verified to set to public.
        * */
        email?: string;
        /** Shows true when user has verified their E-Mail. */
        email_verified?: boolean;
        /**
         * User's phone number. Format: "+0012341234"<br>
        * When phone number is changed, phone number verified state will be changed to false.<br>
        * Phone number is only visible to others when set to public.<br>
        * Phone number should be verified to set to public.
        */
        phone_number?: string;
        /** Shows true when user has verified their phone number. */
        phone_number_verified?: boolean;
        /** User's name */
        name?: string;
        /** User's address */
        address?: string;
        /**
         * User's gender. Can be "female" and "male".<br>
        * Other values may be used when neither of the defined values are applicable.
        */
        gender?: string;
        /** User's birthdate. String format: "1969-07-16" */
        birthdate?: string;
        /** User has subscribed to service e-mail when positive number. E-mail should be verified. */
        email_subscription?: number;
        /** User's E-mail is public when positive number. E-Mail should be verified. */
        email_public?: boolean;
        /** User's phone number is public when positive number. Phone number should be verified. */
        phone_number_public?: boolean;
        /** User's address is public when positive number. */
        address_public?: boolean;
        /** User's gender is public when positive number. */
        gender_public?: boolean;
        /** User's birthdate is public when positive number. */
        birthdate_public?: boolean;
        /** Shows 'PASS' if the user's account signup was successful.  */
        signup_ticket?: string;
    }
    ```
- **Errors**
  ``` ts
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

## Resending Confirmation E-Mail

If user failed to receive or have lost their signup confirmation E-Mail,\
You can let user to request another confirmation E-Mail.\
In order to resend users signup confirmation E-mail, User need at least one attempt to login to your service.

``` js
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
    
    if(err.code === 'SIGNUP_CONFIRMATION_NEEDED')
        // now you can resend signup confirmation E-Mail to user@email.com.
        await skapi.resendSignupConfirmation("/redirect/on/success");
    
    throw err;
}
```

### `skapi.resendSignupConfirmation(redirectUrl?:string): Promise`

- **`redirectUrl?: string`**
    
  When URL string is given, you can redirect user to the URL once user clicks on the confirmation E-Mail link.

- **Return**

  ``` ts
  'SUCCESS: Signup confirmation E-Mail has been sent.'
  ```

- **Error**

  ``` ts
  {
    code: 'INVALID_REQUEST',
    message: 'Least one login attempt is required.' | '"Url" is an invalid url.'
  }
  ```

## Logout

Logs user out from the service.\
Once logged out, user will not be automatically logged in on connection.

``` js
await skapi.logout();
```

### **`skapi.logout(): Promise`**

- **Return**
  ``` ts
  'SUCCESS: The user has been logged out.'
  ```

## Full Example

This is the full example building signup page.\
When signup is successful user is redirected to success page.

**`index.html`**

``` html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://skapi.com/lib/skapi.js"></script>
  </head>
  <body>
    <h1>Create your account</h1>
    <form onsubmit='skapi.signup(this, { formData: verifyPassword })' action='/signup-success.html'>
        <label for='email'>E-Mail:</label>
        <input id='email' name='email'>
        <label for='email'>name:</label>
        <input id='name' name='name'>
        <label for='password'>Password:</label>
        <input id='password' name='password'>
        <label for='verify_password'>Verify Password:</label>
        <input id='verify_password'>
        <input type='submit'>
    </form>
  </body>
  <script>
    const skapi = new Skapi('your_service_id', 'your_user_id');
    
    function verifyPassword(formData) {
        if(password.value !== verify_password.value) {
            throw 'Password does not match!'
        }
    }
  </script>
</html>
```


**`signup-success.html`**

``` html
<!DOCTYPE html>
<html>
  <body>
    <h1>Thankyou for signing up</h1>
    <h1>Please login to your account</h1>
        <form onsubmit='skapi.login(this)' action='/users-page.html'>
        <label for='email'>E-Mail:</label>
        <input id='email' name='email'>
        <label for='password'>Password:</label>
        <input id='password' name='password'>
        <input type='submit'>
    </form>
  </body>
  <script>
    const skapi = new Skapi('your_service_id', 'your_user_id');
  </script>
</html>
```


**`users-page.html`**

``` html
<!DOCTYPE html>
<html>
  <body>
    <h1 id='welcome'>
        Welcome #name!<br>
        Your E-Mail is: #email
    </h1>
  </body>
  <script>
    const skapi = new Skapi('your_service_id', 'your_user_id');
    skapi.getFormResponse().then(response=>{
        // response is resolved data from skapi.login()
        let welcome_text = welcome.textContent;
        welcome_text = welcome_text.replace('#name', response.name);
        welcome_text = welcome_text.replace('#email', response.email);
    });
  </script>
</html>
```