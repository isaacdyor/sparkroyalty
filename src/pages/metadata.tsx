import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next/types";
import { ActiveType } from "~/types/types";

const Home: NextPage = () => {
  const { user } = useUser();

  <p>Hello</p>;

  if (!user) return null;

  const updateMetadata = async () => {
    try {
      const response = await user.update({
        unsafeMetadata: {
          investor: false,
          founder: true,
          active: ActiveType.FOUNDER,
        },
      });
      if (response) {
        console.log("res", response);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  const changeMetadata = async (metadata: ActiveType) => {
    try {
      const response = await user.update({
        unsafeMetadata: {
          investor: user.unsafeMetadata.investor,
          founder: user?.unsafeMetadata.founder,
          active: metadata,
        },
      });
      if (response) {
        console.log("res", response);
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  const handleButtonClick = () => {
    updateMetadata().catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const onClick = (metadata: ActiveType) => {
    changeMetadata(metadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const log = () => {
    console.log(user?.unsafeMetadata);
  };

  return (
    <div>
      <button
        className="bg-gradient m-5 rounded-lg p-5 text-white"
        onClick={handleButtonClick}
      >
        Reset Metadata
      </button>
      <button
        className="bg-gradient m-5 rounded-lg p-5 text-white"
        onClick={() => onClick(ActiveType.INVESTOR)}
      >
        Investor
      </button>
      <button
        className="bg-gradient m-5 rounded-lg p-5 text-white"
        onClick={() => onClick(ActiveType.FOUNDER)}
      >
        Founder
      </button>
      <button
        className="bg-gradient m-5 rounded-lg p-5 text-white"
        onClick={log}
      >
        Log
      </button>
    </div>
  );
};

export default Home;
