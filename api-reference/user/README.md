## signup

### `signup(params, options?): Promise<User | string>`

```ts
signup(
    params: { 
        name?: string;
        email: string; // Max 64 characters.
        password: string; // At least 6 characters and a maximum of 60 characters.
        phone_number?: string; // Must be in "+0012341234" format.
        address?: string | {
            // Full mailing address, formatted for display or use on a mailing label. This field MAY contain multiple lines, separated by newlines. Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
            // street_address
            // Full street address component, which MAY include house number, street name, Post Office Box, and multi-line extended street address information. This field MAY contain multiple lines, separated by newlines. Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
            formatted: string;
            // City or locality component.
            locality: string;
            // State, province, prefecture, or region component.
            region: string;
            // Zip code or postal code component.
            postal_code: string;
            // Country name component.
            country: string;
        };
        gender?: string;
        birthdate?: string; // Must be in YYYY-MM-DD format
        email_public?: boolean;
        phone_number_public?: boolean;
        address_public?: boolean;
        gender_public?: boolean;
        birthdate_public?: boolean;
        misc: string; // Additional string value that can be used freely.
    } | SubmitEvent;
    options: {
        signup_confirmation?: boolean | string; // set to true to force email verification. Give a url to set redirect
        email_subscription?: boolean; // Set to true to receive service email
        login?: boolean; // Set to true to login immediately. Cannot be used with signup_confirmation.
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns

```ts
// when options.login is true, return User
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
| "SUCCESS: The account has been created. User's signup confirmation is required." 
| "SUCCESS: The account has been created."
```

### Errors
```ts
{
  code: 'EXISTS';
  message: "user already exists.";
}
```

## login

### `login(params, options?): Promise<User>`

```ts
login(
    params: { 
        email: string; 
        password: string;
    } | SubmitEvent;
    options: {
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns

```ts
// when options.login is true, return User
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

### Errors
```ts
{
  code: "SIGNUP_CONFIRMATION_NEEDED";
  message: "User's signup confirmation is required.";
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


## getProfile

### `getProfile(): Promise<User | null>`

#### Returns

```ts
// when options.login is true, return User
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

### Errors
```ts
{
  code: "SIGNUP_CONFIRMATION_NEEDED";
  message: "User's signup confirmation is required.";
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

## logout

### `logout(): Promise<string>`

### Returns
```ts
'SUCCESS: The user has been logged out.'
```

## forgotPassword

### `forgotPassword(params, options?): Promise<string>`

```ts
forgotPassword(
    params: { 
        email: string; 
    } | SubmitEvent;
    options: {
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns

```ts
'SUCCESS: Verification code has been sent.'
```

## resetPassword

### `resetPassword(params, options?): Promise<string>`

```ts
resetPassword(
    params: { 
        email: string;
        code: string | number;
        new_password: string;
    } | SubmitEvent;
    options?: {
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns

```ts
'SUCCESS: New password has been set.'
```

## recoverAccount

### `recoverAccount(redirect: boolean | string): Promise<string>`

```ts
recoverAccount(redirect: boolean | string);
```

#### Returns

```ts
'SUCCESS: Recovery e-mail has been sent.'
```

## changePassword

### `changePassword(params): Promise<string>`

```ts
recoverAccount(params: {
    new_password: string;
    current_password: string;
});
```

#### Returns

```ts
`SUCCESS: Password has been changed.`
```

## updateProfile

### `updateProfile(params. options?): Promise<UserProfile>`

```ts
updateProfile({
    params: {
        service: string;
        owner?: string;
        access_group?: number;
        user_id: string;
        locale: string;
        email_verified?: boolean;
        phone_number_verified?: boolean;
        signup_ticket?: string;
        name?: string;
        email?: string;
        phone_number?: string;
        address?: string | {
            formatted: string;
            locality: string;
            region: string;
            postal_code: string;
            country: string;
        };
        gender?: string;
        birthdate?: string;
        email_public?: boolean;
        phone_number_public?: boolean;
        address_public?: boolean;
        gender_public?: boolean;
        birthdate_public?: boolean;
        misc: string;
    } | SubmitEvent;
    options?: {
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    }
})
```

#### Returns [User Profile](/data-types/#user-profile)

## verifyEmail

### `verifyEmail(params?): Promise()`

```ts
verifyEmail(params?: {
    code: string;
} | SubmitEvent)
```

#### Returns

```ts
what
```

## disableAccount

### `disableAccount()`

```ts
disableAccount();
```

#### Returns

## getUsers

### `getUsers(params?, fetchOptions?): Promise<DatabaseResponse>`

```ts
getUsers({ 
    params?: {
        searchFor: string;
        value: string | number | boolean;
        condition?: '>' | '>=' | '=' | '<' | '<=' | '!=' | 'gt' | 'gte' | 'eq' | 'lt' | 'lte' | 'ne';
        range?: string | number | boolean;
    } | null;
    fetchOptions?: FetchOptions
});

```

#### Returns

```ts
type DatabaseResponse = {
    list: {
        name?: string;
        email?: string;
        phone_number?: string;
        address?: string | {
            formatted: string;
            locality: string;
            region: string;
            postal_code: string;
            country: string;
        };
        gender?: string;
        birthdate?: string;
        email_public?: boolean;
        phone_number_public?: boolean;
        address_public?: boolean;
        gender_public?: boolean;
        birthdate_public?: boolean;
        misc: string;
    }[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```