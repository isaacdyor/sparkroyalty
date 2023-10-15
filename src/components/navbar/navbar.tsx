import Link from "next/link";
import {
  SignInButton,
  useUser,
  UserButton,
  SignedIn,
  SignedOut,
  SignUpButton,
} from "@clerk/nextjs";
import InvestorNotificationIcon from "../notifications/investorNotificationIcon";
import FounderNotificationIcon from "../notifications/founderNotificationIcon";
import { ActiveType } from "~/types/types";
import SearchBar from "./searchBar";
import MessageIcon from "../messages/messageIcon";
import { useEffect, useState } from "react";
import HamburgerMenu from "./hamburgerMenu";

const Navbar = () => {
  const { user, isLoaded } = useUser();
  let specificContent;
  const [isBigScreen, setIsBigScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsBigScreen(window.innerWidth >= 640);
    };

    window.addEventListener("resize", checkScreenSize);

    checkScreenSize();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  if (!isLoaded) {
    specificContent = null;
  }

  if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
    specificContent = (
      <>
        <li className="grow">
          <SearchBar />
        </li>
        <li>
          <Link href="/investor/jobs" passHref>
            <p className="text-white">My Jobs</p>
          </Link>
        </li>
        <li>
          <Link href="/applications" passHref>
            <p className="text-white">My Applications</p>
          </Link>
        </li>
        <li>
          <Link href="/investor" passHref>
            <p className="text-white">Profile</p>
          </Link>
        </li>
        <li>
          <InvestorNotificationIcon />
        </li>
        <li>
          <MessageIcon />
        </li>
      </>
    );
  } else if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
    specificContent = (
      <>
        <li>
          <Link href="/investments/create" passHref>
            <p className="text-white">Create Startup Post</p>
          </Link>
        </li>
        <li>
          <Link href="/founder/investments" passHref>
            <p className="text-white">Investments</p>
          </Link>
        </li>
        <li>
          <Link href="/founder" passHref>
            <p className="text-white">Profile</p>
          </Link>
        </li>
        <li>
          <FounderNotificationIcon />
        </li>
        <li>
          <MessageIcon />
        </li>
      </>
    );
    // } else if (active === "") {
  } else if (user) {
    specificContent = (
      <>
        <li>
          {user?.unsafeMetadata.investor ? (
            <Link href="/investor/login" passHref>
              <p className="text-white">Login as Investor</p>
            </Link>
          ) : (
            <Link href="/investor/create" passHref>
              <p className="text-white">Become an Investor</p>
            </Link>
          )}
        </li>
        <li>
          {user?.unsafeMetadata.founder ? (
            <Link href="/founder/login" passHref>
              <p className="text-white">Login as Founder</p>
            </Link>
          ) : (
            <Link href="/founder/create" passHref>
              <p className="text-white">Become a Founder</p>
            </Link>
          )}
        </li>
      </>
    );
  }

  const content = (
    <>
      {specificContent}

      <SignedIn>
        <li>
          <UserButton afterSignOutUrl="/" />
        </li>
      </SignedIn>
      <SignedOut>
        <li>
          <SignInButton />
        </li>
        <li>
          {" "}
          <SignUpButton
            redirectUrl="/"
            unsafeMetadata={{
              active: "none",
              investor: false,
              founder: false,
            }}
          />
        </li>
      </SignedOut>
    </>
  );
  return (
    <nav className="bg-black-500 border-b border-slate-600 p-4">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" passHref>
          <p className="ml-2 mr-8 text-xl font-semibold text-white md:ml-6 lg:ml-8">
            Sparket
          </p>
        </Link>
        {isBigScreen ? (
          <ul className="flex max-w-5xl grow items-center justify-end space-x-6">
            {content}
          </ul>
        ) : (
          <HamburgerMenu />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
