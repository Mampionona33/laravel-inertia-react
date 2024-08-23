import LayoutTitle from "@/Components/LayoutTitle";
import Layout from "@/Layouts/layout/layout";
import { usePage } from "@inertiajs/react";
import React from "react";
import Tabs from "rc-tabs";

const Detail = () => {
  const { reservation } = usePage().props;
  const [activeKey, setActiveKey] = React.useState("1");

  const onTabChange = (key) => {
    setActiveKey(key);
  };

  const items = [
    {
      key: "1",
      label: <p>Acompte</p>,
      children: (
        <div>
          <p>Je suis le contenu de l'onglet Acompte</p>
        </div>
      ),
    },
    {
      key: "2",
      label: <p>Mouvements de sortie</p>,
      children: (
        <div>
          <p>Contenu de Mouvements de sortie</p>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <LayoutTitle title="Details de la reservation" />
      <Tabs
        activeKey={activeKey}
        tabBarStyle={{ cursor: "pointer", display: "flex" }}
        tabPosition="top"
        items={items}
        className="md:w-[70%] w-full mx-auto p-2 border-1"
        onChange={onTabChange}
        style={{ color: "black" }}
        destroyInactiveTabPane
        animated
      />
    </Layout>
  );
};

export default Detail;
