const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/', require('./routes'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongodb.initDb((err) => {
  if (err) {
    console.log('Unable to connect to database', err);
  } 
  else {
    app.listen(port, () => {
      console.log(`Database is listening and node is running on port ${port}`)
    });
  }
});




module.exports = app;