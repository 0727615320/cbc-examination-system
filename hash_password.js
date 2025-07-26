const bcrypt = require('bcrypt');

const plainPassword = 'Confidence2030'; // change to your desired password
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
