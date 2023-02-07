# Database Basic

skapi provides an auto-indexed scalable database storage solution.
Records are the unit of data stored in the database.
In this section, you'll learn how to create, update and fetch records.

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
    record_id: 'record_id_to_edit'
}

skapi.postRecord(updatedRecord, config).then(record=>{
    console.log(record);
});
```

Note that if you don't specify any additional configuration parameters, the previous configurations of the record will be maintained. Only the creator of the record will have the ability to edit it.

## Submitting Forms

The skapi.postRecord() method can also accept form submissions as data. This is particularly useful when you want to upload binary files. The names of the input fields in the form will serve as the key names for the corresponding values.

In case you do not use the action attribute to redirect users after a successful submission, you can include an additional response callback in the configuration to receive the response.

Here's an example of how you can use skapi with a form:
```html
<form onsubmit='skapi.postRecord(event, { table: "Collection", response: record => console.log(record); })'>
    <input name='description' />
    <input name='picture' type='file' />
    <input type='submit' value='Submit' />
</form>
```

## Fetching Records

The getRecords() method allows you to fetch records stored in the database.
The example below retrieves an array of records stored in a table named 'Collection':

```js
let config = {
    table: 'Collection'
}
skapi.getRecords(config).then(response=>{
    console.log(response.list); // Array of records in table 'Collection'
    console.log(response.endOfList); // true if there are no more records to retrieve
    console.log(response.startKey); // startKey for the next set of records to retrieve
});
```

By default, getRecords() retrieves up to 100 records per call.
The config object passed to getRecords() is used to specify query parameters such as the table name to retrieve records from.
The response from getRecords() includes the array of records, endOfList which is a boolean indicating if there are no more records to retrieve, and startKey which is the key for the next set of records to retrieve.


### Fetching Record by ID

You can fetch a record by its unique ID using the getRecords method.
Here is an example of how to retrieve a record using its ID:

```js
let config = {
    record_id: 'record_id_to_fetch'
};

skapi.getRecords(config).then(response => {
    console.log(response.list[0]); // The result will be an array with a single item.
    console.log(response.endOfList); // This will be true, as the result set is limited to the record with the specified ID.
    console.log(response.startKey); // This will be null, as no more records can be retrieved beyond the specified ID.
});
```
:::warning NOTE
When fetching a record by its ID, no other configuration parameters are necessary.
:::