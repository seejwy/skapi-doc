# Data Types

## Account

```ts
{
    service:string, // The service ID of the user's account.
    service_owner:string, // The user ID of the service owner.
    access_group:number, // The access level of the user's account.
    user_id:string, // The user's ID.
    locale:string,// The country code of the user's location when they signed up.
    
    /**
     The user's email address.
     This should be a maximum of 64 characters and is only visible to others if the email_public option is set to true.
     The email will be unverified if it is changed.
     */
    email?:string,
    email_verified?:boolean, // Set to true if the user has verified their email.
    
    /**
     The user's phone number.
     This should be in the format "+0012341234" and is only visible to others if the phone_number_public option is set to true.
     The phone number will be unverified if it is changed.
     */
    phone_number?:string,
    phone_number_verified?:boolean,// Set to true if the user has verified their phone number.
    name?:string, // The user's name.
    address?:string // The user's address.
    gender?:string // The user's gender. Can be "female" or "male", or other values if neither of these are applicable.
    birthdate?:string, // The user's birthdate in the format "YYYY-MM-DD".
    email_subscription?:boolean, // The user has subscribed to the service's email if this is set to true. The email should be verified.
    email_public?:boolean, // The user's email is public if this is set to true. The email should be verified.
    phone_number_public?:boolean, // The user's phone number is public if this is set to true. The phone number should be verified.
    address_public?:boolean, // The user's address is public if this is set to true.
    gender_public?:boolean, // The user's gender is public if this is set to true.
    birthdate_public?:boolean, // The user's birthdate is public if this is set to true.
    signup_ticket:string // Set to "PASS" if the user's account signup was successful.
}
```