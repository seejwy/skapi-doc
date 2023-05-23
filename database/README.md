# Database
skapi provides a lightweight, cloud-based NoSQL database service designed to be easy to use, scalable, and flexible. It is well-suited for web and mobile applications that require a data storage solution without the complexity of traditional SQL databases.

In this guide, we will cover the basics of querying and manipulating data in skapi.

## Creating a Record

### [`postRecord(data, config):Promise<RecordData>`](/api-reference/database/#postrecord)

The `postRecord()` method is used to effortlessly **create a new record** or **update existing records** in the database.
<!-- When using this method, you need to provide `data` as the first argument, which can be an object literal, `null` or a form `SubmitEvent`. -->
<!-- The `config` parameter serves as a configuration for the record to be uploaded. -->
It takes two arguments:

- `data` (required): The data to be saved in key-value pairs. It can be an object literal, `null` or a form `SubmitEvent`.
- `config` (required): Configuration for the record to be uploaded.

### Example: Creating a Record in the Database

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
let data = { // Data to be saved in key:value pairs
    myData: "Hello World"
}

let config = {
    table: 'myTable'
}

skapi.postRecord(data, config).then(record=>{
    console.log(record);
    /*
    Returns:
    {
        data: { myData: "Hello World" },
        table: { name: 'myTable', access_group: 0 },
        ...
    }
    */
});
```

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.postRecord(event, { table: 'myTable', response: record => console.log(record) })">
    <input type="text" name="myData"/>
    <input type="submit" value="Submit" />
</form>
```

