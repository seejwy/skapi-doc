# User Account

Methods related to user managing their accounts.

## Changing Password

The changePassword() method allows a logged in user to change their password. It requires the user's current password and their desired new password as parameters. If the password change is successful, the method will return a success message.

The password should be at least 6 characters and 60 characters maximum.

``` js
let params = {
    current_password: 'current password',
    new_password: 'new password'
}
skapi.changePassword(params).then(r=>{
  console.log(r); // SUCCESS: Password has been changed.
});
```

## Updating account profile

User can update their account profile by calling skapi.updateProfile() and passing in an object with the desired updates. The user must be logged in to make this request.

The updated [Account data object](/data-types/#account) will be returned if the update is successful. Note that certain fields, such as the email and phone number, will be unverified if they are changed.


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
    // email_subscription // Subscribes user to the service's email if this is set to true. The email should be verified.
};

skapi.updateProfile(updates).then(account => {
    console.log(account); // User's name is updated.
});
```

## E-Mail verification

User can verify their E-Mail by calling the skapi.verifyEmail() method. The user needs to be signed in to the account.

The first time this method is called, the user will receive a verification code via E-Mail. To complete the verification process, the user needs to call the skapi.verifyEmail() method again, this time passing the verification code as an argument. If the code is valid, the user's E-Mail will be verified.

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

::: tip
You can customize the verification E-Mail/SMS, template from the skapi dashboard.

Refer: [Setting up E-Mail templates]()
:::

## Disabling account

User can remove their account from your service using the skapi.disableAccount() method. Upon successful request, all data related to the account will be deleted after 3 months. Within this period, the user can recover their account if they choose to do so. It's important to note that the user will be logged out after the request is successful.

``` js
skapi.disableAccount().then(()=>{
  // Account is disabled and user is logged out.
});
```

## Retrieving User Profiles

The skapi.getUsers() method allows you to retrieve user profiles from your service's database. By default, the method will return all users sorted by most recent sign-up date. A user login is required to use this method.

``` js
skapi.getUsers().then(u=>{
  console.log(u.list); // List of all users in your service, sorted by most recent sign-up date.
});
```

You can also search for specific users based on attributes such as name, email, and phone number. Any attributes that the user has set to private will not be searchable.

The following attributes can be used in the 'searchFor' parameter:

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

The 'condition' parameter allows you to specify the search criteria when searching for user attributes. Available options include '>', '>=', '=', '<', '<='. Default condition is '='. When searching for a string attribute, '>' and '<' will search for strings that are higher or lower in lexicographical order, respectively. '>=' will search for strings that start with the given value, '<=' will work like '='.

::: warning NOTE
It is important to note that the 'user_id' attribute can only be searched with '=' condition.
:::

The 'range' parameter allows you to search for the users who have the certain attribute value between the given value and the range value. The 'range' parameter cannot be used with 'condition' parameter.

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

### Options

The skapi.getUsers() method allows you to specify additional options to customize the data retrieval process.

#### Limit
By default, the method will return a maximum of 100 items per call. If you need to fetch more data, you can set the limit parameter up to 1000 items per call in the optional second argument of the method. Here is an example:

``` js
let options = {
  limit: 1000
}
// Retrieve a list of up to 1000 users in your service, sorted by most recent sign-up date.
skapi.getUsers(null, options).then(u=>{
  console.log(u.list); // List of up to 1000 users in your service, sorted by most recent sign-up date.
});
```

It is important to note that the maximum limit of items that can be retrieved per call is 1000. Any value above 1000 will be ignored and the default limit of 100 will be used.

#### fetchMore
If you need to fetch users beyond the limit, you can set the fetchMore parameter to true in the options. The method will then fetch the next batch of list of users on every execution until it reaches the end of the list. Below is an example:

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
:::warning NOTE
It is important to note that when using the fetchMore parameter, it is the developer's responsibility to check if the returned list is the last batch of data. The method will continue to fetch the next batch of data until the end of the list is reached. Once the end of the list is reached, the method will return an empty list, indicating that there are no more items to fetch.
:::