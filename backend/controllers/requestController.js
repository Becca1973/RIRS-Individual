const Request = require("../models/requestModel");

exports.getAllGroupedRequests = (req, res) => {
  Request.getAllGrouped((err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to retrieve requests" });
    }
    res.status(200).json(results);
  });
};

exports.updateRequestStatus = (req, res) => {
  const { id, status } = req.body;

  if (!id || !status) {
    return res
      .status(400)
      .json({ message: "Request ID and status are required" });
  }

  Request.update(id, status, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to update request status" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({ message: "Request status updated successfully" });
  });
};

exports.createRequest = (req, res) => {
  try {
    const { dopusti } = req.body;
    const userId = req.userId;

    const newRequest = {
      uporabnik_id: userId,
      datum_zahteve: new Date(),
      komentar: "",
      stanje: "in progress",
    };

    Request.create(newRequest, (error, result) => {
      if (error) {
        console.error("Error creating request:", error);
        return res.status(500).json({ message: "Failed to create request" });
      }

      const requestId = result.insertId;

      dopusti.forEach((dopust) => {
        const dopustData = {
          zacetek: dopust.startDate,
          konec: dopust.endDate,
          razlog: dopust.razlog,
          tip_dopusta_id: dopust.tip,
          zahteva_id: requestId,
        };

        Request.createLeave(dopustData, (leaveError) => {
          if (leaveError) {
            console.error("Error creating leave:", leaveError);
          }
        });
      });

      res.status(201).json({ message: "Request created successfully" });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};
exports.getAllLeaves = (req, res) => {
  Request.getAllLeaves((err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to retrieve leave requests" });
    }
    res.status(200).json(results);
  });
};