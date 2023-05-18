## subscribe

### `subscribe(option): Promise<string>`

```ts
subscribe(
    {
        user_id: string;
        group: number; // From 0 to 99.
    }
)
```
#### Returns

```ts
'SUCCESS: the user has subscribed.'
```

## unsubscribe

### `unsubscribe(option): Promise<string>`

```ts
unsubscribe(
    {
        user_id: string;
        group: number; // From 0 to 99.
    } | '*'
)
```
#### Returns

```ts
'SUCCESS: the user has unsubscribed.'
```

## blockSubscriber

### `blockSubscriber(option): Promise<string>`

```ts
blockSubscriber(
    {
        user_id: string;
        group: number | '*'; // From 0 to 99 or '*'.
    } | '*'
)
```
#### Returns

```ts
'SUCCESS: blocked user id "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".'
```

## unblockSubscriber

### `unblockSubscriber(option): Promise<string>`

```ts
unblockSubscriber(
    {
        user_id: string;
        group: number | '*'; // From 0 to 99 or '*'.
    } | '*'
)
```
#### Returns

```ts
'SUCCESS: unblocked user id "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".'
```

## getSubscriptions

### `getSubscriptions(params, fetchOptions?): Promise<DatabaseResponse>`

```ts
getSubscriptions(
    {
        params: {
            subscriber?: string; // Must use subscriber and/or subscription
            subscription?: string;
            group?: number | '*'; // Default: '*'
            blocked?: boolean; // Default: false
        },
        fetchOptions?: FetchOptions;
    } | '*'
)
```

See [FetchOptions](/data-types/#fetch-options)

#### Returns

```ts
type DatabaseResponse = {
    list: {
        subscriber: string;
        subscription: string;
        group: number;
        timestamp: number;
        blocked: boolean;
    }[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```







