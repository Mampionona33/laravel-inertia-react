import AppTable from "@/Components/AppTable";
import Toast from "@/Components/Toast";
import Layout from "@/Layouts/layout/layout";
import { Link, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import Delete from "./Delete";

const Index = ({ salles }) => {
  const [selectedSalle, setSelectedSalle] = React.useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = React.useState(true);
  const { props } = usePage();
  const { success } = props;

  const handleEditClick = (salle) => {
    router.visit(route("salles.edit", { salle: salle.id }), {
      preserveState: true,
      only: ["salle"],
    });
  };

  const handleDeleteClick = (salle) => {
    setSelectedSalle(salle);
    setShowModal(true);
  };

  const columns = [
    { header: "Numéro", accessor: "numero" },
    { header: "Capacite", accessor: "capacite" },
    { header: "Loyer journalier", accessor: "loyer_journalier" },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-green-950 mb-2">
        Liste des salles
      </h1>
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
            href={route("salles.create")}
            as="button"
            className="bg-green-900 text-white px-4 py-2 rounded-md"
          >
            Ajouter une salle
          </Link>
        </div>

        <AppTable
          data={salles.data}
          columns={columns}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          paginationLinks={salles.links}
        />
      </div>
      {showModal && selectedSalle && (
        <Delete salle={selectedSalle} onClose={() => setShowModal(false)} />
      )}
    </Layout>
  );
};

export default Index;
