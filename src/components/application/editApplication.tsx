import Link from "next/link";
import React from "react";

const EditApplication: React.FC<{ applicationId: string }> = ({
  applicationId,
}) => {
  return (
    <button className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
      <Link href={`/applications/${applicationId}/edit`}>Edit</Link>
    </button>
  );
};

export default EditApplication;
