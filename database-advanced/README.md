# Database Advanced

In this section, we will cover advanced features for skapi database.

## Fetching Tables

### [`getTable(query, fetchOptions?): Promise<DatabaseResponse>`](/api-reference/database/#gettable)

You can fetch a list of table using the `getTable()` method.

```js
skapi.getTable().then(response=>{
    console.log(response.limit); // List of all tables in the database
})
```

### Quering tables

You can query table names that meet a `condition`.

```js
skapi.getTable({
    table: 'C',
    condition: '>'
}).then(response => {
    console.log(response.limit); // Table names starting from 'A'
})
```

In this example, the query object is passed as an argument to the getTable() method. The condition property is set to '>', and the table property is set to 'C'.  This query will return the table names that come after table 'C' in alphabetical order, such as 'D', 'E', 'F', 'G', and so on.

## Fetching Tags

### [`getTag(query, fetchOptions?): Promise<DatabaseResponse>`](/api-reference/database/#gettag)

You can fetch all tags used in a table with `getTag()`.

```js
skapi.getTag({
    table: 'MyTable'
}).then(response=>{
    console.log(response.limit); // List of all tags in table named 'MyTable'
})
```

### Quering tags

You can also query tags that meet a `condition`.

```js
skapi.getTag({
    table: 'MyTable',
    tag: 'A',
    condition: '>'
}).then(response=>{
    console.log(response.limit); // List of all tags starting from 'A' in table named 'MyTable'
})
```

## Referencing

You can reference another record in your records. Referencing is useful when you want to point your record to an existing record. Think of it as a "1 : many" relationship in a relational database. To reference a record, you'll need to specify the `record_id` of the record you want to reference in the `reference` parameter in the `config` object.

### Example: Uploading a Record to be Referenced and Creating a Referencing Record
Here's an example of uploading a record to be referenced and another record that references it:

```js
let referencedRecord = {
    post: "What do you think of this post?"
};

let referencedConfig = {
    table: 'Posts'
};

let originalPostId;

skapi.postRecord(referencedRecord, referencedConfig).then(response => {
    // The original post has been uploaded. Now, users can upload another record that references it.
    originalPostId = response.record_id;  // Record ID of the original post

    let commentRecord = {
        comment: "I like it!"
    };

    let commentConfig = {
        table: 'Comments',
        reference: { record_id: originalPostId }
    };

    skapi.postRecord(commentRecord, commentConfig);
});
```

Now you can query all the records that references the original record by passing the record ID:

```js
skapi.getRecord({
    table: 'Comments',
    reference: 'record_id_of_the_original_post'
}).then(response => {
    console.log(response.list);  // Array of comments on the original post
});
```

You can even query all the records posted by a user using the user's ID.

```js
skapi.getRecord({
    table: 'Comments',
    reference: 'user_id_whose_post_you_want'
}).then(response => {
    console.log(response.list);  // Array of comments posted by a user
});
```

:::tip Hint
You can easily build a discussion board similar to Reddit by chaining your referenced records.
:::

### Removing a reference

To remove a reference, set the the `reference.record_id` parameter to `null` when updating the record.

### Example: Removing a Reference

```js
skapi.postRecord(undefined, {
    record_id: 'record_id_of_the_comment_to_edit',
    reference: { record_id: null }
}).then(record => {
    console.log(record);  // The reference has been removed.
});
```

### Reference settings

When uploading records, you can set restrictions on referencing using the following parameters:

### Example: Setting Reference Settings

```ts
{
    ...
    reference: {
        allowed_references: number;
        allow_multiple_reference: boolean;
    }
    ...
}

```
`allowed_references`: The maximum number of references that can be created for a given record. If this parameter is set to null, the number of references is unlimited. The default value is `null`.

:::tip Hint
Set `allowed_references` to `0` to prevent referencing.
 :::

`allow_multiple_reference`: If set to `false`, a user will be able to post only one reference to the same record. If set to `true`, a user will be able to post multiple references. The default value is `true`.

### Example: Creating a Poll with Restricted Referencing

For example, you can use these parameters to build a poll where only 10 people are allowed to vote and each user can only vote once. The following code demonstrates how to create such a poll:

