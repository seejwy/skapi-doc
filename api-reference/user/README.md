## signup

### `signup(params, options?): Promise<User | string>`

```ts
signup(
    params: { 
        name?: string;
        email: string; // Max 64 characters.
        password: string; // At least 6 characters and a maximum of 60 characters.
        phone_number?: string; // Must be in "+0012341234" format.
        address?: string; // or you can use OpenID Standard Claims https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
        gender?: string;
        birthdate?: string; // Must be in YYYY-MM-DD format
        email_public?: boolean; // Default = false
        phone_number_public?: boolean; // Default = false
        address_public?: boolean; // Default = false
        gender_public?: boolean; // Default = false
        birthdate_public?: boolean; // Default = false
        misc: string; // Additional string value that can be used freely.
    } | SubmitEvent;
    options?: {
        signup_confirmation?: boolean | string; // Default = false
        email_subscription?: boolean; // Default = false
        login?: boolean; // Cannot be true with signup_confirmation. // Default = false
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns

```ts
// when options.login is true, return User
User
| "SUCCESS: The account has been created. User's signup confirmation is required." 
| "SUCCESS: The account has been created."
```

See [User](/api-reference/data-types/#user)

### Errors
```ts
{
  code: 'EXISTS';
  message: "user already exists.";
}
```

## resendSignupConfirmation

### `resendSignupConfirmation(redirect?): Promise<string>`

```ts
resendSignupConfirmation(
    redirect?: string;
)
```
#### Returns

```ts
'SUCCESS: Signup confirmation E-Mail has been sent.'
```

See [User](/api-reference/data-types/#user)

### Errors
```ts
{
  code: 'INVALID_REQUEST',
  message: 'Least one login attempt is required.' | '"Url" is an invalid url.'
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
    options?: {
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns [User](/api-reference/data-types/#user)

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

### `getProfile(options?): Promise<User | null>`

```ts
getProfile(
    options?: {
        refreshToken: boolean;
    }
)
```

#### Returns [User](/api-reference/data-types/#user)

## logout

### `logout(): Promise<string>`

#### Returns
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
    options?: {
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
        new_password: string; // At least 6 characters and a maximum of 60 characters.
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
    new_password: string; // At least 6 characters and a maximum of 60 characters.
    current_password: string;
});
```

#### Returns

```ts
`SUCCESS: Password has been changed.`
```

## updateProfile

### `updateProfile(params, options?): Promise<UserProfile>`

```ts
updateProfile(
    params: {
        name?: string;
        email?: string; // Max 64 characters.
        phone_number?: string; // Must be in "+0012341234" format.
        address?: string; // or you can use OpenID Standard Claims https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
        gender?: string;
        birthdate?: string; // Must be in YYYY-MM-DD format
        email_public?: boolean;
        phone_number_public?: boolean;
        address_public?: boolean;
        gender_public?: boolean;
        birthdate_public?: boolean;
        misc: string; // Additional string value that can be used freely.
    } | SubmitEvent;
    options?: {
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    }
)
```

#### Returns [User Profile](/api-reference/data-types/#user-profile)

## verifyEmail

### `verifyEmail(params?): Promise(string)`

```ts
verifyEmail(params?: {
    code: string;
} | SubmitEvent)
```

#### Returns

```ts
'SUCCESS: Verification code has been sent.' 
| 
'SUCCESS: "email" is verified.'
```

## disableAccount

### `disableAccount(): Promise(string)`

```ts
disableAccount();
```

#### Returns 
```ts
'SUCCESS: account has been disabled.'
```

## getUsers

### `getUsers(params?, fetchOptions?): Promise<DatabaseResponse>`

```ts
getUsers({ 
    params?: {
        searchFor: string;
        value: string | number | boolean;
        condition?: '>' | '>=' | '=' | '<' | '<=' | '!=' | 'gt' | 'gte' | 'eq' | 'lt' | 'lte' | 'ne'; // Cannot be used with range. Default = '='
        range?: string | number | boolean; // Cannot be used with condition.
    } | null;
    fetchOptions?: FetchOptions
});

```

See [FetchOptions](/api-reference/data-types/#fetch-options)


#### Returns

```ts
type DatabaseResponse = {
    list: {
        name?: string;
        email?: string;
        phone_number?: string;
        address?: string; // or OpenID Standard Claims object https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
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