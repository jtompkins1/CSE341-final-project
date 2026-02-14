const { MongoClient, ObjectId } = require('mongodb');
const mongodb = require('../data/database.js');
const { getAll, getSingle } = require("../controllers/students");

describe("Get requests for Students", () => {
  let connection;
  let db;
  let existingStudents = [];

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
      existingStudents = await db.collection('student').find().toArray();
      console.log(`Found ${existingStudents.length} existing students in database`);
    } catch (error) {
      console.error('Error fetching existing students:', error);
      existingStudents = [];
    }
  });

  afterAll(async () => {
    if (connection) {
      await connection.close(true);
    }
  });

  describe("getAll", () => {
    test("should return all students from database with status 200", async () => {
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
    test("should return a single student by valid ID with status 200", async () => {
      if (existingStudents.length === 0) {
        console.warn('No students in database to test getSingle');
        return;
      }

      const testStudent = existingStudents[0];
      const req = {
        params: { id: testStudent._id.toString() }
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
      expect(returnedData._id.toString()).toBe(testStudent._id.toString());
    });
    
  });
});

