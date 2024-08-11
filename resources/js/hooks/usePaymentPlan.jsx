import React from "react";

const usePaymentPlan = () => {
  const [paymentCount, setPaymentCount] = React.useState(1);

  const addPayment = () => {
    setPaymentCount((prevCount) => prevCount + 1);
  };

  const removePayment = () => {
    setPaymentCount((prevCount) => Math.max(1, prevCount - 1));
  };

  return { paymentCount, addPayment, removePayment };
};

export default usePaymentPlan;
