import React from "react";
import ContentLoader from "react-content-loader";

const HeaderSkeleton = () => (
    <ContentLoader
        speed={2}
        width={90}
        height={100}
        viewBox="0 0 90 100"
        backgroundColor="#444444"
        foregroundColor="##45453a"
    >
        <rect x="0" y="286" rx="16" ry="16" width="280" height="101" />
        <rect x="0" y="396" rx="0" ry="0" width="142" height="39" />
        <rect x="3" y="256" rx="17" ry="17" width="280" height="20" />
        <rect x="155" y="397" rx="24" ry="24" width="116" height="37" />
        <rect x="0" y="33" rx="0" ry="0" width="90" height="34" />
    </ContentLoader>
);

export default HeaderSkeleton;

