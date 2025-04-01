import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { Branch, Year, StudyMaterial } from "../models/resources.model.js";
import Subject from "../models/subject.model.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

// ========================
//    Branch Controllers
// ========================
const BRANCH_NAMES = Object.values(Branch.getAttributes().branch_name.values);

export const createBranch = asyncHandler(async (req, res) => {
  const { branch_name } = req.body;

  if (!branch_name?.trim()) {
    throw new ApiError("Branch Name is required", 400);
  }

  if (!BRANCH_NAMES.includes(branch_name)) {
    throw new ApiError(
      `Invalid branch name. Must be one of: ${BRANCH_NAMES.join(", ")}`,
      400
    );
  }

  const branch = await Branch.create({ branch_name });
  res
    .status(201)
    .json(new ApiResponse(201, branch, "Branch created successfully"));
});

export const getAllBranches = asyncHandler(async (req, res) => {
  const branches = await Branch.findAll();
  res
    .status(200)
    .json(new ApiResponse(200, branches, "Branches retrieved successfully"));
});

export const getBranchById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const branch = await Branch.findByPk(id);

  if (!branch) {
    throw new ApiError("Branch not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, branch, "Branch retrieved successfully"));
});

export const editBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { branch_name } = req.body;

  const branch = await Branch.findByPk(id);
  if (!branch) {
    throw new ApiError("Branch not found", 404);
  }

  if (branch_name && !BRANCH_NAMES.includes(branch_name)) {
    throw new ApiError(
      `Invalid branch name. Must be one of: ${BRANCH_NAMES.join(", ")}`,
      400
    );
  }

  if (branch_name) branch.branch_name = branch_name;
  await branch.save();

  res
    .status(200)
    .json(new ApiResponse(200, branch, "Branch updated successfully"));
});

export const deleteBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const branch = await Branch.findByPk(id);

  if (!branch) {
    throw new ApiError("Branch not found", 404);
  }

  await branch.destroy();
  res
    .status(200)
    .json(new ApiResponse(200, null, "Branch deleted successfully"));
});

// ========================
//    Year Controllers
// ========================
const YEAR_NAMES = ["First Year", "Second Year", "Third Year", "Fourth Year"];

export const createYear = asyncHandler(async (req, res) => {
  const { year_name, branch_id } = req.body;

  if (!year_name?.trim()) {
    throw new ApiError("Year Name is required", 400);
  }

  if (!YEAR_NAMES.includes(year_name)) {
    throw new ApiError(
      `Invalid year name. Must be one of: ${YEAR_NAMES.join(", ")}`,
      400
    );
  }

  const branch = await Branch.findByPk(branch_id);
  if (!branch) {
    throw new ApiError("Branch not found", 404);
  }

  const year = await Year.create({ year_name, branch_id });
  res.status(201).json(new ApiResponse(201, year, "Year created successfully"));
});

export const getAllYears = asyncHandler(async (req, res) => {
  const years = await Year.findAll({ include: Branch });
  res
    .status(200)
    .json(new ApiResponse(200, years, "Years retrieved successfully"));
});

export const getYearById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const year = await Year.findByPk(id, { include: Branch });

  if (!year) {
    throw new ApiError("Year not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, year, "Year retrieved successfully"));
});

export const editYear = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { year_name, branch_id } = req.body;

  const year = await Year.findByPk(id);
  if (!year) {
    throw new ApiError("Year not found", 404);
  }

  if (year_name && !YEAR_NAMES.includes(year_name)) {
    throw new ApiError(
      `Invalid year name. Must be one of: ${YEAR_NAMES.join(", ")}`,
      400
    );
  }

  if (branch_id) {
    const branch = await Branch.findByPk(branch_id);
    if (!branch) {
      throw new ApiError("Branch not found", 404);
    }
    year.branch_id = branch_id;
  }

  if (year_name) year.year_name = year_name;
  await year.save();

  res.status(200).json(new ApiResponse(200, year, "Year updated successfully"));
});

