import Link from "next/link";
import React from "react";

const CreateFounder: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Link href="/founder/create">Create a founder profile here</Link>
    </div>
  );
};

export default CreateFounder;
