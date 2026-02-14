const { MongoClient, ObjectId } = require('mongodb');
const mongodb = require('../data/database.js');
const { getAll, getSingle } = require("../controllers/teachers");

describe("Get requests for teachers", () => {
  let connection;
  let db;
  let existingTeachers = [];

  beforeAll(async () => {
    const uri = process.env.MONGO_URL;
    if (!uri) {
      throw new Error('MONGO_URL environment variable is not set');
    }

    connection = await MongoClient.connect(uri);
    db = await connection.db();
        
    const originalUrl = process.env.MONGO_URL;
    process.env.MONGO_URL = uri;

    await new Promise((resolve, reject) => {
      mongodb.initDb((err, returnedDb) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    process.env.MONGO_URL = originalUrl;

    try {
      existingTeachers = await db.collection('teacher').find().toArray();
      console.log(`Found ${existingTeachers.length} existing teachers in database`);
    } catch (error) {
      console.error('Error fetching existing teachers:', error);
      existingTeachers = [];
    }
  });

  afterAll(async () => {
    if (connection) {
      await connection.close(true);
    }
  });

  describe("getAll", () => {
    test("should return all teachers from database with status 200", async () => {
      const req = {};
      const res = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };

      await getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
          
      const returnedData = res.json.mock.calls[0][0];
      expect(Array.isArray(returnedData)).toBe(true);
      expect(returnedData.length).toBeGreaterThanOrEqual(0);
    });
  })


  describe("getSingle", () => {
    test("should return a single teacher by valid ID with status 200", async () => {
      if (existingTeachers.length === 0) {
        console.warn('No teachers in database to test getSingle');
        return;
      }

      const testTeacher = existingTeachers[0];
      const req = {
        params: { id: testTeacher._id.toString() }
      };
      const res = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };

      await getSingle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
          
      const returnedData = res.json.mock.calls[0][0];
      expect(returnedData).toBeDefined();
      expect(returnedData._id.toString()).toBe(testTeacher._id.toString());
    });
    
  });
});

