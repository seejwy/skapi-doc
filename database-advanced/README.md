# Database Advanced

In this section, we will cover advanced features for skapi database.

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


## Fetching Index

The skapi.getIndex() method can be used to retrieve information about an index, including its sum, average, and total count of records.

Here's an example of how to use skapi.getIndex():

```js
skapi.getIndex({
    table: 'Poll',
    index: 'Vote.Beer'
}).then(response => {
    console.log(response.list[0]); // Information of VoteForBeer
    /*
    {
        table: String, // Table name of the index.
        index: String, // Index name.
        average_bool: Number, // Rate of the true values of booleans.
        average_number: Number, // Average of the number type values.
        total_bool: Number, // Total number of true values of booleans.
        total_number: Number, // Total sum of the number values.
        boolean_count: Number, // Total number of records that has boolean as index value.
        number_count: Number, // Total number of record that has number as index value.
        string_count: Number, // Total number of record that has string as index value.
        number_of_records: Number, // Total number of records in the index.
    }
    */
});
```

With this example, you can fetch information about the "Vote.Beer" index of the "Poll" table, and access the various statistics about the index.


### Querying index values

If you want to list all the indexes in a table and order them in a specific order, you can use the order.by parameter in the query. For example, to list all indexes in the "Poll" table ordered by "average_bool", you can do the following:

```js
let config = {
    ascending: false
};

let query = {
    table: 'Poll',
    order: {
        by: 'average_bool'
    }
};

skapi.getIndex(query, config).then(response => {
    console.log(response.list); // List of indexes ordered from high votes.
});
```

Note that in the config object, the ascending value is set to false, so the list will be ordered from higher votes to lower votes.

If the index name is a compound index name, you can fetch only certain indexes and order them. For example, to list all indexes under "Vote." that has higher votes then 50% and order them by average_bool, you can do the following:

```js
let config = {
    ascending: false
};

let query = {
    table: 'Poll',
    index: 'Vote.',
    order: {
        by: 'average_bool',
        value: 0.5,
        condition: '>'
    }
};

skapi.getIndex(query, config).then(response => {
    console.log(response.list); // List of votes that rates higher then 50%, ordered from high votes.
});
```

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
skapi.getTables({
    table: 'MyTable'
}).then(response=>{
    console.log(response.limit); // List of all tags in table named 'MyTable'
})
```

### Quering tags

You can also query tags as below:

```js
skapi.getTables({
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

skapi database provides subscription for records.
You can provide access only to the users that subscribed to the uploader.

Lets assume user 'A' have uploaded a record as below:
```js
// User 'A' uploads record in subscription group 5.
skapi.postRecord(null, {
  table: {
    name:'Posts',
    subscription_group: 5
}})
```

Now in order for user 'B' to have access the record the user uploaded to subscription group 5,
user 'B' should subscribe to user 'A' to group 5.

Example below:
```js
// User 'B' subscribes to user 'A' to subscription group 5.
skapi.subscribe({
  user_id: 'user_id_of_user_A',
  group: 5
})
```

Now user 'B' is subscribed to user 'A'.
You should provide the group number user 'B' to be subscribed to.
The subscription group number can be between 1 ~ 99.
It can be any number as you wish.
The user will have access that uploader had uploaded to that subscription group.

Now user 'B' can fetch user 'A' uploaded to subscription group 5 as below:
```js
// User 'B' can get records in subscription group of user 'A'
skapi.getRecords({
  table: {
    name: 'Posts',
    subscription: {
        user_id: 'user_id_of_user_A',
        group: 5
    }
  }}).then(response=>{
    console.log(response.list); // All posts user 'A' uploaded to table 'Posts' as subscription group 5
});
```

:::warning Note
Although Users can block user from their subscription, subscription group is not meant to be used as database security
because any user with an account can subscribe to any other user in any subscription group.
If security is the purpose, use 'access_group' instead.
:::