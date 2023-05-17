## postRecord

### `postRecord(data, config): Promise<RecordData>`

```ts
postRecord(
    data: SubmitEvent | { [key: string] : any } | null;
    config: {
        table: {
            name: string;
            access_group?: number | 'private' | 'public' | 'authorized';  // 0 to 99 if using number. Default: 'public'
            subscription_group?: number;
        } | string;
        record_id?: string; // only used to update records
        index?: {
            name: string; 
            value: string | number | boolean;
        };
        tags: string | <string>[];
        reference?: {
            allow_multiple_reference?: boolean; // default: true
            record_id?: string;
            reference_limit?: number | null;
        };
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns [RecordData](/data-types/#recorddata)

## getRecord

### `getRecords(query, fetchOptions?): Promise<DatabaseResponse>`

```ts
getRecords(
    query: {
        table: {
            name: string,
            access_group?: number | 'private' | 'public' | 'authorized'; // 0 to 99 if using number. Default: 'public'
            subscription?: {
                user_id: string;
                group: number;
            }
        } | string;
        record_id: string;
        index: {
            name: string | '$updated' | '$uploaded' | '$referenced_count' | '$user_id';
            value: string | number | boolean;
            condition?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | '>' | '>=' | '<' | '<=' | '=' | '!='; // cannot be used with range
            range?: string | number | boolean; // cannot be used with condition
        };
        tag: string;
    };
    fetchOptions?: {
        limit?: number;
        fetchMore?: boolean;
        ascending?: boolean;
        startKey?: string;
    }
)
```
#### Returns <!-- DatabaseResponse -->

```ts
type DatabaseResponse = {
    list: RecordData[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```
See [RecordData](/data-types/#recorddata)

## deleteRecords

### `deleteRecords(params): Promise<string>`

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

## getIndex

### `getIndex(query): Promise<DatabaseResponse>`

```ts
getIndex(
    query: {
        table: string;
        index?: string;
        order?: {
            by: 'average_number' | 'total_number' | 'number_count' | 'average_bool' | 'total_bool' | 'bool_count' | 'string_count' | 'index_name';
            value?: number | boolean | string;
            condition?: Condition;
        };
    };
    fetchOptions?: {
        limit?: number;
        fetchMore?: boolean;
        ascending?: boolean;
        startKey?: string;
    }
}
```
#### Returns

```ts
type DatabaseResponse = {
    list: {
        table: string; // Table name
        index: string; // Index name
        number_of_records: number // Number of records in the index
        string_count: number // Number of string type value
        number_count: number // Number of number type value
        boolean_count: number // Number of boolean type value
        total_number: number // Sum of all numbers
        total_bool: number // Number of true(boolean) values
        average_number: number // Average of all numbers
        average_bool: number // Percentage of true(boolean) values
    }[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```

See [List](/data-types/#list)

