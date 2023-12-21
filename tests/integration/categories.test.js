const request = require("supertest");
const mongoose = require("mongoose");
const { Categorie } = require("../../models/categorie");
const { User } = require("../../models/user");

let server;

describe("/api/categories", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Categorie.deleteMany({});
    server.close();
  });

  describe("GET /", () => {
    it("should return all categories", async () => {
      await Categorie.collection.insertMany([
        { name: "categorie1" },
        { name: "categorie2" },
      ]);
      const res = await request(server).get("/api/categories");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((c) => c.name === "categorie1")).toBeTruthy();
      expect(res.body.some((c) => c.name === "categorie2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a categorie if valid id is passed", async () => {
      const categorie = new Categorie({ name: "catergorie1" });
      await categorie.save();

      const res = await request(server).get("/api/categories/" + categorie._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", categorie.name);
    });

    it("should return a 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/categories/1");

      expect(res.status).toBe(404);
    });

    it("should return a 404 if invalid id is passed", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/categories/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/categories")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "categorie1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if categorie is less than 3 character", async () => {
      name = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if categorie is more than 50 character", async () => {
      name = new Array(22).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the categorie if it is valid", async () => {
      await exec();

      const categorie = await Categorie.find({ name: "categorie1" });

      expect(categorie).not.toBeNull();
    });

    it("should return the categorie if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "categorie1");
    });
  });
});
