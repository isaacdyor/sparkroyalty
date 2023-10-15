import { useUser } from "@clerk/nextjs";
import React from "react";
import SocialConnection from "../shared/socialConnection";

const LinkedAccounts: React.FC = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    user?.verifiedExternalAccounts.length > 0 && (
      <div>
        <p className="mb-1 text-lg font-semibold">Linked Accounts</p>
        {user.verifiedExternalAccounts.map((account) => (
          <div key={account.id} className="flex items-center">
            <SocialConnection account={account} />
          </div>
        ))}
      </div>
    )
  );
};

export default LinkedAccounts;