```js
skapi.postRecord({
    title: "Should we have a beer fridge in our office?",
    description: "Only 10 people are allowed to vote"
}, {
    table: 'Poll',
    reference: {
        allow_multiple_reference: false,
        allowed_references: 10
    }
}).then(record => {
    console.log(record);
    // Now only 10 people can post references for this record
    skapi.postRecord({
        comment: "Yes, we should!"
    }, {
        table: 'Poll',
        reference: { record_id: record.record_id },
        index: {
            name: 'Vote.Beer',
            value: true
        }
    });
});
```

Note that the "Vote.Beer" `index` uses a `value` of type `boolean` so you can later calculate the average vote value.


## Subscription

### [`subscribe(option): Promise<User | string>`](/api-reference/subscription/#subscribe)

skapi database provides `subscription_group` in its records. You can use `subscription_group` to restrict access to the record only to users who have subscribed to the uploader.

To create a subscription group, specify a `subscription_group` between 1 and 99 when uploading a record.

### Example: Subscribing to a User's Subscription Group

```js
// User 'A' uploads record in subscription group 5.
skapi.postRecord(null, {
  table: {
    name:'Posts',
    subscription_group: 5
}})
```

To allow other users to access the records in a subscription group, they must first subscribe to that subscription group of the uploader using the `subscribe()` method.

```js
// User 'B' subscribes to user 'A' to subscription group 5.
skapi.subscribe({
  user_id: 'user_id_of_user_A',
  group: 5
})
```

Once a user has subscribed to the subscription group of a user, they will have access to the records in that subscription group.

### Example: Retrieving Records from a Subscription Group

```js
// User 'B' can get records in subscription group 5 of user 'A'
skapi.getRecords({
  table: {
    name: 'Posts',
    subscription: {
        user_id: 'user_id_of_user_A',
        group: 5
    }
  }
}).then(response => {
    console.log(response.list); // All posts user 'A' uploaded to table 'Posts' as subscription group 5
});
```

### Unsubscribing

### [`unsubscribe(option): Promise<User | string>`](/api-reference/subscription/#unsubscribe)

Users can unsubscribe from the users they have subscribed to using the `unsubscribe()` method.

### Example: Unsubscribing from a User's Subscription Group

```js
// User 'B'
skapi.unsubscribe({
    user_id: 'user_id_of_user_A',
    group: 1
})
```

Users can also unsubscribe from all groups by passing the `'*'` wildcard character in the group parameter.

### Example: Unsubscribing from All Groups

```js
// User 'B'
skapi.unsubscribe({
    user_id: 'user_id_of_user_A',
    group: '*'
})
```

## Blocking and Unblocking Subscribers

### [`blockSubscriber(option): Promise<string>`](/api-reference/subscription/#blockSubscriber)
### [`unblockSubscriber(option): Promise<string>`](/api-reference/subscription/#unblockSubscriber)

Users can block certain users from their subscription groups. If a user is blocked from a subscription group, they will not have access to the records in that group.

To block a subscriber, use the `blockSubscriber()` method:

### Example: Blocking a Subscriber

```js
// User A
skapi.blockSubscriber({
    user_id: 'user_id_of_user_B',
    group: '*'
})
```

To unblock a subscriber, use the `unblockSubscriber()` method:

### Example: Unblocking a Subscriber

```js
// User A
skapi.unblockSubscriber({
    user_id: 'user_id_of_user_B',
    group: '*'
})
```

