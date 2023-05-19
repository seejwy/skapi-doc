# Data Types

## User

```ts
type User = {
    service: string;
    owner?: string;
    access_group?: number;
    user_id: string;
    locale: string;
    email_verified?: boolean;
    phone_number_verified?: boolean;
    signup_ticket?: string;
    subscribers: number;
    timestamp: number;
}
```

## User Profile

```ts
type UserProfile = {
    service:string; // The service ID of the user's account.
    owner:string; // The user ID of the service owner.
    access_group:number; // The access level of the user's account.
    user_id:string; // The user's ID.
    locale:string;// The country code of the user's location when they signed up.
    
    /**
     The user's email address.
     This should be a maximum of 64 characters and is only visible to others if the email_public option is set to true.
     The email will be unverified if it is changed.
     */
    email?:string;
    email_verified?:boolean; // Set to true if the user has verified their email.
    
    /**
     The user's phone number.
     This should be in the format "+0012341234" and is only visible to others if the phone_number_public option is set to true.
     The phone number will be unverified if it is changed.
     */
    phone_number?:string;
    phone_number_verified?:boolean;// Set to true if the user has verified their phone number.
    name?:string; // The user's name.
    address?:string // The user's address.
    gender?:string // The user's gender. Can be "female" or "male"; or other values if neither of these are applicable.
    birthdate?:string; // The user's birthdate in the format "YYYY-MM-DD".
    email_public?:boolean; // The user's email is public if this is set to true. The email should be verified.
    phone_number_public?:boolean; // The user's phone number is public if this is set to true. The phone number should be verified.
    address_public?:boolean; // The user's address is public if this is set to true.
    gender_public?:boolean; // The user's gender is public if this is set to true.
    birthdate_public?:boolean; // The user's birthdate is public if this is set to true.
}
```

## Fetch Options

Fetch option parameter is used in methods that calls the database.

```ts
type FetchOptions = {
    limit?: number; // max number of data to fetch. Max 1000. Default 50.
    fetchMore?: boolean; // fetches next batch of data if true. Default false.
    ascending?: boolean; // results in ascending order if true
    startKey?: string;
}
```
## RecordData

```ts
type RecordData = {
    service: string;
    record_id: string;
    user_id: string;
    updated: number; // timestamp in milliseconds
    uploaded: number; // timestamp in milliseconds
    table: {
        name: string;
        access_group?: number | 'private' | 'public' | 'authorized';
        subscription?: {
            user_id: string;
            group: number;
        };
    };
    reference: {
        record_id?: string;
        reference_limit: number;
        allow_multiple_reference: boolean;
        referenced_count: number;
    };
    index?: {
        name: string;
        value: string | number | boolean;
    };
    data?: { [key: string]: any };
    tags?: string[];
    ip: string;
};
```