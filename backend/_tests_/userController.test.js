// _test/userController.test.js

const request = require("supertest");
const app = require("../server");

describe("Uporabniški API-ji", () => {
  /** Test za registracijo novega uporabnika
  it("naj registrira novega uporabnika uspešno", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        user: {
          ime: "Jannez",
          priimek: "Novak",
          email: "jannez.novak@example.com",
          geslo: "securepassword",
          confirmGeslo: "securepassword",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
  });
   */

  // Test za registracijo z obstoječim emailom
  it("naj vrne napako, če email že obstaja", async () => {
    await request(app)
      .post("/")
      .send({
        user: {
          ime: "Janez",
          priimek: "Novak",
          email: "janez.novak@example.com",
          geslo: "securepassword",
        },
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

  // Test za prijavo uporabnika
  it("naj prijavi uporabnika z veljavnimi podatki", async () => {
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
    const res = await request(app)
      .post("/api/users/login")
      .send({
        user: {
          email: "janez.novak@example.com",
          geslo: "napacnogeslo",
        },
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // Test za pridobivanje vseh uporabnikov
  it("naj vrne seznam vseh uporabnikov", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
