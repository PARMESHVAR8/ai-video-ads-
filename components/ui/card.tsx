import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => (
  <div className={`rounded-xl ${className}`} {...rest}>
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => (
  <div className={`px-4 py-3 ${className}`} {...rest}>
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => (
  <div className={`p-4 ${className}`} {...rest}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...rest }) => (
  <div className={`font-semibold ${className}`} {...rest}>
    {children}
  </div>
);

export default Card;
