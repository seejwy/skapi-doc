# Database
skapi provides a lightweight, cloud-based NoSQL database service designed to be easy to use, scalable, and flexible. It is well-suited for web and mobile applications that require a data storage solution without the complexity of traditional SQL databases.

In this guide, we will cover the basics of querying and manipulating data in skapi.

## Creating a Record

The postRecord() method allows you to create a new record in the database.

```js
let newRecord = {
    myData: "Hello, I'm your data"
}

let config = {
    table: 'Collection'
}

skapi.postRecord(newRecord, config).then(record=>{
    console.log(record);
    /*
    {
        data: { myData: "Hello, I'm your data" }, // Data user had posted
        ip: "uploaders.ip.address.xxx",
        record_id: "uploaded_record_id",
        reference: { reference_limit: null, allow_multiple_reference: true, referenced_count: 0 }, // Reference settings
        table: { name: 'Host', access_group: 0 }, // Table information
        updated: 0000000000000, // Updated time in milliseconds
        uploaded: 0000000000000, // Uploaded time in milliseconds
        user_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // Uploaders UUID
    }
    */
});
```

The postRecord method takes two arguments.
The first argument is the data to be uploaded. It can be any type of object, including null or a form submit event.
And the second argument takes a configuration object.

The table property in the config object is required and specifies the name of the table where you want to store the data.
If the table does not exist, it will be created automatically when you post the record.
If a table has no records, it will be automatically deleted.
You can name your tables however you'd like, and use the table name to query the records you've posted.


## Updating a Record

The postRecord() method can also be used to update an existing record by specifying the record ID in the config.record_id field.

```js
let updatedRecord = {
    newData: "Overwritten with new data."
}

let config = {
    record_id: 'uploaded_record_id'
}

skapi.postRecord(updatedRecord, config).then(record=>{
    console.log(record);
    /*
    {
        data: { newData: "Overwritten with new data." }, // Updated data
        ip: "uploaders.ip.address.xxx",
        record_id: "uploaded_record_id",
        reference: { reference_limit: null, allow_multiple_reference: true, referenced_count: 0 }, // Reference settings
        table: { name: 'Host', access_group: 0 }, // Table information
        updated: 0000000000000, // Updated time in milliseconds
        uploaded: 0000000000000, // Uploaded time in milliseconds
        user_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" // Uploaders UUID
    }
    */
});
```

Note that if you don't specify any additional configuration parameters, the previous configurations of the record will be maintained. Only the creator of the record will have the ability to edit it.

Also, for the record data, if you give undefined you can only upload record config with out touching the previous record data.

Example:

```js
let config = {
    record_id: 'record_id_to_edit',
    table: 'NewTableName'
}

skapi.postRecord(undefined, config).then(record=>{
    console.log(record); // Table name is changed.
});
```

## Submitting Forms

The `skapi.postRecord()` method can also accept form submissions as data. This is particularly useful when you want to upload binary files. The names of the input fields in the form will serve as the key names for the corresponding values.

In case you do not use the action attribute to redirect users after a successful submission, you can include an additional response callback in the configuration to receive the response.

Here's an example of how you can use skapi with a form:
```html
<form onsubmit='skapi.postRecord(event, { table: "Collection", response: record => console.log(record) })'>
    <input name='description' />
    <input name='picture' type='file' />
    <input type='submit' value='Submit' />
</form>
```

In this example, a form is created with two input fields: `description` and `picture`. When the form is submitted, the `skapi.postRecord()` method is called with an event object and a configuration object that specifies the name of the table where the record should be stored (`Collection`) and a response callback function that logs the response to the console.

The `postRecord()` method will automatically retrieve the data from the form inputs and upload it to the specified table in the database.

## Fetching Records

The `getRecords()` method allows you to fetch records stored in the database. The example below retrieves an array of records stored in a table named 'Collection':

```js
let query = {
    table: 'Collection'
}
skapi.getRecords(query).then(response=>{
    console.log(response.list); // Array of records in table 'Collection'
    console.log(response.endOfList); // true if there are no more records to retrieve
    console.log(response.startKey); // startKey for the next set of records to retrieve
});
```

By default, `getRecords()` retrieves up to 50 records per call. The config object passed to `getRecords()` is used to specify query parameters such as the table name to retrieve records from. The response from `getRecords()` includes the array of records, `endOfList` which is a boolean indicating if there are no more records to retrieve, and `startKey` which is the key for the next set of records to retrieve.

