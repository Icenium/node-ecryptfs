# node-ecryptfs

Provides limited set of ecryptfs api for Node.js

### Installation

### Mount 

```javascript
const ecryptfs = require('node-ecryptfs');
ecryptfs.mount('./private', './private', {  
    // Specify the symmetric cipher to be used on a per file basis  
    encryption: 'aes',
    // Specify the keysize to be used with the selected cipher.
    ecryptfsKeyBytes: 16,
    // Specify whether filename encryption should be enabled.
    ecryptfsEnableFilenameCrypto: 'n',
    // Allows for non-eCryptfs files to be read and written from 
    // within an eCryptfs mount. This option is turned off by default.
    ecryptfsPassthrough: 'y',
    // The password is specified through the file descriptor.
    password: '...'
})
.then(result => {
    console.log(result)
});
```

### Umount

```javascript
ecryptfs.umount('./private')
.then(result => {
    console.log(result);
});
```
