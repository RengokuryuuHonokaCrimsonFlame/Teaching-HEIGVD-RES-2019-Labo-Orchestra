const os = require('os');

// eslint-disable-next-line no-undef
const networkInterfaces = os.networkInterfaces();

// eslint-disable-next-line no-unused-vars
let i = 0;
// eslint-disable-next-line guard-for-in,no-undef,no-restricted-syntax
for (const itf in networkInterfaces) {
  // eslint-disable-next-line no-plusplus
  i++;
  // eslint-disable-next-line no-undef
  console.log(`Network Interface: ${itf}, ${networkInterfaces[itf]}`);

  // eslint-disable-next-line no-restricted-syntax,no-undef,guard-for-in
  for (const addressIndex in networkInterfaces[itf]) {
    // eslint-disable-next-line no-undef
    const address = networkInterfaces[itf][addressIndex];
    console.log(` address: ${address.family} -> ${address.address}, internal:${address.internal}`);
  }
}