### Fetching More Records

If you need to fetch more records than the default limit of 50, you can set the `fetchMore` parameter to `true` in the config parameter. The method will then fetch the next batch of records on every execution until it reaches the end of the list.

Below is an example of fetching 100 records per call:

``` js
let query = {
    table: 'Collection'
}

let config = {
    fetchMore: true,
    limit: 50
}

skapi.getRecords(query, config).then(response=>{
    // every execution will fetch next batch of 100 records until end of list.
    console.log(response.list);
});
```

:::warning NOTE
When using the `fetchMore` parameter, it is the developer's responsibility to check if the returned list is the last batch of data. The method will continue to fetch the next batch of data until the end of the list is reached. Once the end of the list is reached, the method will return an empty list, indicating that there are no more items to fetch.
:::

### Fetching Record by ID

You can fetch a record by its unique ID using the `getRecords` method.
Here is an example of how to retrieve a record using its ID:

```js
let query = {
    record_id: 'record_id_to_fetch'
};

skapi.getRecords(query).then(response => {
    console.log(response.list[0]); // The result will be an array with a single item.
    console.log(response.endOfList); // This will be true, as the result set is limited to the record with the specified ID.
    console.log(response.startKey); // This will be null, as no more records can be retrieved beyond the specified ID.
});
```

:::warning NOTE
When fetching a record by its ID, no other configuration parameters are necessary.
:::


## Deleting Records

The `skapi.deleteRecords()` method allows users to delete records in their tables. It accepts the following parameters:

`skapi.deleteRecords()` takes an argument as below.
```ts
type Params = {
    /** Record ID, or an array of record IDs to delete. */
    record_id?: string | string[];

    /** The name of the table to delete records from. If the `record_id` parameter is provided, this parameter is ignored. */
    table?: {
        /** The name of the table. */
        name: string;
        /** The access group of the table. */
        access_group?: number | 'private' | 'public' | 'authorized';
        /** The subscription group number (1~99) of the table. If specified, only the records posted in that group will be deleted.*/
        subscription_group?: number;
    };
}
```

Here is an example of deleting records by record ID:

```js
let query = {
    record_id: ['record_A','record_B']
};

skapi.deleteRecords(query).then(response => {
    console.log(response); // 'SUCCESS: records are being deleted. please give some time to finish the process.'
});
```

Users can delete up to 100 records at once. When deleting more than one record, the process will take some time to finish even after the user receives the response.

Users can also delete all records they posted in certain tables. Here is an example of deleting all records posted by the user in table 'A':


```js
let query = {
    table: {
        name: 'A'
    }
};

skapi.deleteRecords(query).then(response => {
    console.log(response); // 'SUCCESS: records are being deleted. please give some time to finish the process.'
});
```

Users can also delete all records they posted in certain tables with more specific targeting. Here is an example of a user deleting all records in table 'A' under access group 3 and subscription group 4.
Learn more about [Subscription](/database-advanced/#subscription) in the [Database Advanced](/database-advanced) section.

```js
let query = {
    table: {
        name: 'A'
    }
};

skapi.deleteRecords(query).then(response => {
    console.log(response); // 'SUCCESS: records are being deleted. please give some time to finish the process.'
});
```


## Indexing

When uploading records, you can set additional configurations for indexing.
For example, you can upload album data and set the released year as an index.
The index parameters include the name of the index and its value.
The name is the category to be used for indexing, and the value is the value to be searched.

```js
let album = {
    title: "Stardust",
    artist: "DIA",
    tracks: 10
};

let config = {
    table: "Albums",
    index: {
        name: "year",
        value: 2017
    }
};

skapi.postRecord(album, config);
```

You can then query albums by the released year in the "Albums" table.
Note that when fetching records, the table parameter is always required.

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: "year",
        value: 2017
    }
}).then(response => {
    console.log(response.list); // List of albums released on the specified year.
});
```

### Query Index with Conditions
In addition to querying based on a specific index value, you can also specify conditions for your query.
To do this, we first need to upload another record to our database.

```js
let record = {
    title: "Shot Shot Shot",
    artist: "Raffina",
    tracks: 1
};

let config = {
    table: "Albums",
    index: {
        name: "year",
        value: 2022
    }
};

