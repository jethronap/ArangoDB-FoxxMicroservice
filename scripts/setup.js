'use strict';

const db = require('@arangodb').db;
const collectionName = 'myFoxxCollection';

if(!db._collection(collectionName)) {
  db._createDocumentCollection(collectionName);
}
