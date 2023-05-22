## postRecord

### `postRecord(data, config): Promise<RecordData>`

```ts
postRecord(
    data: SubmitEvent | { [key: string] : any } | null;
    config: {
        table: {
            name: string; // other than space and period, special characters are not allowed 
            access_group?: number | 'private' | 'public' | 'authorized';  // 0 to 99 if using number. Default: 'public'
            subscription_group?: number;
        } | string;
        record_id?: string; // only used when updating records
        index?: {
            name: string; // Only alphanumeric and period allowed.
            value: string | number | boolean; // Only alphanumeric and spaces allowed.
        };
        tags: string | <string>[]; // other than space and period, special characters are not allowed 
        reference?: {
            allow_multiple_reference?: boolean; // default: true
            record_id?: string;
            reference_limit?: number | null; // set to 0 to block referencing
        };
        response?(response: any): any; // callback if success
        onerror?(error: Error): any; // callback if error
    };
)
```
#### Returns [RecordData](/api-reference/data-types/#recorddata)

## getRecords

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
            condition?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | '>' | '>=' | '<' | '<=' | '=' | '!='; // cannot be used with range. Default: '='
            range?: string | number | boolean; // cannot be used with condition
        };
        tag: string;
    };
    fetchOptions?: FetchOptions;
)
```

See [FetchOptions](/api-reference/data-types/#fetch-options)

#### Returns <!-- DatabaseResponse -->

```ts
type DatabaseResponse = {
    list: RecordData[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```
See [RecordData](/api-reference/data-types/#recorddata)

## deleteRecords

### `deleteRecords(params): Promise<string>`

```ts
type Params = {
    record_id?: string | string[];
    table?: { // ignored if record_id is provided
        name: string;
        access_group?: number | 'private' | 'public' | 'authorized'; // Default = 'public'
        subscription_group?: number; // 1 to 99 only.
    };
}
```

## getIndex

### `getIndexes(query): Promise<DatabaseResponse>`

```ts
getIndexes(
    query: {
        table: string;
        index?: string;
        order?: {
            by: 'average_number' | 'total_number' | 'number_count' | 'average_bool' | 'total_bool' | 'bool_count' | 'string_count' | 'index_name';
            value?: number | boolean | string;
            condition?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | '>' | '>=' | '<' | '<=' | '=' | '!=';
        };
    };
    fetchOptions?: FetchOptions;
}
```

See [FetchOptions](/api-reference/data-types/#fetch-options)

#### Returns

```ts
type DatabaseResponse = {
    list: {
        table: string;
        index: string;
        number_of_records: number; // Number of records in the index
        string_count: number; // Number of string type value
        number_count: number; // Number of number type value
        boolean_count: number; // Number of boolean type value
        total_number: number; // Sum of all numbers
        total_bool: number; // Number of true(boolean) values
        average_number: number; // Average of all numbers
        average_bool: number; // Percentage of true(boolean) values
    }[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```

## getTables

### `getTables(query, fetchOptions?): Promise<DatabaseResponse>`

```ts
getTables(
    query: {
        table: string;
        condition?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | '>' | '>=' | '<' | '<=' | '=' | '!=';
    } | null; // pass null to get all tables
    fetchOptions?: FetchOptions;
)
```

See [FetchOptions](/api-reference/data-types/#fetch-options)

#### Returns

```ts
type DatabaseResponse = {
    list: {
        number_of_records: number; 
        table: string; 
        size: number;
    }[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```

## getTags

### `getTags(query, fetchOptions?): Promise<DatabaseResponse>`

```ts
getTags({
    query:  {
        table: string;
        tag?: string;
        condition?: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'ne' | '>' | '>=' | '<' | '<=' | '=' | '!=';
    };
    fetchOptions?: FetchOptions;
})
```

See [FetchOptions](/api-reference/data-types/#fetch-options)

#### Returns

```ts
type DatabaseResponse = {
    list: {
        table: string; // Table name
        tag: string; // Tag
        number_of_records: string; // Number records tagged
    }[];
    startKey: string;
    endOfList: boolean;
    startKeyHistory: string[];
};
```