import type { NextPage } from "next/types";

const Playground: NextPage = () => {
  return (
    <div className="flex h-screen w-full flex-col justify-center px-24 ">
      <div className="flex max-w-5xl">
        <div className="h-48 w-1/2  bg-purple-500" />
        <div className="h-48 w-1/2 bg-pink-500" />
      </div>
      <div className="flex h-48 w-full max-w-5xl items-center justify-between bg-primary">
        <div className="h-full w-48 flex-1 bg-green-500" />
        <div className="flex h-full">
          <div className="h-full w-24 bg-yellow-500" />
          <div className="h-full w-24 bg-orange-500" />
        </div>
        <p>code</p>
        <p>Fake unfortuntalt</p>
        <div className="h-full w-96 flex-1 bg-red-500" />
      </div>
    </div>
  );
};

export default Playground;
