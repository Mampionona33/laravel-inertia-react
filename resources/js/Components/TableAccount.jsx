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

  const formatAccountList =
    accountList &&
    accountList.map((item) => {
      const output = {
        ...item,
      };
      if (item.status === "paid") {
        output.status = "Payé";
      }

      if (item.status === "pending" && new Date(item.due_date) > new Date()) {
        output.status = "En cours";
      }

      if (
        !item.paid_at &&
        item.status === "pending" &&
        new Date(item.due_date) < new Date()
      ) {
        output.status = "En retard";
      }

      return output;
    });

  console.log(formatAccountList);

  return (
    <div className="flex flex-col gap-4">
      <ModalPayerAccount show={show} account={account} />
      <div className="shadow-sm border rounded-md p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th className="p-2 text-left font-medium text-gray-500 tracking-wider">
                Valeur
              </th>
              <th className="p-2 text-left font-medium text-gray-500 tracking-wider">
                Status
              </th>
              <th className="p-2 text-left font-medium text-gray-500 tracking-wider">
                Date prévue pour le paiement
              </th>
              <th className="p-2 text-left font-medium text-gray-500 tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accountList && accountList.length > 0 ? (
              formatAccountList.map((item, index) => (
                <tr key={item.id} className="hover:bg-green-50">
                  <td className="border-b p-2">{Ar(item.amount)}</td>
                  <td className="border-b p-2">{item.status}</td>
                  <td className="border-b p-2">{item.due_date}</td>
                  <td className="border-b p-2">
                    <div className="flex justify-center gap-4">
                      {item.status !== "Payé" && (
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
                  className="border-b px-4 py-2 text-center text-gray-500"
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
