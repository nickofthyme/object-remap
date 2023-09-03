[![Continuous Integration Tests](https://github.com/nickofthyme/object-remap/actions/workflows/ci.yml/badge.svg)](https://github.com/nickofthyme/object-remap/actions/workflows/ci.yml)

# Object Remap Action

An action designed to make object manipulation in GitHub actions just a _little_ bit easier 🤏.

## Inputs

This action uses flexible imports for users to define custom `<path>:<value>` inputs to make it easy on you. There are three defined input options that are prefixed with `__` to avoid naming collisions. All defined input options will failover to their default value if an invalid option is supplied. See all three options below.

### `__depth`

```ts
__depth?: number
```

This allows you to truncate a final remapped object to a given depth if you don't need the whole value. This impacts both the user-defined path and the defined array or object values. See the [_Simple - depth_](#simple---depth) example below

### `__case`

```ts
__case?: 'camel' | 'snake' | 'pascal' | 'upper' | 'lower' | 'kebab' = 'camel'
```

This allows you override the casing used for user-defined path inputs as well as keys of object values. By default, this `__case` is applied to all user-defined paths only. You may override user-defined object values by setting `__deep_casing` to `true`. All user-defined path inputs should use `snake_case` to define the initial paths and set `__case` accordingly. See the [_Simple - casing_](#simple---casing) example below.

| Word \ Case | `'camel'` (default) | `'snake'` | `'pascal'` | `'upper'` | `'lower'` | `'kebab'`
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| `'prop'` | `'prop'` | `'prop'` | `'Prop'` | `'PROP'` | `'prop'` | `'prop'` |
| `'multi_prop'` | `'multiProp'` | `'multi_prop'` | `'MultiProp'` | `'MULTI_PROP'` | `'multi_prop'` | `'multi-prop'` |

> **NOTE:** This table of examples assumes the path inputs are defined in `snake_case`.

### `__deep_casing`

```ts
__deep_casing?: boolean = false
```
This input allows you to control when the casing is applied to the object or array values. By default, this is `false` and will only apply the `__case` to the path inputs. If `true` the `__case` will be applied to all keys in the path and any object/array values. See the [_Simple - deep casing_](#simple---deep-casing) example below.

### User-defined inputs (e.g. `<path>:<value>`)

User-defined inputs are custom `<path>:<value>` pairs where the key represents the path of the property to set on an object in dot notation, think [`lodash.set`](https://lodash.com/docs/4.17.15#set). The individual property keys should be in `snake_case` (i.e. `path_to.some_prop`) to enable casing these _Unexpected_ inputs in the final output via [`__case`](#case), this does **NOT** apply to keys within the object or array values. See usage examples below.

This action also supports _unfiltering_ values using the `*` syntax as a wildcard for array indices (i.e. `people.*.name`). This is essentially the inverse of [Object filters](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#object-filters).

GitHub does not fully support this which is why there are some restrictions such as using `snake_case`. This same strategy is used by [`octokit/request-action`](https://github.com/marketplace/actions/github-api-request) to assign route-specific url path parameters. Because of this, you will see a warning similar to that below in your GitHub action. This is safe to ignore.

```
Warning: Unexpected input(s) 'test', 'test.one' valid inputs are ['__depth', '__case', '__deep_casing']
```

![image](https://user-images.githubusercontent.com/19007109/132143947-58b444bc-ade8-4843-869e-3210793b0f30.png)

## Outputs

There is currently only a single output value for this action.

### `json`

This output value is the final [stringified](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) object per the custom user defined `<path>:<value>` pairs.

## Usage

### Simple

You can use any type of value including `string`, `number`, `boolean` or any stringified object or array.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Simple
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          key_number: 1
          key_string: string1
          key_boolean: false
          key_array: '[1, 2, 3]'
          key_object: '{ "can-be-any-case": true }'
```

The value of `steps.test.outputs.json` would be...

```json
{
  "keyNumber": 1,
  "keyString": "string1",
  "keyBoolean": false,
  "keyArray": [1, 2, 3],
  "keyObject": { "can-be-any-case": true }
}
```

> **NOTE:** The keys of object (or array) values can be any case, which will be left unchanged by default. This can be change by setting `__deep_casing` to `true` with a different `__case`, in which case all keys in the final remapped object output will be changed to the specified `__case`.

### Simple - nested

You can use dot (`.`) separated strings to assign values to nested keys.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Simple - nested
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          top.deep.very_deep: 1
```

The value of `steps.test.outputs.json` would be...

```json
{
  "top": {
    "deep": {
      "veryDeep": 1
    }
  }
}
```

### Simple - depth

You can set `__depth` to limit the depth of the final remapped object. The default is `0` which will **NOT** alter the depth of the values.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Simple - depth
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          __depth: 2
          one: '{ "two": 2 }'
          one.too_deep: '{ "three": 3 }'
          arr: '[{ "two" : 2, "too_deep": { "three": 3 }}]'
```

The value of `steps.test.outputs.json` would be...

```json
{
  "one": {
    "two": 2,
  },
  "arr": [
    {
      "two": 2,
    }
  ]
}
```

> **Note:** the array index is **NOT** counted as a depth. Also, any empty object `{}` path will be recursively removed. Be cautious when using this with large inputs values as you may encounter the [_Argument is too long_](#argument-is-too-long) error which will throw an error before the `__depth` is ever applied.

### Simple - casing

You can set `__case` to assign the casing of the user-defined paths and object or array values. The default `__case` is `'camel'`.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Simple - casing
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          __case: kebab
          my_key.my_nested_key: 1
```

> **Note:** The case of the initial path should always be `snake_case`. This is due to a limitation with GitHub actions using flexible inputs. See [_User-defined inputs_](#user-defined-inputs-eg-pathvalue) section above.

The value of `steps.test.outputs.json` would be...

```json
{
  "my-key": {
    "my-nested-key": 1
  }
}
```

### Simple - deep casing

You can set `__case` to assign the casing of the user-defined paths.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Simple - deep casing
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          __case: upper
          __deep_casing: true
          my_key.deep: '{ "myObjectKey": { "nestedKey": 1 }}'
```

The value of `steps.test.outputs.json` would be...

```json
{
  "MY_KEY": {
    "DEEP": {
      "MY_OBJECT_KEY": {
        "NESTED_KEY": 1
      }
    }
  }
}
```

> **Note:** The `__case` is applied to both the keys included in the path **AND** the object value keys. If `__deep_casing` were instead set to `false`, the `"myObjectKey"` and `"nestedKey"` keys would be unchanged.

---

For the following _complex_ examples, let's assume that we receive the following object stored in the `.output` of a given `job` or `step` in our workflow.

```json
{
  "one": 1,
  "two": {
    "one": 1,
  },
  "three": {
    "two": {
      "one": 1,
    },
  },
  "numbers": [1, 2, 3],
  "array": [
    {
      "test": "key1",
      "deeper": {
        "deep": 1,
      },
    },
    {
      "test": "key2",
    },
  ],
}
```

Specifically, the `"Get mock test object"` step will set the above object to its output (via [`$GITHUB_OUTPUT`](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-output-parameter)) and makes it available via `steps.mock.outputs.json` in other steps.

---

### Complex - using data from other jobs/steps

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Get mock test object
        id: mock
        run: echo "json={\"one\":1,\"two\":{\"one\":1},\"three\":{\"two\":{\"one\":1}},\"numbers\":[1,2,3],\"array\":[{\"test\":\"key1\",\"deeper\":{\"deep\":1}},{\"test\":\"key2\"}]}" >> "$GITHUB_OUTPUT"
      - name: Complex values
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          test: ${{ steps.mock.outputs.json }}

```

The value of `steps.test.outputs.json` would be...

```json
{
  "test": {
    "one": 1,
    "two": {
      "one": 1,
    },
    "three": {
      "two": {
        "one": 1,
      },
    },
    "numbers": [1, 2, 3],
    "array": [
      {
        "test": "key1",
        "deeper": {
          "deep": 1,
        },
      },
      {
        "test": "key2",
      },
    ],
  }
}
```

### Complex - using _parts_ of data from other jobs/steps

Using GitHub actions [`fromJSON`](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#fromjson) utility we can pick off only _parts_ of a value to be remapped.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Get mock test object
        id: mock
        run: echo "json={\"one\":1,\"two\":{\"one\":1},\"three\":{\"two\":{\"one\":1}},\"numbers\":[1,2,3],\"array\":[{\"test\":\"key1\",\"deeper\":{\"deep\":1}},{\"test\":\"key2\"}]}" >> "$GITHUB_OUTPUT"
      - name: Complex values
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          test.value: ${{ fromJSON(steps.mock.outputs.json).two.one }} # value is just 1
```

The value of `steps.test.outputs.json` would be...

```json
{
  "test": {
    "value": 1,
  }
}
```

### Complex - _unfiltering_ value from _filtered_ data

GitHub actions have a special syntax called [Object filters](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#object-filters) which allows you to pull off individual values from a nested array of objects.

To help leverage this syntax, we added the idea of _unfiltering_, which as you'd expect, reverses an array of values into a specified key.

```yml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Get mock test object
        id: mock
        run: echo "json={\"one\":1,\"two\":{\"one\":1},\"three\":{\"two\":{\"one\":1}},\"numbers\":[1,2,3],\"array\":[{\"test\":\"key1\",\"deeper\":{\"deep\":1}},{\"test\":\"key2\"}]}" >> "$GITHUB_OUTPUT"
      - name: Complex values
        id: test # used to access output in other steps
        uses: nickofthyme/object-remap@v1
        with:
          test.*.key: ${{ fromJSON(steps.mock.outputs.json).array.*.test }} # value is just ['key1', 'key2`]
```

> **Note:** This is limited to a single `*` in the path. Attempting to pass multiple `*` in a path (e.g. `my.*.key.*.prop`) will cause undesirable effects.

The value of `steps.test.outputs.json` would be...

```json
{
  "test": [
    {
      "key": "test1",
    },
    {
      "key": "test2",
    }
  ]
}
```

## Motivation

While developing my first GitHub action workflow, I realized how difficult it is to take an object from one step and manipulate it for use in another step. This could take the form of any verbose and overly complex bash, python or any other [allowable shell](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#using-a-specific-shell) script. That's assuming you find the correct way to pass and parse the desired inputs to your script accounting for line returns and special escaped characters.

Coming from javascript, this was very frustrating so I created this action.

This difficulty came about while attempting to create a job strategy [`matrix`](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idstrategymatrix) from the response of a GitHub api request. I envisioned something similar to the [stackoverflow example](https://stackoverflow.com/a/62953566/6943587), easy right, but nesting the GH api response into the `include` key was much harder than I expected. Below is this part of the final workflow using this action to easily assign the desired matrix values.

```yml
name: 'Validate PRs'

on:
  schedule:
    - cron:  '0 0 * * *' # once a day

jobs:
  fetch:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.save.outputs.json }}
    steps:
      - name: Get open pull requests
        id: fetch
        uses: octokit/request-action@v2.x
        with:
          route: GET /repos/{repo}/pulls?state=open
          repo: ${{ github.repository }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Create matrix
        id: save
        uses: nickofthyme/object-remap@v1
        with:
          include.*.number: ${{ toJSON(fromJSON(steps.fetch.outputs.data).*.number) }}
          include.*.sha: ${{ toJSON(fromJSON(steps.fetch.outputs.data).*.head.sha) }}

  update-check:
    name: "Checking PR #${{ matrix.number }}"
    runs-on: ubuntu-latest
    needs: fetch
    strategy:
      matrix: ${{ fromJSON(needs.fetch.outputs.matrix) }}
    steps:
      - name: Do something cool...
```

## Limitations

Aside from the obvious limitations to assign values in any way you desire, including assigning values to array indices, the following limitations are unavoidable.

### Argument is too long

There is a limit to the character length of the arguments you can pass to any GitHub action. I'm not sure what the exact limit is and it likely varies by machine but this is unavoidable. The error will look something like...

```
Error: Argument list too long
```

![image](https://user-images.githubusercontent.com/19007109/132149632-40fff6dd-4de6-46ff-a42c-cb7e5cc1fdfb.png)

This limit is easily exceeded by the full `output` of verbose api requests. In such a case, you could possibly limit the count received from the api request or use [Object filters](https://docs.github.com/en/actions/reference/context-and-expression-syntax-for-github-actions#object-filters) to pluck and assign only the values you need. For example...

```yml
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Fetch GH pull requests
        id: fetch
        uses: octokit/request-action@v2.x
        with:
          route: GET /repos/{repo}/pulls?state=open
          repo: ${{ github.repository }}
        env:
          GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}"
      - name: Store matrix
        id: save
        uses: nickofthyme/object-remap@v1
        with:
          include.*.number: ${{ toJSON(fromJSON(steps.fetch.outputs.data).*.number) }}
          include.*.head_sha: ${{ toJSON(fromJSON(steps.fetch.outputs.data).*.head.sha) }}
          include.*.base_sha: ${{ toJSON(fromJSON(steps.fetch.outputs.data).*.base.sha) }}
```

## Troubleshooting

All defined input options (i.e. `__case`, `__depth` & `__deep_casing`) will failover to their default value if an invalid option is supplied. If you experience unanticipated outputs based on the inputs you provided see `warnings` in the GitHub action logs to make sure the correct inputs are used. Ignore the warning mentioned in [User-defined inputs](#user-defined-inputs-eg-pathvalue) section.

In addition, this action will always log the parsed user-defined `Inputs` including `path`, `type` and `value`, as well as the final remapped `Output` to enable easy troubleshooting. These logs would look something like...

```
--------- Inputs ---------
path: number
type: number
value: 21
--------------------------
path: string
type: string
value: "a string"
--------------------------
path: yes
type: boolean
value: true
--------------------------
path: no
type: boolean
value: false
--------------------------
path: arr
type: array
value: ["one","two"]
--------------------------
path: obj
type: object
value: {"one":1}
--------- Output ---------
Remapped json:
{
  "number": 21,
  "string": "a string",
  "yes": true,
  "no": false,
  "arr": [
    "one",
    "two"
  ],
  "obj": {
    "one": 1
  }
}
```

## Contributing

I am happy to make changes based on issue requests. Or feel free to contribute yourself, see [`CONTRIBUTING.md`](CONTRIBUTING.md).
