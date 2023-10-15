import type { NextPage } from "next/types";

const Playground: NextPage = () => {
  console.log("p");
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-96 w-96 flex-col bg-red-600">
        <div className="overflow-scroll"></div>
        <p>Wowza woo</p>
        <p>rage commit</p>
        <p>hello</p>
        <div className="h-20 w-full flex-shrink-0 bg-blue-500"></div>
      </div>
    </div>
  );
};

export default Playground;
