import React from "react";
import PropTypes from "prop-types";

const FinancialCard = ({
  iconClass,
  bgColor,
  title,
  amount,
  cardBackground,
}) => {
  return (
    <div
      className={`gap-4 flex justify-between items-center ${cardBackground} flex-row shadow-md p-4 rounded-md`}
    >
      <div
        className={`rounded-full ${bgColor} p-2 flex items-center justify-center`}
      >
        <i className={`${iconClass} text-gray-950 text-3xl`}></i>
      </div>
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="font-bold text-xl">{amount}</div>
      </div>
    </div>
  );
};

FinancialCard.propTypes = {
  iconClass: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  cardBackground: PropTypes.string,
};

export default FinancialCard;
