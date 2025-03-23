import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-110 ${
            star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
