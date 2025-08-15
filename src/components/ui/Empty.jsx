import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No Data", 
  description = "Nothing to show here yet", 
  actionLabel, 
  onAction,
  icon = "Dumbbell",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      <div className="bg-surface/50 rounded-full p-6 mb-6">
        <ApperIcon name={icon} size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-display font-bold text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-gray-400 mb-6 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-red-700 text-white rounded-lg font-medium transition-all btn-hover"
        >
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;