:::warning Note
Although users can use `subscription_group` to restrict their records, it should not be used as a layer of security. The `subscribe()` method is accessible to all users. If you want to securely set your records private, use `access_group` instead. Refer to [Access Restrictions](/database/#access-restrictions)
:::


## Listing subscriptions

### [`getSubscriptions(params, fetchOptions?): Promise<DatabaseResponse>`](/api-reference/subscription/#getsubscriptions)

The `getSubscriptions()` method retrieves subscription information from the database.
<!-- 
### Parameters
- Params (object, required): An object that contains the following properties:
    - subscriber (string): The user ID of the subscriber.
    - subscription (string): The user ID of the uploader.
    - group (number | string): The subscription group number to retrieve, or "*" to retrieve all groups. Defaults to all groups.
    - blocked (boolean): Set to `true` to only retrieve blocked subscriptions.
- FetchOptions (object): An object that contains the following properties:
    - limit (number): The maximum number of users to retrieve.
    - fetchMore (boolean): Set to `true` to fetch the next batch of subscriptions.
    - ascending (boolean): Set to `true` to sort the records in ascending order.
    - startKey (string): The start key to use when fetching the next batch of records. -->

### Examples

```js
// Retrieve all subscription information where userA is the subscriber
skapi.getSubscriptions({
  subscriber: "userA"
}).then((response) => {
  console.log(response.list); // An array of subscription information
});

// Retrieve all subscription information where userB is being subscribed to
skapi.getSubscriptions({
  subscription: "userB"
}).then((response) => {
  console.log(response.list); // An array of subscription information
});

// Retrieve subscription information where userA is the subscriber and subscription group is 2
skapi.getSubscriptions({
  subscriber: "userA",
  group: 2,
}).then((response) => {
  console.log(response.list); // An array of subscription information
});

// Retrieve all subscription information where userA is a subscriber and subscription group is group 2 and userA is blocked
skapi.getSubscriptions({
  subscriber: "userA",
  group: 2,
  blocked: true,
}).then((response) => {
  console.log(response.list); // An array of blocked subscription records
});

// Check if userA is subscribed to userB in group 2
skapi.getSubscriptions({
  subscriber: "userA",
  subscription: "userB",
  group: 2
}).then((response) => {
  console.log(response.list?[0]); // subscription information if subscribed
});
```

:::warning Note
Either the subscriber or subscription parameter must be provided in the Params object. If neither is provided, an error will occur.
:::

## Compound Index Names

When posting records, you can use compound index names to have more control over querying the records. This makes it easier to search and retrieve records.

### Example: Uploading a Record with Compound Index Name

In the example below, we are uploading a record with a compound index name:

```js
let album_data = {
    title: "Daepa calling",
    tracks: 5
};

skapi.postRecord(album_data, {
    table: 'Album',
    index: {
        name: 'Band.AsianSpiceHouse.year',
        value: 2023
    }
})
```

In this example, we have created a compound index name by joining the artist type, artist name, and "year" with a period. The `value` for the `index` is set to the "year" value of 2023.

Using compound index names, you can easily query records by artist type, artist name, or release year.


### Example: Querying Albums with Top Level Compound Index

For example, you can query all albums performed by a band using the following code:

```js
skapi.getRecords({
    table: 'Album',
    index: {
        name: 'Band.',
        value: '',
        condition: '>'
    }
}).then(response=>{
    console.log(response.list); // All albums by a band.
})
```

In this example, the query includes a period at the end of the index `name`, 'Band.'. This allows you to query the following index of the compound index name as a `string` value. Since the `value` is an empty string and the condition is set to "more than", this will retrieve all records where the index `name` begins with 'Band.'.

### Example: Querying Albums with Child Level Compound Index Name

You can also query albums by artist name. For example, you can query all albums by artist names starting with "Asian" like this:

```js
skapi.getRecords({
    table: 'Album',
    index: {
        name: 'Band.',
        value: 'Asian',
        condition: '>='
    }
}).then(response=>{
    console.log(response.list); // All albums by bands with a name starting with 'Asian'
})
```

In this example, the `value` of the index is set to "Asian" and the `condition` is set to "more than or equal". This allows you to query all artist names starting with "Asian" where the index `name` begins with "Band."

### Example: Querying Albums with Full Compound Index Name

Finally, you can query the band Asian Spice House albums by release year as follows:

```js
skapi.getRecords({
    table: 'Album',
    index: {
        name: 'Band.AsianSpiceHouse.year',
        value: 2023
    }
}).then(response=>{
    console.log(response.list); // All albums by Asian Spice House released in 2023.
})
```

:::warning Note
It is important to note that when querying the records with a compound index, you need to specify the index respecting the hierarchy of the compound index name. In the example provided, you cannot simply use `Band.year` as an index name. You must provide the full `Band.AsianSpiceHouse.year` index.
:::