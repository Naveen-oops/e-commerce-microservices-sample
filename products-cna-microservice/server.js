// Loads the configuration from config.env to process.env
require('dotenv').config({ path: './.env' });

const deals = require('./data/deals')
const products = require('./data/products')

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

// get MongoDB driver connection
const dbo = require('./db/conn');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(require('./routes/record'));

// Global error handling
app.use(function (err, _req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

loadData = () => {
  const dbConnect = dbo.getDb();

  ['deals', 'products'].map((collection) => {
    dbConnect.collection(collection, function (err, collection) {
      // handle the error if any
      if (err) throw err;
      // delete the mongodb collection
      collection.deleteMany({}, function (err, result) {
        // handle the error if any
        if (err) throw err;
        console.log("Collection is deleted! ", result);
      });
    })
  });
  [{collection: 'deals', records: deals.deals}, { collection: 'products', records: products.products}].map((data) => {
    dbConnect
    .collection(data.collection)
    .insertMany(data.records, (err, result) => {
      if (err) {
        console.log('Error loading data')
        throw err
      } else {
        console.log('Data loaded ', result)
      }
    });
  });
}

// Only connect to the database and start the server if this file is run directly
if (require.main === module) {
  // perform a database connection when the server starts
  dbo.connectToServer(function (err) {
    if (err) {
      console.error(err);
      process.exit();
    }

    // start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      loadData()
    });
  });
}

// Export the app for testing
module.exports = { app, loadData };
