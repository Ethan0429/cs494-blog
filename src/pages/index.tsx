import React from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="flex flex-col items-center justify-start my-auto mx-10 text-center">
      <h1 className="text-white text-6xl">{siteConfig.title}</h1>
      <p className="text-white italic">{siteConfig.tagline}</p>
      <Link
        to="/blog/"
        className="text-black bg-white p-2 rounded-lg hover:scale-105 transition-all duration-200 ease-out hover:bg-[#1fffd6] font-bold hover:text-black"
      >
        Start reading
      </Link>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Collection of various notes and tutorials."
    >
      <HomepageHeader />
    </Layout>
  );
}
