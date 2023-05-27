import fs from 'fs-extra';

fs.readdirSync(__dirname).forEach((file) => {
  console.log(file);
});
