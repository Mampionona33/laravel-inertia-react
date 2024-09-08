import LayoutTitle from "@/Components/LayoutTitle";
import Layout from "@/Layouts/layout/layout";
import { router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import Tabs from "rc-tabs";
import TableAccount from "@/Components/TableAccount";
import ListeDepense from "@/Components/ListeDepense";
import Toast from "@/Components/Toast";
import DetailReservation from "@/Components/DetailReservation";

const Account = () => {
  const { reservation, accountList, salle, activeTab, depenseList, success } =
    usePage().props;
  const [showToast, setShowToast] = useState(true);

  const onTabChange = (key) => {
    if (key === "0") {
      router.get(route("reservations.show", reservation.id));
    }
    if (key === "1") {
      router.get(route("reservations.account", reservation.id));
    }
    if (key === "2") {
      router.get(route("reservations.depense", reservation.id));
    }
  };

  const items = [
    {
      key: "0",
      label: <p>Details</p>,
      children: (
        <div>
          <DetailReservation />
        </div>
      ),
    },
    {
      key: "1",
      label: <p>Acompte</p>,
      children: (
        <div>
          <TableAccount accountList={accountList && accountList.data} />
        </div>
      ),
    },
    {
      key: "2",
      label: <p>Dépense</p>,
      children: (
        <div>
          <ListeDepense />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex gap-2 flex-col">
        <LayoutTitle title="Details de la reservation" />
        {/* <HeaderReservationDetail reservation={reservation} salle={salle} /> */}
        {success && (
          <Toast
            type={"success"}
            message={success}
            onClose={() => setShowToast(false)}
          />
        )}
        <Tabs
          activeKey={activeTab}
          tabBarStyle={{ display: "flex" }}
          tabPosition="top"
          items={items}
          className="md:w-[70%] w-full mx-auto p-2 border-1"
          onChange={onTabChange}
          style={{ color: "black" }}
          destroyInactiveTabPane
          animated
        />
      </div>
    </Layout>
  );
};

export default Account;
