require('dotenv').config();
const initModel = require('./models/initModel');
const { db } = require('./database/config');
const app = require('./app');

db.authenticate()
  .then(() => console.log('Database authenticated'))
  .catch(() => console.log(err));
initModel();

db.sync()
  .then(() => console.log('Database Synchronized'))
  .catch(() => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server are runing on port ${PORT}`);
});
