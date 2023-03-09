// react component that renders a link with an icon

import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import LinkIcon from "../../static/link-icon.svg";

interface LinkWithIconProps {
  to: string;
  text: string;
  className?: string;
}

export default function LinkWithIcon({
  to,
  text,
  className,
}: LinkWithIconProps): JSX.Element {
  return (
    <Link to={to} className={clsx("group", className)}>
      {text}
      <LinkIcon className="ml-0.5 translate-y-0.5 group-hover:fill-[#00ff37]" />
    </Link>
  );
}
