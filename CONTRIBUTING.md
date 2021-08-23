## Code in `master`

> First, you'll need to have a reasonably modern version of `node` handy. This won't work with versions older than 9, for instance.

Install dependencies

```bash
npm install
```

Build the typescript then package it for distribution
```bash
npm run build && npm run package
```

Run the tests :heavy_check_mark:

```bash
npm test

 PASS  src/utils.test.ts
 PASS  src/main.test.ts
 PASS  src/inputs.test.ts
 PASS  src/mappings.test.ts

Test Suites: 4 passed, 4 total
Tests:       420 passed, 420 total
Snapshots:   0 total
Time:        2.5 s, estimated 3 s
Ran all test suites.
```
