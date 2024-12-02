jest.mock("../middleware/verifyToken", () => {
  return (req, res, next) => {
    req.userId = 1; // mock uporabnika z ID 1
    next();
  };
});

const request = require("supertest");
const app = require("../server");

describe("Zahtevki za dopuste", () => {
  it("naj ustvari nov dopust", async () => {
    const res = await request(app)
      .post("/api/users/request")
      .set("Authorization", "Bearer mock-jwt-token") // dodaj mock JWT token
      .send({
        dopusti: [
          {
            ime: "Janez",
            priimek: "Novak",
            tip: "Letni dopust",
            datum_zacetka: "2024-12-02",
            datum_konca: "2024-12-10",
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Request created successfully");
  });

  it("naj vrne zahtevke določenega uporabnika", async () => {
    const res = await request(app)
      .get("/api/requests/user-requests")
      .set("Authorization", "Bearer mock-jwt-token"); // dodaj mock JWT token
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("naj posodobi status zahtevka", async () => {
    const res = await request(app)
      .put("/api/requests")
      .set("Authorization", "Bearer mock-jwt-token") // dodaj mock JWT token
      .send({
        id: 1,
        status: "in progress",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Request status updated successfully");
  });

  it("naj vrne vse zahtevke", async () => {
    const res = await request(app)
      .get("/api/requests/all-leaves")
      .set("Authorization", "Bearer mock-jwt-token"); // dodaj mock JWT token
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("naj posodobi status zahtevka na 'accepted'", async () => {
    const res = await request(app)
      .put("/api/requests")
      .set("Authorization", "Bearer mock-jwt-token") // dodaj mock JWT token
      .send({
        id: 1,
        status: "accepted", // nov status za testiranje
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Request status updated successfully");
  });
});
