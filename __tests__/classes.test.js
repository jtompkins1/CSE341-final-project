const {MongoClient} = require('mongodb');
const {getAllClasses, getClassById} = require('../controllers/classes.js');


describe('Classes Controller', () => {
  let connection;
  let db;

  beforeAll(async () => {
    const uri = process.env.MONGO_URL;
    if (!uri) {
      throw new Error('MONGO_URL environment variable is not set');
    }

    connection = await MongoClient.connect(uri);
    db = await connection.db();

    const mongodb = require('../data/database.js')
    
    const originalUrl = process.env.MONGO_URL;
    process.env.MONGO_URL = uri;
    //console.log('set MONGO_URL:', uri);

    await new Promise((resolve, reject) => {
        mongodb.initDb((err, returnedDb) => {
            if (err) {
                //console.error('initDb error:', err.message);
                reject(err);
            } else {
                //console.log ('initDb successful Returned DB:', returnedDb);
                resolve();
            }
        });
    });
    //try {
    //const testDb = mongodb.getDatabase();
    //console.log('getDatabase() AFTER initDb Successully returned:', testDb);
//} catch (err) {
    //console.error('getDatabase() error after initDb:', err.message);
    //
// }

process.env.MONGO_URL = originalUrl;
});



  afterAll(async () => {
   if (connection) {
     await connection.close(true);
     //console.log('MongoDB connection closed');
   }
   if (global.__MONGOD__) {
     await global.__MONGOD__.stop();
     //console.log('In-memory MongoDB stopped');
   }   
  });

  it('getAllClasses should return status 200 and an array', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await getAllClasses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    const data = res.json.mock.calls[0][0];
    expect(Array.isArray(data)).toBe(true);
  });

  it('getClassById should return status 404 when not found', async () => {
    const classId = '123456789012345678901234'; // Non-existent ID
    const req = { params: { id: classId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };

    await getClassById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    const data = res.json.mock.calls[0][0];
    expect(data).toHaveProperty('error', 'Error');
    expect(data).toHaveProperty('message', 'Class not found.');
  });
 });