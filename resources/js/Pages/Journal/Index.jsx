import LayoutTitle from "@/Components/LayoutTitle";
import Layout from "@/Layouts/layout/layout";
import React from "react";
import JournalPageHeader from "@/Components/JournalPageHeader";
import JournalPageBody from "@/Components/JournalPageBody";

const Index = () => {
  return (
    <Layout>
      <div>
        <LayoutTitle title="Journal" />
        <JournalPageHeader />
        <JournalPageBody />
      </div>
    </Layout>
  );
};

export default Index;
