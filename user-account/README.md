# User Account

Methods related to user account management.

## Changing Password

The `changePassword()` method allows users who are logged-in to change their password. It takes the user's current and new password as parameters. If the password change is successful, the method will return a success message.

Password should be at least 6 characters and no more than 60 characters.

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

</template>
</CodeSwitcher>

## Updating account profile

You can update your user's profile with `updateProfile()`. The user must be logged in to make this request.

The updated [User Profile](/data-types/#user-profile) object is returned if the update is successful. Note that verified fields, such as email and phone number, will become unverified when changed.

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

``` js
let updates = {
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

skapi.updateProfile(updates)
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
    <span onclick="requestCode()" style="cursor: pointer; text-decoration: underline;">Request Code</span>
    <br>
    <input type="submit" value="Update Profile">
</form>
<script>
    function requestCode() {
        skapi.verifyEmail()
          .then((res) => console.log({res}))
          .catch(err => console.log({err}));
    }
</script>
```

</template>
</CodeSwitcher>

## E-Mail Verification

You can verify your user's email addresses with `verifyEmail()`. The user must be logged in to make this request.

This method needs to be called twice to:

1. Send a verification code to the user's registered phone/email. Set the method of verification with `phone` or `email` as the argument
2. Complete the verification process by passing the verification code as an argument.

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
```
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

</template>
</CodeSwitcher>

::: tip
You can customize the verification Email/SMS message's template from the skapi dashboard.

Refer to [Setting up E-Mail templates]()
:::


## Disabling account

You can disable your user's account using the `disableAccount()` method. **All data related to the account will be deleted after 3 months**. Refer to [Recovering a Disabled Account](/authentication/#recovering-a-disabled-account) on how to recover the account. It's important to note that the user will be logged out once their account has been disabled.

``` js
skapi.disableAccount().then(()=>{
  // Account is disabled and user is logged out.
});
```

::: danger Warning
Please ensure your users account have a verified email before you disable it. **Accounts with no verified email addresses cannot be recovered and will be lost**.
:::

## Retrieving Other User Profiles

You can fetch all registered accounts in your service with `getUsers()`. By default, `getUsers()` will return all users chronologically from the most recent sign-up. The user account using this method has to be logged in.

```js
skapi.getUsers().then(u=>{
  console.log(u.list); // List of all users in your service, sorted by most recent sign-up date.
});
```

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
let params = {
  searchFor: 'timestamp',
  condition: '<',
  value: 1672498800000
}

skapi.getUsers(params).then(u=>{
  console.log(u.list); // List of users who joined before 2023 jan 1
});

// Search for users whose birthday is between 1985 ~ 1990
let params = {
  searchFor: 'birthdate',
  value: '1985-01-01',
  range: '1990-12-31'
}

skapi.getUsers(params).then(u=>{
  console.log(u.list); // List of users whose birthday is between 1985 ~ 1990
});
```

The following attributes can be used to search for users:

- 'user_id': unique user identifier, string
- 'email': user's email address, string
- 'phone_number': user's phone number, string
- 'name': user's profile name, string
- 'address': user's physical address, string
- 'gender': user's gender, string
- 'birthdate': user's birthdate in "YYYY-MM-DD" format, string
- 'locale': the user's locale, a string representing the country code (e.g "US" for United States).
- 'subscribers': number of subscribers the user has, number
- 'timestamp': timestamp of user's sign-up, number(13 digit unix time)

The `condition` parameter allows you to specify the search criteria when searching with user attributes. 

The operaters that can be used with `condition` include `>`, `>=`, `=`, `<`, and `<=`. If `condition` is not defined, it will compare with `=`. 

When searching for a `string` attribute, `>` and `<` will search for strings that are higher or lower in the lexicographical order, respectively. To search using 'starts with', use the `>=` operator.

:::warning NOTE
- `user_id`, `email`, `phone_number`, and `address` must be searched with the '=' condition.
- Users cannot search for attributes that are not set to public. Refer to [User Profile](/data-types/#user-profile)
:::

The `range` parameter enables searching for users based on a specific attribute value within a given range. For example, if searching by `timestamp` with a range of 1651748526 to 1651143726, only users created between the two timestamps will be returned. 

:::warning NOTE
The `range` parameter cannot be used with the `condition` parameter.
:::

### Options

The `getUsers()` method allows you to specify additional options to customize the data retrieval process.

#### Limit
By default, the method will return a maximum of 100 items per call. If you need to fetch more data, you can set the `limit` parameter up to 1000 items per call in the optional second argument of the method. Here is an example:

```js
let options = {
  limit: 1000
}
// Retrieve a list of up to 1000 users in your service, sorted by most recent sign-up date.
skapi.getUsers(null, options).then(u=>{
  console.log(u.list); // List of up to 1000 users in your service, sorted by most recent sign-up date.
});
```
:::warning NOTE
The maximum number of items that can be retrieved per call is 1000. If a value above 1000 is provided, it will be ignored and the default limit of 100 will be used.
:::


#### fetchMore
If you have more users than the set `limit`, you can set the `fetchMore` parameter to `true` in the options. The method will then return the next batch of users each time it is called. Here is an example:

``` js
let options = {
  limit: 100,
  fetchMore: true
}
// Retrieve a list of up to 100 users in your service, sorted by most recent sign-up date.
skapi.getUsers(null, options).then(u=>{
  console.log(u.list); // List of up to 100 users in your service, sorted by most recent sign-up date.

  // If there is more users to fetch, retrieve the next batch of 100 users
  if(!u.endOfList) {
    skapi.getUsers(null, options).then(u=>{
      console.log(u.list); // List of the next 100 users from the database.
    });
  }
});

```

:::danger WARNING
When using the `fetchMore` parameter, you must check if the response's `endOfList` is `true` before making the next call. `getUsers()` will continue making API calls even if there are no more results resulting in significantly higher costs.
:::