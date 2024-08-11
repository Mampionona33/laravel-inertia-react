import React, { useState } from "react";
import Layout from "@/Layouts/layout/layout";
import { Link, router, usePage } from "@inertiajs/react";
import Delete from "./Delete";
import Toast from "@/Components/Toast";
import AppTable from "@/Components/AppTable";
import LayoutTitle from "@/Components/LayoutTitle";

const List = ({ users }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(true);

  const { props } = usePage();
  const { success } = props;

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEditClick = (user) => {
    router.visit(route("users.edit", { user: user.id }), {
      preserveState: true,
      only: ["user"],
    });
  };

  const columns = [
    { header: "Nom", accessor: "name" },
    { header: "Email", accessor: "email" },
  ];

  return (
    <Layout>
      <LayoutTitle title={"Liste des utilisateurs"} />

      {success && showToast && (
        <Toast
          type={"success"}
          message={success}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="flex justify-between flex-wrap flex-col gap-4">
        <div className="flex justify-end">
          <Link
            href={route("users.create")}
            as="button"
            className="bg-green-900 text-white px-4 py-2 rounded-md"
          >
            Ajouter un utilisateur
          </Link>
        </div>

        <AppTable
          data={users.data}
          columns={columns}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          paginationLinks={users.links}
        />
      </div>

      {showModal && selectedUser && (
        <Delete user={selectedUser} onClose={() => setShowModal(false)} />
      )}
    </Layout>
  );
};

export default List;
