# Database Advanced

In this section, we will cover advanced features for skapi database.

## Fetching Tables

You can fetch list of table as below:

```js
skapi.getTables().then(response=>{
    console.log(response.limit); // List of all tables in the database
})
```

### Quering tables

You can also query table names as below:

```js
skapi.getTables({
    table: 'A',
    condition: '>'
}).then(response => {
    console.log(response.limit); // Table names starting with 'A'
})
```

## Fetching Tags

You can fetch list of tags as below:

```js
skapi.getTag({
    table: 'MyTable'
}).then(response=>{
    console.log(response.limit); // List of all tags in table named 'MyTable'
})
```

### Quering tags

You can also query tags as below:

```js
skapi.getTag({
    table: 'MyTable',
    tag: 'A',
    condition: '>'
}).then(response=>{
    console.log(response.limit); // List of all tags starting with 'A' in table named 'MyTable'
})
```

## Referencing

You can reference another record when uploading a new record, which can be useful when building features such as a comments section, a poll, or a message box. To reference a record, you'll need to specify the record_id of the record you want to reference in the reference parameter in the config object.

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

Now you can query all the records that reference the original post as follows:

```js
skapi.getRecord({
    table: 'Comments',
    reference: { record_id: 'record_id_of_the_original_post' }
}).then(response => {
    console.log(response.list);  // Array of comments on the original post
});
```

:::tip NOTE
You can reference a record that references other records, which allows you to build a Reddit-like comment board easily.
:::

### Removing a reference

To remove a reference, simply set the record_id value in the reference parameter to null when updating the record.

```js
skapi.postRecord(undefined, {
    record_id: 'record_id_of_the_comment_to_edit',
    reference: { record_id: null }
}).then(record => {
    console.log(record);  // The reference has been removed.
});
```

### Reference settings

When uploading a record, you can control the behavior of references by specifying parameters in the options object. The following parameters are available:

reference.allowed_references: The maximum number of references that can be created for a given record. If this parameter is set to null, the number of references is unlimited. The default value is null.

reference.allow_multiple_reference: If set to false, a user will not be able to post multiple references to the same record. If set to true, a user will be able to post multiple references. The default value is true.

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

Note that the vote value uses the index and boolean types, so you can later calculate the average vote value.


## Subscription
skapi database provides subscription for records. You can use subscriptions to provide access only to users who have subscribed to the uploader.

To create a subscription group, the uploader specifies a group number between 1 and 99 when uploading a record:
```js
// User 'A' uploads record in subscription group 5.
skapi.postRecord(null, {
  table: {
    name:'Posts',
    subscription_group: 5
}})
```

To allow other users to access the records in the subscription group, they must first subscribe to the uploader:

```js
// User 'B' subscribes to user 'A' to subscription group 5.
skapi.subscribe({
  user_id: 'user_id_of_user_A',
  group: 5
})
```

Once a user has subscribed to another user in a particular subscription group, they can fetch the records in that group:

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

Users can unsubscribe from the users they have subscribed to:

```js
// User 'B'
skapi.unsubscribe({
    user_id: 'user_id_of_user_A',
    group: 1
})
```

Users can also unsubscribe from all groups by passing the `'*'` wildcard character in the group parameter:

```js
// User 'B'
skapi.unsubscribe({
    user_id: 'user_id_of_user_A',
    group: '*'
})
```


## Blocking subscribers

Users can block certain users from their subscription groups. If a user is blocked from a subscription group, they will not have access to the records in that group.

To block a subscriber, the user can call the `blockSubscriber` method:

```js
// User A
skapi.blockSubscriber({
    user_id: 'user_id_of_user_B',
    group: '*'
})
```

To unblock a subscriber, the user can call the unblockSubscriber method:

```js
// User A
skapi.unblockSubscriber({
    user_id: 'user_id_of_user_B',
    group: '*'
})
```

:::warning Note
Although Users can block user from their subscription, subscription group is not meant to be used as database security
because any user with an account can subscribe to any other user in any subscription group.
If security is the purpose, use 'access_group' instead.
:::


## Listing subscriptions

`skapi.getSubscriptions` retrieves subscription information from the database.

### Parameters
- Params (object, required): An object that contains the following properties:
    - subscriber (string): The user ID of the subscriber.
    - subscription (string): The user ID of the subscription.
    - group (number | string): The subscription group number to retrieve, or "*" to retrieve all groups. Defaults to all groups.
    - blocked (boolean): Whether to retrieve blocked subscriptions or not.
- FetchOptions (object): An object that contains the following properties:
    - limit (number): The maximum number of records to retrieve.
    - fetchMore (boolean): Whether to fetch the next batch of records or not.
    - ascending (boolean): Whether to sort the records in ascending or descending order.
    - startKey (string): The start key to use when fetching the next batch of records.

```js
// Retrieve all subscriptions for a given subscriber
skapi.getSubscriptions({
  subscriber: "userA"
}).then((response) => {
  console.log(response.list); // An array of subscription records for userA
});

// Retrieve all subscriptions for a given subscription
skapi.getSubscriptions({
  subscription: "userB"
}).then((response) => {
  console.log(response.list); // An array of subscription records for userB
});

// Retrieve subscriptions for a given subscriber and group
skapi.getSubscriptions({
  subscriber: "userA",
  group: 2,
}).then((response) => {
  console.log(response.list); // An array of subscription records for userA in group 2
});

// Retrieve blocked subscriptions for a given subscriber and group
skapi.getSubscriptions({
  subscriber: "userA",
  group: 2,
  blocked: true,
}).then((response) => {
  console.log(response.list); // An array of blocked subscription records for userA in group 2
});

// Check if userA is subscribed to userB in group 1
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

When uploading a record, you can make use of compound index names to have more control over querying the records. This makes it easier to search and retrieve records based on specific criteria.

In the example below, we are uploading an album record with a compound index name:

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

In this example, we have created a compound index name by combining the artist type, artist name, and "year" and joining these elements with a period. The value for the index is set to the "year" value of 2023.

Using compound index names, you can easily query records by artist type, artist name, or release year.

For example, you can query all albums by a band using the following code:

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

In this example, the query includes a period at the end of the index name, 'Band.'. This allows you to query the next hierarchy of the compound index name as a string value. Since the value is an empty string and the condition is set to "more than", this will retrieve all records that fall under the index name of 'Band.'.

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
    console.log(response.list); // All albums by a band name starting with 'Asian'
})
```

In this example, the value of the index is set to "Asian" and the condition is set to "more than or equal". This allows you to query all artist names starting with "Asian" under the "Band." category.

Lastly, you can query the band Asian Spice House albums by release year as follows:

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
It is important to note that when querying the records with a compound index, you need to specify the full hierarchy of the index in order to obtain the desired results. In the example you provided, you cannot simply query all the albums that were released in a certain year without specifying the band name, which is the second hierarchy of the compound index name. In order to achieve that, you would need to restructure your index.
:::