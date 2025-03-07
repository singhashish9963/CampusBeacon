import Rides from "../models/ride.model.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";

export const createRide = asyncHandler(async (req, res) => {
  const {
    pickupLocation,
    dropLocation,
    departureDateTime,
    totalSeats,
    estimatedCost,
    description,
    phoneNumber,
  } = req.body;


  if (!pickupLocation?.trim() || !dropLocation?.trim()) {
    throw new ApiError("Pickup and drop locations are required", 400);
  }

  if (!departureDateTime) {
    throw new ApiError("Departure date and time is required", 400);
  }

  if (totalSeats < 1) {
    throw new ApiError("Total seats must be at least 1", 400);
  }

  if (estimatedCost && estimatedCost < 0) {
    throw new ApiError("Estimated cost cannot be negative", 400);
  }

  const creatorId = req.user?.id;
  if (!creatorId) {
    throw new ApiError("Authentication required", 401);
  }

  try {
    const newRide = await Rides.create({
      creatorId,
      pickupLocation,
      dropLocation,
      departureDateTime,
      totalSeats,
      availableSeats: totalSeats, 
      estimatedCost,
      description,
      phoneNumber,
      status: "OPEN",
    });

    return res
      .status(201)
      .json(new ApiResponse(201, newRide, "Ride created successfully"));
  } catch (error) {
    console.error("Database error:", error);
    throw new ApiError(
      "Error creating ride in database: " + error.message,
      500
    );
  }
});

export const updateRide = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    pickupLocation,
    dropLocation,
    departureDateTime,
    totalSeats,
    estimatedCost,
    description,
    phoneNumber,
    status,
  } = req.body;

  const ride = await Rides.findByPk(id);
  if (!ride) throw new ApiError("Ride not found", 404);

  if (ride.creatorId !== req.user?.id) throw new ApiError("Unauthorized", 403);

  if (status && !["OPEN", "FULL", "CANCELLED", "COMPLETED"].includes(status)) {
    throw new ApiError(
      "Invalid status. Must be OPEN, FULL, CANCELLED, or COMPLETED",
      400
    );
  }

  if (totalSeats && totalSeats < ride.totalSeats - ride.availableSeats) {
    throw new ApiError(
      "Cannot reduce total seats below number of seats already taken",
      400
    );
  }

  Object.assign(ride, {
    pickupLocation: pickupLocation ?? ride.pickupLocation,
    dropLocation: dropLocation ?? ride.dropLocation,
    departureDateTime: departureDateTime ?? ride.departureDateTime,
    totalSeats: totalSeats ?? ride.totalSeats,
    estimatedCost: estimatedCost ?? ride.estimatedCost,
    description: description ?? ride.description,
    phoneNumber: phoneNumber ?? ride.phoneNumber,
    status: status ?? ride.status,
    availableSeats: totalSeats
      ? totalSeats - (ride.totalSeats - ride.availableSeats)
      : ride.availableSeats,
  });

  await ride.save();
  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride updated successfully"));
});

export const deleteRide = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ride = await Rides.findByPk(id);
  if (!ride) throw new ApiError("Ride not found", 404);

  if (ride.creatorId !== req.user?.id) throw new ApiError("Unauthorized", 403);

  await ride.destroy();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Ride deleted successfully"));
});

export const getRide = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const ride = await Rides.findByPk(id, {
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  if (!ride) throw new ApiError("Ride not found", 404);

  return res
    .status(200)
    .json(new ApiResponse(200, ride, "Ride retrieved successfully"));
});

export const getAllRides = asyncHandler(async (req, res) => {
  const rides = await Rides.findAll({
    where: {
      status: "OPEN",
      departureDateTime: {
        [Op.gt]: new Date(), 
      },
    },
    order: [["departureDateTime", "ASC"]],
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, rides, "All rides retrieved successfully"));
});

export const getUserRides = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user?.id;

  const rides = await Rides.findAll({
    where: { creatorId: userId },
    order: [["departureDateTime", "ASC"]],
    include: [
      {
        model: User,
        as: "creator",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  return res
    .status(200)
    .json(new ApiResponse(200, rides, "User's rides retrieved successfully"));
});
