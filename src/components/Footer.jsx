import React from "react";

const Footer = ({ currentYear }) => {
  return (
    <small>
      &copy;
      {currentYear} Barbara Ward. All rights reserved.
    </small>
  );
};

export default Footer;
