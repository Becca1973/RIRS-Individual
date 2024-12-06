const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const verifyToken = require("../middleware/verifyToken");

router.get("/", requestController.getAllGroupedRequests);
router.put("/", requestController.updateRequestStatus);
router.get("/all-leaves", requestController.getAllLeaves);
router.get("/user-requests", verifyToken, requestController.getRequestsByUser);
router.get("/user-request-statuses", requestController.getLeaveStatsByUser);
router.delete("/leave/:leaveId", requestController.deleteLeave);
module.exports = router;
