import Link from "next/link";
import React from "react";

const EditInvestmentButton: React.FC<{ investmentId: string }> = ({
  investmentId,
}) => {
  return (
    <button className="rounded-full bg-primary px-6 py-2 font-semibold text-white hover:bg-blue-600">
      <Link href={`/investments/${investmentId}/edit`}>Edit</Link>
    </button>
  );
};

export default EditInvestmentButton;
