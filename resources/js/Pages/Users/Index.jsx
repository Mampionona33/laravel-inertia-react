import PrimaryButton from "@/Components/PrimaryButton";
import Layout from "@/Layouts/layout/layout";
import React from "react";
import { router, Link } from "@inertiajs/react";
import Tooltip from "react-simple-tooltip";

const List = ({ users }) => {
  React.useEffect(() => {
    console.log(users);
  }, [users]);

  const handlePageChange = (url) => {
    router.get(url);
  };

  return (
    <Layout>
      <div className="flex justify-between flex-wrap flex-col gap-4">
        <div className="flex justify-end">
          <PrimaryButton href={route("users.create")}>
            Ajouter un utilisateur
          </PrimaryButton>
        </div>
        <div className="shadow-sm border rounded-md overflow-hidden p-4">
          <table className="table-auto border-collapse w-full">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="border border-green-500 px-4 py-2">Nom</th>
                <th className="border border-green-500 px-4 py-2">Email</th>
                <th className="border border-green-500 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.data.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 ? "bg-green-100" : "bg-white"}
                >
                  <td className="border px-4 py-2 border-green-500">
                    {user.name}
                  </td>
                  <td className="border px-4 py-2 border-green-500">
                    {user.email}
                  </td>
                  <td className="border  px-4 py-2  border-green-500">
                    <div className="flex justify-center gap-4">
                      <Tooltip
                        content="Editer l'utilisateur"
                        placement="bottom"
                        style={{
                          padding: "4px",
                          borderRadius: "5px",
                          fontSize: "14px",
                        }}
                      >
                        <Link
                          href={route("users.edit", user.id)}
                          className="hover:text-green-500"
                          as="button"
                          type="button"
                        >
                          <i className="pi pi-pencil"></i>
                        </Link>
                      </Tooltip>
                      <Tooltip
                        content="Supprimer l'utilisateur"
                        placement="bottom"
                        style={{
                          padding: "4px",
                          borderRadius: "5px",
                          fontSize: "14px",
                        }}
                      >
                        <button
                          onClick={() =>
                            router.delete(route("users.destroy", user.id))
                          }
                          className="hover:text-red-500"
                          as="button"
                          type="button"
                        >
                          <i className="pi pi-trash"></i>
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {users.links.map((link, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(link.url)}
                className={`px-3 py-1 mx-1 rounded ${
                  link.active
                    ? "bg-green-500 text-white"
                    : "bg-white text-green-500"
                } ${!link.url ? "cursor-not-allowed" : ""}`}
                disabled={!link.url}
              >
                {link.label.replace("&laquo;", "«").replace("&raquo;", "»")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default List;