This example demonstrates a login form that uses the `login()` method to handle the form submission. The `response` callback will return the user information upon successful login. See [Working with forms](/the-basics/#working-with-forms) on how to use submit forms.

</template>
</CodeSwitcher>

In this example, we are creating a record within the `myTable` table.

See [postRecord()](/api-reference/database/#postrecord) for more information on the parameters and return values.

:::warning Note
If the specified table does not exist, it will be automatically created when you create the record. Conversely, if a table has no records, it will be automatically deleted.
:::

## Uploading Files

 skapi is designed to simplify file uploading. To upload files using the `postRecord()` method, it is *recommended* to use the `SubmitEvent` in the `data` parameter. The `name` attribute of the input fields will serve as the key name for the uploaded files.

### Example: Uploading Files using HTML Form

Here's an example demonstrating how you can upload files using skapi:

```html
<form onsubmit="skapi.postRecord(event, { table: 'Photos', response: record => console.log(record) })">
    <input name="description" />
    <input name="picture" multiple type="file" />
    <input type="submit" value="Submit" />
</form>
```
By using the `postRecord()` method, your file(s) will be uploaded under the key name `picture`. This process is handled seamlessly without any complicated file handling required.

See [Working with forms](/the-basics/#working-with-forms) for more information.

## Updating a Record

The `postRecord()` method can also be used to update an existing record. You can specify the `record_id` in the `config` object in order to do so. 

When using the `postRecord()` method to update existing records, you only need to include the parameters you want to update, along with the required `table` and `record_id` parameters. All other fields in the record will remain unchanged unless explicitly included in the method call.


### Example: Updating a Record

Here's an example that demonstrates how to update an existing record's table name using `postRecord()`:

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
let config = {
    record_id: 'uploaded_record_id'
    table: 'myNewTable'
}

skapi.postRecord(undefined, config).then(record=>{
    console.log(record);
});
```

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.postRecord(event, { record_id: 'uploaded_record_id', table: 'myNewTable', response: record => console.log(record) })">
    <input type="submit" value="Submit" />
</form>
```

This example demonstrates a login form that uses the `login()` method to handle the form submission. The `response` callback will return the user information upon successful login.

</template>
</CodeSwitcher>

When using the `postRecord()` method, any data provided in the `data` argument will overwrite the current data of the record.

### Example: Retaining Data in a Record

Here's an explanation of how to handle record data updates using the postRecord() method:

If you do not want to change the data in any way, you can pass `undefined` as the `data` argument.
```js
let config = {
  record_id: 'record_id_no_change'
};

skapi.postRecord(undefined, config).then(record => {
  console.log(record);
});
```

### Example: Changing Data in a Record

To overwrite the current data with new data, pass the updated data as the `data` argument:

<CodeSwitcher :languages="{js:'Using JavaScript',form:'Using Forms'}">
<template v-slot:js>

```js
let updatedData = {
  newData: "Overwritten with new data."
};

let config = {
  record_id: 'record_id_to_update'
};

skapi.postRecord(updatedData, config).then(record => {
  console.log(record);
});
```

</template>
<template v-slot:form>

```html
<form onsubmit="skapi.postRecord(event, { record_id: 'uploaded_record_id', table: 'myNewTable', response: record => console.log(record) })">
    <input name="newData" type="text">
    <input type="submit" value="Submit" />
</form>
```

This example demonstrates a login form that uses the `login()` method to handle the form submission. The `response` callback will return the user information upon successful login.

</template>
</CodeSwitcher>

### Example: Deleting Data in a Record
To delete the data in the record, provide `null` as the new value in the `data` argument:
```js
let config = {
  record_id: 'record_id_to_delete_data'
};

skapi.postRecord(null, config).then(record => {
  console.log(record);
});
```
:::warning Note
Please note that only the owner of the record can update a record.
:::

## Fetching Records
### [`getRecords(query, fetchOptions?): Promise<DatabaseResponse>`](/api-reference/database/#getrecords)

The `getRecords()` method allows you to fetch records from the database. It retrieves records based on the specified query parameters and returns a promise that resolves to the response containing the [DatabaseResponse](/data-types/#DatabaseResponse/) object. It takes two arguments:
- `query` (Object): Specifies the query parameters for fetching records.
- `fetchOptionsno` (Object, optional): Specifies additional configuration options for fetching records.

### Example: Fetching Records from a Table

The following example demonstrates how to use the `getRecords()` method to retrieve records from a table named 'Collection':

```js
let query = {
    table: 'Collection'
}

let fetchOptions = {
    limit: 200,
    fetchMore: true
}

skapi.getRecords(query).then(response=>{
    // response
    /**
     * endOfList: true,
     * list: [
     *  ...
     * ],
     * startKey: 'end'
     */
});
```

In this example, the `query` object specifies the table name as 'Collection'. The retrieved records are accessed through the `response.list` property. `limit` is used to increase the number of records returned to 200 and `fetchMore` is used to fetch the next batch of records.

See [FetchOptions Additional Parameters](/user-account/#fetchoptions-additional-parameters-optional) on how to use `limit` and `fetchMore`.

### Fetching Record by ID

You can fetch a record by its unique ID using the `getRecords()` method. When fetching a record by ID, you don't need to provide any additional configuration parameters.

### Example: Fetching a Record by ID

Here is an example of how to retrieve a record using its ID:

```js
let query = {
    record_id: 'record_id_to_fetch'
};

skapi.getRecords(query).then(response => {
    // response
    /**
     * endOfList: true,
     * list: [{
     *  ... // only 1 result
     * }],
     * startKey: null // startKey is null as no more records can be retrieved
     */
});
```
In this example, the `query` object includes the `record_id` property set to the ID of the record you want to fetch. The response will contain a **single** record object in the `list` property.

:::warning NOTE
When fetching a record by its ID, no other configuration parameters are necessary.
:::

## Indexing

When working with records, you can set additional configurations in the `index` property. Indexing allows you to categorize and search for records based on specific criteria. The `index` object consists of the index's `name`, used for indexing, and its corresponding `value`, which is searchable.

### Example: Configuring Indexing for Records

For example, let's consider a table of music albums. You can create an index for the `name` "year" and its corresponding `value` as the release year. This enables easier searching for music albums by release year.

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
### Querying with Index

You can fetch records based on the year `index` in the "Albums" table.

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

### Querying Index with Conditions

You can further narrow down your search using the `condition` parameter within the `index` object.

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
});
```

The `condition` parameter can take the following string values:
- `>`: Greater than the given value
- `>=`: Greater than or equal to the given value
- `=`: Equal to the given value (default)
- `<`: Less than the given value
- `<=`: Less than or equal to the given value

You can also use the equivalent string values of `gt`, `gte`, `eq`, `lt` and, `lte`, respectively.

The index value can be of type `number`, `string`, or `boolean`.
When the index value type is `number` or `boolean`, conditions work as they do with numbers. However, for `strings`, it uses lexicographical order to compare values.

For `boolean` values, `true` is represented as `1` and `false` is represented as `0`.

:::warning Note
The `condition` '>=' (more than or equal to) acts as a 'starts with' operation when searching for `string` values.
:::

:::warning Note
When querying an index, it will only return records with the same value type. '2' and 2 are different values.
:::


### Query Index with Range
In addition to conditions, you can also retrieve records based on a range of values in the index.
To do so, specify the `range` parameter in the `index` object within the `getRecords()` method.

For example, consider the following scenario:

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
});
```

In the example above, the `getRecords()` method will retrieve all records in the "Albums" table that have a "year" index value between 2015 and 2020 (inclusive).

:::warning NOTE
When using the `range` parameter, the `value` and `range` parameter values should be of the same type.
:::

:::warning NOTE
The`range` and `condition` parameter cannot be used simultaneously.
:::

### Query Index with Reserved Keywords

skapi has reserved a few keywords to help with querying your records. 
The reserved keywords are:

- `$uploaded`: The timestamp at which the record was created.
- `$updated`: The timestamp at which the record was last updated.
- `$referenced_count`: The number of records that references this record.
- `$user_id`: The owner of the record.

With the exception of `$user_id`, all of these reserved keywords can be queried with `condition` and `range` just like any other index values. $user_id cannot be queried with condition or range.

### Example: Querying Index with Reserved Keywords
For example, let's query records created after 2021:

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: '$uploaded',
        value: 1609459200, // this timestamp is 2021 January 1,
        condition: '>'
    }
}).then(response => {
    console.log(response.list); // List of albums released after 2021.
});
 
 ```

## Tags

Tags are additional information that can be associated with a record. They provide additional search criteria to perform more detailed queries, either on their own or in combination with indexes. Unlike indexes, tags cannot be queried with conditional operators.

To add tags to a record, you can use the `config.tags` parameter in the `postRecord()` method. This parameter accepts a string or an array of strings, allowing you to add multiple tags to a single record.

### Example: Adding Tags to a Record

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

### Example: Querying Records by Tag
You can also utilize tags in your queries. Here's an example:

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: "year",
        value: 2020,
        condition: '>'
    },
    tag: 'Experimental'
}).then(response=>{
    console.log(response.list); // List of albums released after 2020, that have the tag 'Experimental'.
    console.log(response.list[0].data.artist); // "Asian Spice House"
});
```

