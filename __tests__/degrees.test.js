const { MongoClient, ObjectId } = require('mongodb');
const mongodb = require('../data/database.js');
const { getAllDegrees, getDegreeById } = require("../controllers/degrees");

describe("Get requests for degrees", () => {
  let connection;
  let db;
  let existingDegrees = [];

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
      existingDegrees = await db.collection('degree').find().toArray();
      console.log(`Found ${existingDegrees.length} existing degrees in database`);
    } catch (error) {
      console.error('Error fetching existing degrees:', error);
      existingDegrees = [];
    }
  });

  afterAll(async () => {
    if (connection) {
      await connection.close(true);
    }
  });

  describe("getAllDegrees", () => {
    test("should return all degrees from database with status 200", async () => {
      const req = {};
      const res = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };

      await getAllDegrees(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
          
      const returnedData = res.json.mock.calls[0][0];
      expect(Array.isArray(returnedData)).toBe(true);
      expect(returnedData.length).toBeGreaterThanOrEqual(0);
    });
  })


  describe("getDegreeById", () => {
    test("should return a single degree by valid ID with status 200", async () => {
      if (existingDegrees.length === 0) {
        console.warn('No degrees in database to test getDegreeById');
        return;
      }

      const testDegree = existingDegrees[0];
      const req = {
        params: { id: testDegree._id.toString() }
      };
      const res = {
        setHeader: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis()
      };

      await getDegreeById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
          
      const returnedData = res.json.mock.calls[0][0];
      expect(returnedData).toBeDefined();
      expect(returnedData._id.toString()).toBe(testDegree._id.toString());
    });
    
  });
});

