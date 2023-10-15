import Link from "next/link";
import type { NextPage } from "next/types";
import { useUser } from "@clerk/nextjs";
import { ActiveType } from "~/types/types";

const Home: NextPage = () => {
  const { user, isLoaded } = useUser();
  let buttonContent;

  if (!isLoaded) {
    buttonContent = null;
  }

  if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
    buttonContent = (
      <div className="mb-6 flex flex-row pt-4 md:mb-0 md:flex-col lg:flex-row">
        <button className="bg-gradient mr-2 w-44 rounded-xl p-2 text-lg md:mb-2 lg:mb-0">
          <Link href="/investments">Find an investment</Link>
        </button>

        <div className="bg-gradient flex w-44 items-center justify-center rounded-xl ">
          <div className=" flex h-[calc(100%-3px)] w-[calc(100%-3px)] items-center rounded-xl bg-black">
            <button className="text-gradient rounded-full p-2 text-center text-lg">
              <Link href="/investor/jobs">View jobs</Link>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
    buttonContent = (
      <div className="mb-6 flex flex-row pt-4 md:mb-0 md:flex-col lg:flex-row">
        <button className="bg-gradient mr-2 w-44 rounded-xl p-2 text-lg md:mb-2 lg:mb-0">
          <Link href="/investment/create">Create Investment</Link>
        </button>

        <div className="bg-gradient flex w-40 items-center justify-center rounded-xl">
          <div className=" flex h-[calc(100%-3px)] w-[calc(100%-3px)] items-center rounded-xl bg-black">
            <button className="text-gradient rounded-full p-2 text-center text-lg">
              <Link href="/founder/investments">Your investments</Link>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    buttonContent = (
      <div className="mb-6 flex flex-row pt-4 md:mb-0 md:flex-col lg:flex-row">
        <button className="bg-gradient mr-2 w-44 rounded-xl p-2 text-lg md:mb-2 lg:mb-0">
          <Link href="/investor/create">Become an Investor</Link>
        </button>

        <div className="bg-gradient flex w-44 items-center justify-center rounded-xl">
          <div className=" flex h-[calc(100%-3px)] w-[calc(100%-3px)] items-center rounded-xl bg-black">
            <button className="text-gradient rounded-full p-2 text-center text-lg">
              <Link href="/founder/create">Become a founder</Link>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:px-16 lg:px-24 xl:pb-0">
      <div className="max-w-8xl w-full">
        <div className="max-w-8xl text-gradient w-full pb-8">
          <h1 className="text-8xl text-transparent">
            Welcome to Spark Royalty
          </h1>
          <p className="text-7xl text-transparent">
            A royalty based freelancing market
          </p>
        </div>

        <div className="mt-14 flex w-full flex-col md:flex-row">
          <div className="flex flex-col border border-transparent border-r-slate-600 border-t-slate-600 pt-4 md:w-1/2">
            <p className="pb-4 pr-2 text-2xl">
              Connecting entrepreneurs with industry experts to create joint
              risk startups through royalties and smart contracts.
            </p>
            {buttonContent}
          </div>
          <div className="flex md:w-1/2 ">
            <div className="w-1/2 grow border border-transparent border-r-slate-600 border-t-slate-600">
              <div className="flex flex-col items-center pt-4">
                <p className="pb-3 text-7xl">
                  $4.2<span className="text-vw-md">B+</span>
                </p>
                <p className=" px-4 text-center text-lg text-slate-400">
                  Generated through our platform
                </p>
              </div>
            </div>
            <div className="grow border border-transparent border-r-slate-600 border-t-slate-600 md:w-1/2">
              <div className="flex flex-col items-center pt-4 text-center">
                <p className="pb-3 text-7xl">
                  700<span className="text-vw-md">K+</span>
                </p>
                <p className="px-2 text-lg text-slate-400">
                  Succesful business partnerships
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
