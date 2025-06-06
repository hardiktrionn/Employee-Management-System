
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-4 border-t mt-10 text-gray-600 text-sm">
      © {new Date().getFullYear()} Your Company Name. All rights reserved.
    </footer>
  );
};

export default Footer;
