# User Account

Methods related to user managing their accounts.

## Forgot password

User can request reset password for forgotten password.

``` js
skapi.forgotPassword({ email });
// User receives verification E-Mail with verification code.
```
``` js
// User can now use the verification code to reset password.
skapi.resetPassword({ email, code, new_password })
    .then(()=>{
        // users account password is now set to a new_password.
    });
```

### **`forgotPassword(params)`**
Request verification code for reset password.

- **params**

  - `email: string`
    
    Users login E-Mail


### **`resetPassword(params)`**
Reset user password.\
Verification code is needed.

- **params**
  - `email: string`
  
    Users login E-Mail

  - `code: string`
  
    Verification code for reset password.

  - `new_password: string`
    
    new password.

## Changing Password

User can update their profile.\
User needs to be logged in.

``` js
await skapi.updateUserSettings({
    current_password,
    new_password
});
// User's password is updated.
```

## Updating user profile

User can update their profile.\
User needs to be logged in.

``` js
skapi.updateUserSettings({
    name: 'New name'
}).then(()=>{
    // User's name is updated.
});
```

### **`updateUserSettings(params | HTMLFormElement, options?)`: [Promise](./#returns)**
  Updates user profile.

- **params**
  - `current_password:string`
  
    User's current password.\
    To change user's password `current_password` is required.

  - `new_password:string`

    Sets user's new password.\
    `current_password` is required.
  
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
  

- **options?**
  - `response?: (response: {}) => any` Callback on success.
  - `onerror?: (err: Error) => any` Callback on error.

#### Returns
  
``` ts
skapi.updateUserSettings(params, options?):
  Promise<{
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
}>
```

#### Error
``` ts
{
    code: 'INVALID_REQUEST' | 'INVALID_PARAMETER';
    message: string
}
```


## Uploading user data

User can upload user data.\
The data can be fetched from `getUsers`

``` js
skapi.uploadUserData(
    {
        whoAmI: 'John Lennon',
        myFavoriteFruits: ['Strawberry', 'Apple'],
        secret: 'Walrus was paul'
    },
    {
        private: ['secret']
    }
).then(()=>{
    // key 'secret' will be private
});
```

### **`uploadUserData(params | HTMLFormElement, options?)`: [Promise](./#returns-2)**
  Uploads user data, overwrites the previous data.\

- **params | HTMLFormElement**
    
    - `[keys:string]: any` You can upload any type of JSON data or HTMLFormElement.

- **options?**
    
  - `private: string[]`

    You can set certain keys to be private.
    Once set, data in the private keys will not be accessible to other users.

  - `response?: (response: {}) => any` Callback on success.

  - `onerror?: (err: Error) => any` Callback on error.

#### Returns
``` ts
skapi.uploadUserData(params, options):Promise<{
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
     * User's login E-Mail.
     * When E-Mail is changed, E-Mail verified state will be changed to false.
     * E-Mail is only visible to others when set to public.
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
    
    /** Last login time */
    log: number;
    
    /** User data that has been set to private. The data is only shown to the owner of the account. */
    private_data?: Record<string, any>;
    
    /** Number of the user's subscribers. */
    subscribers: number;
    
    /** Timestamp of user signup time. */
    timestamp: number;
    
    /** User's data. */
    user_data?: Record<string, any>;
    
    /** Reference of how others would see the data. */
    _what_public_see?: Record<string, any>;
  }>

```