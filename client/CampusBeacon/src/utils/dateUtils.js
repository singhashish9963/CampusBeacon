export const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const isRideActive = (departureDateTime) => {
  return new Date(departureDateTime) > new Date();
};
