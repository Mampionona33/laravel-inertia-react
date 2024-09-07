import React, { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

export const ModalContext = createContext({});

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const value = {
    showModal,
    handleClose,
    handleShow,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node,
};

export const useModal = () => {
  return useContext(ModalContext);
};