export const deleteYear = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const year = await Year.findByPk(id);

  if (!year) {
    throw new ApiError("Year not found", 404);
  }

  await year.destroy();
  res.status(200).json(new ApiResponse(200, null, "Year deleted successfully"));
});

// ========================
//   Subject Controllers
// ========================
export const createSubject = asyncHandler(async (req, res) => {
  const { name, code, credit, icon } = req.body;

  if (!name?.trim() || !code?.trim()) {
    throw new ApiError("Subject name and code are required", 400);
  }

  const subject = await Subject.create({ name, code, credit, icon });
  res
    .status(201)
    .json(new ApiResponse(201, subject, "Subject created successfully"));
});

export const getAllSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.findAll();
  res
    .status(200)
    .json(new ApiResponse(200, subjects, "Subjects retrieved successfully"));
});

export const getSubjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findByPk(id);

  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject retrieved successfully"));
});

export const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, credit, icon } = req.body;

  const subject = await Subject.findByPk(id);
  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  if (name) subject.name = name;
  if (code) subject.code = code;
  if (credit !== undefined) subject.credit = credit;
  if (icon) subject.icon = icon;

  await subject.save();

  res
    .status(200)
    .json(new ApiResponse(200, subject, "Subject updated successfully"));
});

export const deleteSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const subject = await Subject.findByPk(id);

  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  await subject.destroy();
  res
    .status(200)
    .json(new ApiResponse(200, null, "Subject deleted successfully"));
});

// ========================
//   Study Material Controllers
// ========================
export const createStudyMaterial = asyncHandler(async (req, res) => {
  const { title, material_type, branch_id, year_id, subject_id } = req.body;

  if (
    !title ||
    !material_type ||
    !branch_id ||
    !year_id ||
    !subject_id ||
    !req.file
  ) {
    throw new ApiError(
      "All fields (title, type, branch, year, subject, file) are required",
      400
    );
  }

  // Optionally, you can verify that the branch, year, and subject exist
  const branch = await Branch.findByPk(branch_id);
  if (!branch) {
    throw new ApiError("Branch not found", 404);
  }

  const year = await Year.findByPk(year_id);
  if (!year) {
    throw new ApiError("Year not found", 404);
  }

  const subject = await Subject.findByPk(subject_id);
  if (!subject) {
    throw new ApiError("Subject not found", 404);
  }

  const fileUrl = await uploadImageToCloudinary(
    req.file.path,
    "study_materials"
  );

  const studyMaterial = await StudyMaterial.create({
    title,
    material_type,
    material_url: fileUrl,
    branch_id,
    year_id,
    subject_id,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        studyMaterial,
        "Study material uploaded successfully"
      )
    );
});

export const getAllStudyMaterials = asyncHandler(async (req, res) => {
  const materials = await StudyMaterial.findAll();
  res
    .status(200)
    .json(
      new ApiResponse(200, materials, "Study materials retrieved successfully")
    );
});

export const getStudyMaterialById = asyncHandler(async (req, res) => {
  const { material_id } = req.params;
  const material = await StudyMaterial.findByPk(material_id);

  if (!material) throw new ApiError("Study material not found", 404);

  res
    .status(200)
    .json(
      new ApiResponse(200, material, "Study material retrieved successfully")
    );
});

export const updateStudyMaterial = asyncHandler(async (req, res) => {
  const { material_id } = req.params;
  const { title, material_type, branch_id, year_id, subject_id } = req.body;

  const material = await StudyMaterial.findByPk(material_id);
  if (!material) throw new ApiError("Study material not found", 404);

  let fileUrl = material.material_url;
  if (req.file) {
    fileUrl = await uploadImageToCloudinary(req.file.path, "study_materials");
  }

  await material.update({
    title,
    material_type,
    material_url: fileUrl,
    branch_id,
    year_id,
    subject_id,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, material, "Study material updated successfully")
    );
});

export const deleteStudyMaterial = asyncHandler(async (req, res) => {
  const { material_id } = req.params;
  const deleted = await StudyMaterial.destroy({ where: { material_id } });

  if (!deleted) throw new ApiError("Study material not found", 404);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Study material deleted successfully"));
});
