# User Account

Methods related to user account management.

## Changing Password

### [`changePassword(params): Promise<string>`](/api-reference/user/#changepassword)

The `changePassword()` method allows users who are logged-in to change their password. This method requires the user's current password and the new password as parameters. If the password change is successful, the method will return a success message.

Password should be at least 6 characters and no more than 60 characters.

### Example: Changing Password

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

``` js
let params = {
    current_password: 'current password',
    new_password: 'new password'
}

skapi.changePassword(params)
  .then(res => {
    console.log({res}); // SUCCESS: Password has been changed.
  })
  .catch(err => {
    console.log({err});
  });
```

In this example, the `changePassword()` method is called with the user's current password and the new password.

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.changePassword(event, 
    { 
        response: (res) => {console.log({res})}, // response runs if successful
        onerror: err => console.log({err}) // onerror runs if fail
    })">
    <input id="password" type="password" name="current_password" placeholder="Current Password" required>
    <br>
    <input id="password" type="password" name="new_password" placeholder="New Password" required>
    <br>
    <input type="submit" value="Change Password">
</form>
```

In the example above, a form is used to capture the user's current password and new password. The `changePassword()` method is called when the form is submitted.

</template>
</CodeSwitcher>

## Updating account profile

### [`updateProfile(params, options?): Promise<User>`](/api-reference/user/#updateprofile)

User's profile can be updated using `updateProfile()`. The user must be logged in to make this request.

If the update is successful, the updated [User Profile](/api-reference/data-types/#user-profile) object is returned if the update is successful. Please note that certain fields, such as email and phone number, will become unverified if changed.

### Example: Updating the User's Name

In this example, the user's name is updated by providing a new name value in the `params` object. If the update is successful, the updated user profile is returned.

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

``` js
let params = {
    name: 'New name',
    // email, // The user's login email address. The email will be unverified if it is changed.
    // address, // The user's address.
    // gender, // The user's gender. Can be "female" or "male", or other values if neither of these are applicable.
    // birthdate, // The user's birthdate in the format "YYYY-MM-DD".
    // phone_number, // The user's phone number.
    // email_public, // The user's email is public if this is set to true. The email should be verified.
    // phone_number_public, // The user's phone number is public if this is set to true. The phone number should be verified.
    // address_public, // The user's address is public if this is set to true.
    // gender_public, // The user's gender is public if this is set to true.
    // birthdate_public, // The user's birthdate is public if this is set to true.
};

skapi.updateProfile(params)
  .then(res => {
    console.log({res}); // User's name is updated.
  })
  .catch(err => {
    console.log({err});
  });
```
</template>
<template v-slot:form>

```html
<form onsubmit="skapi.updateProfile(event, 
    { 
        response: (res) => {console.log({res})}, // response runs if successful
        onerror: err => console.log({err}) // onerror runs if fail
    })">
    <input type="text" name="name" placeholder="Name" required>
    <br>
    <input type="submit" value="Update Profile">
</form>
```

</template>
</CodeSwitcher>

## E-Mail Verification

### [`verifyEmail(params?): Promise(string)`](/api-reference/user/#verifyemail)

You can verify your user's email addresses with `verifyEmail()`. The user must be logged in to make this request.

This method needs to be called twice to complete the verification.

1. The first call sends a verification code to the user's registered email without any arguments.
2. The second call completes the verification process by passing the verification code in the argument.


### Example: Verifying User's Email

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

``` js
async function verifyEmail() {
  // Send verification code to user's E-Mail
  await skapi.verifyEmail(); // 'SUCCESS: Verification code has been sent.'
  
  // Prompt user to enter the verification code
  let code = prompt('Enter the verification code:');
  
  // Verify E-Mail with the code
  await skapi.verifyEmail({ code }); // `SUCCESS: "email" is verified.`
  
  // E-Mail is now verified
  console.log('E-Mail verified');
}