:::warning NOTE
It's not possible to query multiple tags in a single call. If you need to query multiple tags, you should fetch them individually using separate API calls. This limitation is intentional to prioritize scalability in the design of the skapi database.

For example, to query albums with the tag 'Experimental', you can use the `getRecords()` method as follows:
```js
let experimental = skapi.getRecords({
    table: "Albums",
    tag: 'Experimental'
}).then(response=>{
    console.log(response.list); // List of albums that have the tag 'Experimental'.
});

let indie = skapi.getRecords({
    table: "Albums",
    tag: 'Indie'
}).then(response=>{
    console.log(response.list); // List of albums that have the tag 'Indie'.
});
```

By fetching the tags individually, you can retrieve the desired albums based on different tags.
:::


## Access Restrictions
You can add additional settings to your `table` parameter using an object instead of a string in your `config`. This allows you to set access restrictions to records using the `access_group` parameter.

The following values can be set for `table.access_group`:

- `private`: Only owners of the record will be able to access it.
- `public`: The record will be accessible to everyone.
- `authorized`: The record will only be accessible to users who are logged into your service.

If `access_group` is not set, the default value is `public`.

### Example: Setting Access Restrictions

Here's an example that demonstrates uploading both a `private` and a `public` record:

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

## Deleting Records

### [`deleteRecords(params): Promise<string>`](/api-reference/database/#deleterecords)

The `deleteRecords()` method allows users to delete records from their tables.

The `params` object accepts the following properties:

- `record_id` (optional): A string or an array of strings representing the record IDs to delete.
- `table` (optional): An object specifying the table from which to delete records.

### Example: Deleting Records by Record IDs
Here's an example that demonstrates how to delete multiple records using an array of record IDs:
```js
let query = {
    record_id: ['record_a_record_id','record_b_record_id']
};

skapi.deleteRecords(query).then(response => {
    console.log(response); // 'SUCCESS: records are being deleted. please give some time to finish the process.'
});
```

:::warning Note
You can only delete up to 100 records at a time.
:::

You can delete all records belonging to a user from a table within an access group. 

### Example: Deleting User's Records from a Table
Here's an example of deleting all records created by the user in the "A" table with a public access group:

```js
let query = {
    table: {
        name: 'A',
        access_group: 'public'
    }
};

skapi.deleteRecords(query).then(response => {
    console.log(response); // 'SUCCESS: records are being deleted. please give some time to finish the process.'
});
```

You can pass the `subscription_group` property as an additional filter to delete specific records. 

### Example: Deleting Records with Subscription Group Filter

Here's an example of a user deleting all records in the "A" table with a public access group and only records in subscription group 4.

Learn more about [Subscription](/database-advanced/#subscription) in the [Database Advanced](/database-advanced/#database-advanced) section.

```js
let query = {
    table: {
        name: 'A',
        access_group: 'public',
        subscription_group: 4
    }
};

skapi.deleteRecords(query).then(response => {
    console.log(response); // 'SUCCESS: records are being deleted. please give some time to finish the process.'
});
```

:::warning Note
When deleting multiple records, the promise will return success immediately, but it may take some time for the deleted records to be reflected in the database.
:::