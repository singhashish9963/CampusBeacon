import express from "express";
import multer from "multer";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  editBranch,
  deleteBranch,
  createYear,
  getAllYears,
  getYearById,
  editYear,
  deleteYear,
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  createStudyMaterial,
  getAllStudyMaterials,
  getStudyMaterialById,
  updateStudyMaterial,
  deleteStudyMaterial,
} from "../controllers/resources.controllers.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import filterInputMiddleware from "../middlewares/filter.middleware.js";

const router = express.Router();
const upload = multer({ dest: "./public/temp" });

// ========================
//    Branch Routes
// ========================
router.post("/branches", createBranch);
router.get("/branches", getAllBranches);
router.get("/branches/:id", getBranchById);
router.put("/branches/:id", editBranch);
router.delete("/branches/:id", deleteBranch);

// ========================
//    Year Routes
// ========================
router.post("/years", createYear);
router.get("/years", getAllYears);
router.get("/years/:id", getYearById);
router.put("/years/:id", editYear);
router.delete("/years/:id", deleteYear);

// ========================
//    Subject Routes
// ========================
router.post("/subjects", createSubject);
router.get("/subjects", getAllSubjects);
router.get("/subjects/:id", getSubjectById);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

// ========================
//    Study Material Routes
// ========================
router.post("/study-materials", upload.single("file"), createStudyMaterial);
router.get("/study-materials", getAllStudyMaterials);
router.get("/study-materials/:material_id", getStudyMaterialById);
router.put(
  "/study-materials/:material_id",
  upload.single("file"),
  updateStudyMaterial
);
router.delete("/study-materials/:material_id", deleteStudyMaterial);

export default router;
