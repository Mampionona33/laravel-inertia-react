import AppTable from "@/Components/AppTable";
import LayoutTitle from "@/Components/LayoutTitle";
import Layout from "@/Layouts/layout/layout";
import { Link } from "@inertiajs/react";
import React from "react";

const Index = () => {
  const columns = [
    { header: "Nom", accessor: "nom" },
    { header: "Description", accessor: "description" },
  ];

  const data = [];

  return (
    <Layout>
      <LayoutTitle title={"Liste des methodes de paiement"} />
      <div className="flex justify-between flex-wrap flex-col gap-4">
        <div className="flex justify-end">
          <Link
            href=""
            as="button"
            className="bg-green-900 text-white px-4 py-2 rounded-md"
          >
            Ajouter une methode
          </Link>
        </div>
        <div>
          <AppTable columns={columns} data={data} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