verifyEmail();
```

In this example, the `verifyEmail()` function is used to initiate the email verification process. The first call to `verifyEmail()` sends a verification code to the user's email address. The second call provides the verification code to complete the verification process.

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.verifyEmail(event, 
    { 
        response: (res) => {console.log({res})}, // response runs if successful
        onerror: err => console.log({err}) // onerror runs if fail
    })">
    <input type="text" name="code" required>
    <br>
    <input type="submit" value="Verify Email">
</form>
```

In this example a form is used to complete the email verification. **You need to call the `verifyEmail()` seperately to send the verification code to the user**. 

</template>
</CodeSwitcher>

<!-- ::: tip
You can customize the verification email's template from the skapi dashboard.

Refer to [Setting up E-Mail templates]()
::: -->


## Recovering a Disabled Account

### [`recoverAccount(redirect: boolean | string): Promise<string>`](/api-reference/user/#recoveraccount)

[Disabled accounts](/user-account/#disabling-account) can be reactivated **within 3 months** using the `recoverAccount()` method. This method allows users to reactivate their disabled accounts under the following conditions:

- The account email must be verified.
- The `recoverAccount()` method must be called from the `catch` block of a failed `login()` attempt using the disabled account.

The `recoverAccount()` method sends an email to the account owner, containing a confirmation link for account recovery. Additionally, you can provide an optional URL `string` argument to the `recoverAccount()` method, which will redirect the user to the specified URL upon successful account recovery.

### Example: Recovering a Disabled Account

Here's an example demonstrating how to use the recoverAccount() method:

```js
try {
  await skapi.login({email: 'user@email.com', password: 'password'}); // user attempt to login
} catch(failed) {
  console.log(failed.message); // This account is disabled.
  console.log(failed.code); // USER_IS_DISABLED
  if(failed.code === 'USER_IS_DISABLED') {
    // Send a recovery email to the user with a link.
    // When the user click on the link, the user will be redirected when account recovery is successful.
    await skapi.recoverAccount("https://example.com");
  }
}
```

In the example above, the `recoverAccount()` method is called from the catch block of a failed login attempt using a disabled account. If the login attempt fails with the error code "USER_IS_DISABLED," the `recoverAccount()` method is called to send a recovery email to the user. The recovery email contains a link, and when the user clicks on the link, they will be redirected to the specified URL ("https://example.com") upon successful account recovery.
 
 :::danger WARNING
If the account is unverified, it cannot be recovered.
 :::


## Disabling account

### [`disableAccount(): Promise(string)`](/api-reference/user/#disableaccount)

You can disable your user's account using the `disableAccount()` method. **All data related to the account will be deleted after 3 months**. It's important to note that the user will be automatically logged out once their account has been disabled.

::: danger Warning
Please ensure your users account have a verified email before you disable it. **Accounts with no verified email addresses cannot be recovered and will be lost**.
:::

Refer to [Recovering a Disabled Account](/authentication/#recovering-a-disabled-account) on how to recover the account.

### Example: Disabling User Account

``` js
skapi.disableAccount().then(()=>{
  // Account is disabled and user is logged out.
});
```

## Retrieving Other User Profiles

### [`getUsers(params?, fetchOptions?): Promise<DatabaseResponse>`](/api-reference/user/#getusers)

You can retrieve information of other users in your service using the `getUsers()` method. By default, `getUsers()` will return all users chronologically from the most recent sign-up. The user account using this method has to be logged in.

### Example: Retrieve All User Profiles

```js
skapi.getUsers().then(u=>{
  console.log(u.list); // List of all users in your service, sorted by most recent sign-up date.
});
```
In the example above, the `getUsers()` method is called without any parameters. This retrieves a list of all user profiles in your service.

You can also search for users using attributes such as name, email, and phone number. Attributes that the user has set to private will not be searchable.

```js
// Search for users whose name starts with 'Baksa'
let params = {
  searchFor: 'name',
  condition: '>=',
  value: 'Baksa'
}
skapi.getUsers(params).then(u=>{
  console.log(u.list); // List of users whose name starts with 'Baksa'
});

// Search for users who joined before 2023 jan 1
let timestampParams = {
  searchFor: 'timestamp',
  condition: '<',
  value: 1672498800000
}

skapi.getUsers(timestampParams).then(u=>{
  console.log(u.list); // List of users who joined before 2023 jan 1
});

// Search for users whose birthday is between 1985 ~ 1990
let birthdateParams = {
  searchFor: 'birthdate',
  value: '1985-01-01',
  range: '1990-12-31'
}

skapi.getUsers(birthdateParams).then(u=>{
  console.log(u.list); // List of users whose birthday is between 1985 ~ 1990
});
```
In the examples above, different search criteria are used to filter the user profiles. The searchFor parameter specifies the attribute to search for, and the value parameter specifies the search value. The condition parameter is used to set the search condition.

The following attributes can be used in `searchFor` to search for users:

- `user_id`: unique user identifier, string
- `email`: user's email address, string
- `phone_number`: user's phone number, string
- `name`: user's profile name, string
- `address`: user's physical address, string
- `gender`: user's gender, string
- `birthdate`: user's birthdate in "YYYY-MM-DD" format, string
- `locale`: the user's locale, a string representing the country code (e.g "US" for United States).
- `subscribers`: number of subscribers the user has, number
- `timestamp`: timestamp of user's sign-up, number(13 digit unix time)

The `condition` parameter allows you to specify the search criteria when searching with user attributes. 

The operaters that can be used with `condition` include `>`, `>=`, `=`, `<`, and `<=`. If `condition` is not defined, it will compare with `=`. 

When searching for a `string` attribute, `>` and `<` will search for strings that are higher or lower in the lexicographical order, respectively. To search using 'starts with', use the `>=` operator.

:::warning NOTE
- `user_id`, `email`, `phone_number`, and `address` must be searched with the '=' condition.
- Users cannot search for attributes that are not set to public. Refer to [User Profile](/api-reference/data-types/#user-profile)
:::

The `range` parameter enables searching for users based on a specific attribute value within a given range. For example, if searching by `timestamp` with a range of 1651748526 to 1651143726, only users created between the two timestamps will be returned. 

:::warning NOTE
The `range` parameter cannot be used with the `condition` parameter.
:::

### FetchOptions Additional Parameters (Optional)

`FetchOptions` helps you to specify the number of results to return per API call and fetching the next batch of records. This is used globally for all database related methods that allows optional `fetchOptions` argument.

See full list of [FetchOptions](/api-reference/data-types/#fetch-options)


### Limit Results with `fetchOptions.limit`

By default, 50 rows will be fetched per call. You can adjust the limit to your preference, allowing up to **1000 rows**, by using the `limit` key.

### Fetch More Results with `fetchOptions.fetchMore`

To fetch more results, you can set the `fetchMore` parameter to `true` in the `fetchOptions` object. This allows you to retrieve results in batches until the end of the list is reached.

### Example: Fetching 100 More Results

``` js
let fetchOptions = {
  limit: 100,
  fetchMore: true
}
// Retrieve a list of up to 100 users in your service, sorted by most recent sign-up date.
skapi.getUsers(null, fetchOptions).then(u=>{
  console.log(u.list); // List of up to 100 users in your service, sorted by most recent sign-up date.

  // If there is more users to fetch, retrieve the next batch of 100 users
  if(!u.endOfList) {
    skapi.getUsers(null, fetchOptions).then(u=>{
      console.log(u.list); // List of the next 100 users from the database.
    });
  }
});

```
In this example, the `fetchOptions` object includes `fetchMore: true` and `limit: 100`. This allows the `getUsers()` method to fetch the next batch of 100 users on each execution until the end of the list is reached.

:::danger WARNING
When using the `fetchMore` parameter, you must check if the response's `endOfList` is `true` before making the next call. `getUsers()` will return an empty list if there are no results.
:::