skapi.postRecord(record, config);
```

With this additional record, we can now query for albums released after the year 2020 by including a condition parameter in the index.

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: "year",
        value: 2020,
        condition: '>'
    }
}).then(response => {
    console.log(response.list); // List of albums released after the year 2020.
    console.log(response.list[0].artist); // Raffina
});
```

The condition parameter can take the following string values:
- '>': More than the given value
- '>=': More than or equal to the given value
- '=': Equal to the given value (default)
- '<': Less than the given value
- '<=': Less than or equal to the given value

You can also use the equivalent string values of 'gt' | 'gte' | 'eq' | 'lt' | 'lte'.

The index value can be of various types such as number, string, or boolean.
The index condition works as expected with numbers and booleans,
while for strings, it uses lexicographical order to compare values.

:::warning Note
The condition '>=' (more than or equal to) acts as a 'starts with' operation for string values.
:::

:::warning Note
When querying an index, it will only return records with the same value type.
:::


### Query Index with Range
In addition to conditions, you can also retrieve records based on a range of values in the index.
To do so, simply specify the range parameter in the index object in the getRecords method.

For instance, consider the following example:

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: "year",
        value: 2015,
        range: 2020
    }
}).then(response => {
    console.log(response.list); // List of albums released from 2015 to 2020.
    console.log(response.list[0].artist); // DIA
});
```

In this example, the getRecords method will retrieve all records in the Albums table that have a "year" index value between 2015 and 2020 (inclusive). The returned records are stored in the list property of the response object.

:::warning NOTE
When using range parameter, the value and range parameter value should be of the same type.
:::

:::warning NOTE
Range can condition parameter cannot be used simultaneously.
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

## Tags

Tags are additional pieces of information that you can associate with a record.
They can help to provide a more specific search criteria in conjunction with index-based queries.
Unlike index, tags cannot be queried with conditional operators.

To add tags to a record, you can use the config.tags parameter in your postRecord call.
This parameter accepts either string or an array of strings, allowing you to add multiple tags to a single record.

Here's an example of how to add tags to a record:

```js
let record = {
    title: "Daepa calling",
    artist: "Asian Spice House",
    tracks: 5
};

let config = {
    table: "Albums",
    index: {
        name: "year",
        value: 2023
    },
    tags: ['Indie', 'Experimental']
}

skapi.postRecord(record, config);
```

And here's an example of using tags in a query:

```js
skapi.getRecord({
    table: "Albums",
    index: {
        name: "year",
        value: 2020,
        condition: '>'
    },
    tag: 'Experimental'
}).then(response=>{
    console.log(response.list); // List of albums released after 2020, that have the tag 'Experimental'.
    console.log(response.list[0].artist); // "Asian Spice House"
});
```

:::warning NOTE
It is not possible to query multiple tags in a single call.
If you need to query multiple tags, you should fetch them individually, as shown in this example:

```js
let experimental = skapi.getRecord({
    table: "Albums",
    tag: 'Experimental'
}).then(response=>{
    console.log(response.list); // List of albums that have the tag 'Experimental'.
});

let indie = skapi.getRecord({
    table: "Albums",
    tag: 'Indie'
}).then(response=>{
    console.log(response.list); // List of albums that have the tag 'Indie'.
});
```

This limitation is intentional in the design of the skapi database, as it prioritizes scalability.
:::


## Access Restrictions
You can set additional table settings by using object instead of string in the the config.table parameter.
You can set restrictions on access to the records by giving additional settings to the config.table.access_group parameter in your postRecord call.
The value of this parameter determines who can access the record.
The following values can be set for config.table.access_group:

- "private": Only the user who uploaded the record will be able to access it.
- "public": The record will be accessible to everyone.
- "authorized": The record will be accessible only to users who are logged into your service.

If the config.table.access_group parameter is not set, its default value is "public".

Here's an example of uploading both a private and a public record:

```js
let privateRecord = {
    myData: "My private data"
};

let privateConfig = {
    table: {
        name: 'Personal',
        access_group: 'private'
    }
};

skapi.postRecord(privateRecord, privateConfig).then(record => {
    console.log(record); // Only the uploader will be able to access this record.
});

let publicRecord = {
    myData: "Everyone can see this"
};

let publicConfig = {
    table: {
        name: 'Public',
        access_group: "public"
    }
};

skapi.postRecord(publicRecord, publicConfig).then(record => {
    console.log(record); // Anyone can access this record.
});
```