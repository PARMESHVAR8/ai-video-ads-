import React from "react";

// Avatar is a wrapper/container for AvatarImage and AvatarFallback
export const Avatar: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`inline-flex items-center justify-center ${className}`.trim()}>{children}</div>
);

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & { className?: string }> = ({ src, alt = "avatar", className = "", ...rest }) => (
  <img src={src} alt={alt} className={`rounded-full ${className}`.trim()} {...rest} />
);

export const AvatarFallback: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`rounded-full bg-white/5 flex items-center justify-center ${className}`.trim()}>{children}</div>
);

export default Avatar;
