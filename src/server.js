require('dotenv').config();
const app = require('./app');
const initModel = require('./models/initModel');
const { db } = require('./database/config');

db.authenticate()
  .then(() => console.log('Database authenticated👌'))
  .catch((err) => console.log(err));

initModel();

db.sync()
  .then(() => console.log('Database Synchronized 👌'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server are runing on port ${PORT} 🪁✈️`);
});
