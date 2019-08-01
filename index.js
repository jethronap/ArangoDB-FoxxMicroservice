'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi'); // imported from npm
const db = require('@arangodb').db;
const foxxColl = db._collection('myFoxxCollection');
const aql = require('@arangodb').aql;

// registers the route with the Foxx service context
module.context.use(router);

//Basic Hello World Route:
router.get('/hell-o-hell', function (req, res) {
  res.send('To Hell with World');
})
.response(['text/plain'], 'A generic greeting')
.summary('Generic Greeting')
.description('Prints a generic greeting.');

// Route wth Param validation
router.get('/hello/:name', function(req, res) {
  res.send(`Hello ${req.pathParams.name}`);
})
.pathParam('name', joi.string().required(), 'Name to greet.')
.response(['text/plain'], 'A personalized greeting.')
.summary('Personalized greeting')
.description('Prints a personalized greeting.');


// Add entry to myFoxxCollection
router.post('/entries', function(req, res) {
  const data = req.body;
  const meta = foxxColl.save(data);
  res.send(Object.assign(data, meta));
})
.body(joi.object().required(), 'Entry to store in the collection.')
.response(joi.object().required(), 'Entry stored in the collection.')
.summary('Store an entry')
.description('Store an entry in "myFoxxCollection" collection.');

// Retrieve from myFoxxCollection using AQL:
router.get('/entries', function(req, res) {
  const keys = db._query(aql`
    FOR entry IN ${foxxColl}
    RETURN entry._key
    `);
    res.send(keys);
})
.response(joi.array().items(
  joi.string().required()
).required(), 'List of entry keys.')
.summary('List entry keys.')
.description('Assembles a list of keys of entries in the collection.');
