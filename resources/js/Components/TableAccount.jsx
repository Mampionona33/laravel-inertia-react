import React from "react";
import PropTypes from "prop-types";
import ModalPayerAccount from "./ModalPayerAccount";
import { useModal } from "@/Layouts/layout/context/modalContext";
import Ar from "@/assets/ariaryCurrency";

const TableAccount = ({ accountList }) => {
  const [show, setShow] = React.useState(false);
  const [account, setAccount] = React.useState(null);

  const { handleShow } = useModal();

  const onClickPay = (item) => {
    setShow(true);
    handleShow();
    setAccount(item);
  };

  return (
    <div>
      <ModalPayerAccount show={show} account={account} />
      <div className="shadow-sm border rounded-md p-4">
        <table className="table-auto border-collapse w-full">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="border border-green-500 px-4 py-2">Valeur</th>
              <th className="border border-green-500 px-4 py-2">Status</th>
              <th className="border border-green-500 px-4 py-2">
                Date prévue pour le paiement
              </th>
              <th className="border border-green-500 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accountList && accountList.length > 0 ? (
              accountList.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-green-100" : "bg-white"}
                >
                  <td className="border px-4 py-2 border-green-500">
                    {Ar(item.amount)}
                  </td>
                  <td className="border px-4 py-2 border-green-500">
                    {item.status}
                  </td>
                  <td className="border px-4 py-2 border-green-500">
                    {item.due_date}
                  </td>
                  <td className="border px-4 py-2 border-green-500">
                    <div className="flex justify-center gap-4">
                      {item.status !== "paid" && (
                        <button
                          onClick={() => onClickPay(item)}
                          className="hover:text-blue-500"
                        >
                          <i className="pi pi-money-bill"></i> Payer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="border border-green-500 px-4 py-2 text-center text-gray-500"
                >
                  Aucune ressource trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TableAccount.propTypes = {
  accountList: PropTypes.array,
};

export default TableAccount;
