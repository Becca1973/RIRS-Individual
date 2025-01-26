const request = require("supertest");
const app = require("../server");
const db = require("../db");

jest.mock("../middleware/verifyToken", () => {
  return (req, res, next) => {
    req.userId = 1;
    next();
  };
});
beforeAll(() => {
  jest.setTimeout(15000);
});
afterAll(() => {
  db.end();
});
beforeEach((done) => {
  // Izbriši vse zapise v tabeli dopust, da preprečiš konflikte z ID-ji
  db.query("DELETE FROM dopust", (err) => {
    if (err) return done(err);
    done();
  });
});

describe("Zahtevki za dopuste", () => {
  it("naj ustvari nov dopust", async () => {
    const res = await request(app)
      .post("/api/users/request")
      .set("Authorization", "Bearer mock-jwt-token")
      .send({
        dopusti: [
          {
            ime: "Janez",
            priimek: "Novak",
            tip: 1,
            razlog: "Počitnice",
            startDate: "2024-12-02",
            endDate: "2024-12-10",
            zahteva_id: 1,
          },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Request created successfully");
  });

  it("naj vrne zahtevke določenega uporabnika", async () => {
    const res = await request(app)
      .get("/api/requests/user-requests")
      .set("Authorization", "Bearer mock-jwt-token");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("naj posodobi status zahtevka", async () => {
    const res = await request(app)
      .put("/api/requests")
      .set("Authorization", "Bearer mock-jwt-token")
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
      .set("Authorization", "Bearer mock-jwt-token");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("naj posodobi status zahtevka na 'accepted'", async () => {
    const res = await request(app)
      .put("/api/requests")
      .set("Authorization", "Bearer mock-jwt-token")
      .send({
        id: 1,
        status: "accepted",
      });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Request status updated successfully");
  });

  it("should delete a leave successfully", async () => {
    // Ustvari nov dopust v bazi
    await db.query(
      "INSERT INTO dopust (id, razlog, zacetek, konec, tip_dopusta_id, zahteva_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [2, "Test reason", "2024-12-01", "2024-12-05", 1, 2]
    );

    const res = await request(app).delete("/api/requests/leave/2");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Leave deleted successfully");

    // Preveri, da je bil zapis izbrisan
    const { rows } = await db.query("SELECT * FROM dopust WHERE id = $1", [2]);
    expect(rows.length).toBe(0); // Ni več zapisov
  });

  it("should return 404 for non-existent leave", async () => {
    // Pošlji DELETE zahtevek za neobstoječ zapis
    const res = await request(app).delete("/api/requests/leave/9999");

    // Preveri status in odziv
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Leave not found");
  });

  it("should return 400 if leave ID is not provided", async () => {
    const res = await request(app).delete("/api/requests/leave/"); // Pot brez ID-ja
    expect(res.status).toBe(400); // Preverimo, da vrne 400
    expect(res.body.message).toBe("Leave ID is required"); // Preverimo, da sporočilo ustreza
  });
});
