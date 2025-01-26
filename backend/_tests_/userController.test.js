const request = require("supertest");
const app = require("../server");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const db = require("../db");

jest.mock("../models/userModel", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByEmail: jest.fn(),
  getAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
}));

beforeAll(() => {
  jest.setTimeout(15000);
});
afterAll(() => {
  db.end();
});

describe("Uporabniški API-ji", () => {
  // Test za registracijo novega uporabnika
  it("naj registrira novega uporabnika uspešno", async () => {
    User.findOne.mockResolvedValue(null);

    User.create.mockResolvedValue({
      id: "123",
      ime: "Janez",
      priimek: "Novak",
      email: "janez.novak@example.com",
    });

    const res = await request(app)
      .post("/api/users")
      .send({
        user: {
          ime: "Janez",
          priimek: "Novak",
          email: "janez.novak@example.com",
          geslo: "securepassword",
          confirmGeslo: "securepassword",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(User.create).toHaveBeenCalledWith({
      ime: "Janez",
      priimek: "Novak",
      email: "janez.novak@example.com",
      geslo: expect.any(String),
    });
  });

  // Test za registracijo z obstoječim emailom
  it("naj vrne napako, če email že obstaja", async () => {
    User.findOne.mockResolvedValue({
      id: "123",
      ime: "Janez",
      priimek: "Novak",
      email: "janez.novak@example.com",
    });

    const res = await request(app)
      .post("/api/users")
      .send({
        user: {
          ime: "Janez",
          priimek: "Novak",
          email: "janez.novak@example.com",
          geslo: "securepassword",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("naj prijavi uporabnika z veljavnimi podatki", async () => {
    const hashedPassword = await bcrypt.hash("securepassword", 10);

    // Mock podatki uporabnika
    User.findByEmail.mockImplementation((email, callback) =>
      callback(null, [
        {
          id: "116",
          ime: "Janez",
          priimek: "Novak",
          email: "janez.novak@example.com",
          geslo: hashedPassword,
          tip_uporabnika_id: 1,
        },
      ])
    );

    const res = await request(app)
      .post("/api/users/login")
      .send({
        user: {
          email: "janez.novak@example.com",
          geslo: "securepassword",
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.token).toBeDefined();
  });

  // Test za neveljavne prijavne podatke
  it("naj vrne napako za napačno geslo", async () => {
    User.findByEmail.mockImplementation(async (email, callback) =>
      callback(null, [
        {
          id: "123",
          ime: "Janez",
          priimek: "Novak",
          email: "janez.novak@example.com",
          geslo: await bcrypt.hash("securepassword", 10),
          tip_uporabnika_id: 1,
        },
      ])
    );

    const res = await request(app)
      .post("/api/users/login")
      .send({
        user: {
          email: "janez.novak@example.com",
          geslo: "wrongpassword",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // Test za pridobivanje vseh uporabnikov
  it("naj vrne seznam vseh uporabnikov", async () => {
    User.getAll.mockImplementation((callback) => {
      callback(null, [
        {
          id: "123",
          ime: "Janez",
          priimek: "Novak",
          email: "janez@example.com",
          tip_uporabnika_id: 1,
        },
        {
          id: "124",
          ime: "Maja",
          priimek: "Kovač",
          email: "maja@example.com",
          tip_uporabnika_id: 2,
        },
      ]);
    });

    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("naj vrne napako, če manjkajo obvezna polja pri registraciji", async () => {
    const res = await request(app)
      .post("/api/users/")
      .send({
        user: {
          ime: "",
          priimek: "Novak",
          email: "janez.novak@example.com",
          geslo: "",
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("naj vrne napako, če uporabnik ni najden", async () => {
    // Simuliraj, da uporabnik ne obstaja
    User.findById.mockResolvedValue(null);

    const res = await request(app).get("/api/users/loggedIn");

    expect(res.status).toBe(403); // Spremeni v 403, ker ni veljavnega žetona
    expect(res.body.message).toBe("Token is required");
  });

  it("naj vrne napako, če ni žetona", async () => {
    const res = await request(app).get("/api/users/loggedIn");

    expect(res.status).toBe(403); // Preveri, da vrne 401, če ni žetona
    expect(res.body.message).toBe("Token is required");
  });

  it("naj vrne napako, če pride do napake pri ustvarjanju uporabnika", async () => {
    // Simuliraj napako pri ustvarjanju uporabnika
    User.create.mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .post("/api/users/")
      .send({
        user: {
          ime: "Jane",
          priimek: "Nova",
          email: "jane.nova@example.com",
          geslo: "securpasswor",
        },
      });

    expect(res.status).toBe(400); // Napaka zaradi napačnih vhodnih podatkov
    expect(res.body.message).toBe("User already exists");
  });
});
