import React from "react";

function CertificateCard({
  name,
  date,
  org,
}: {
  name: string;
  date: string;
  org: string;
}) {
  return (
    <div className="min-w-[17rem] h-[9rem] bg-[#1570EF] rounded-md flex flex-col justify-between p-4 text-white flex-shrink-0 shadow-lg">
      <div className="text-xl font-bold">{name}</div>
      <div className="text-sm">
        <p>취득일: {date}</p>
        <p>발급기관: {org}</p>
      </div>
    </div>
  );
}

export default CertificateCard;
