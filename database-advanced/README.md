# Advanced Database Features

In this section, we will cover advanced features for indexing and access restrictions on database records.

## Indexing

When uploading records, you can set additional configurations for indexing.
For example, you can upload album data and set the released date as an index.
The index parameters include the name of the index and its value.
The name is the category to be used for indexing, and the value is the value to be searched.

```js
let album = {
    title: "Stardust",
    artist: "DIA",
    tracks: 10
};

skapi.postRecord(album, {
    table: "Albums",
    index: {
        name: "released",
        value: "2017-06-30"
    }
});
```

You can then query albums by the released date in the "Albums" table.
Note that when fetching records, the table parameter is always required.

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: "released",
        value: "2017-06-30"
    }
}).then(response => {
    console.log(response.list); // List of albums released on the specified date.
});
```

### Query Index with Conditions
In addition to querying based on a specific index value, you can also specify conditions for your query.
To do this, we first need to upload another record to our database.

```js
let album = {
    title: "Shot Shot Shot",
    artist: "Raffina",
    tracks: 1
};

skapi.postRecord(album, {
    table: "Albums",
    index: {
        name: "released",
        value: "2022-05-30"
    }
});
```

With this additional record, we can now query for albums released after the year 2020 by including a condition parameter in the index.

```js
skapi.getRecords({
    table: "Albums",
    index: {
        name: "released",
        value: "2020",
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