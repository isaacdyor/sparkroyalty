import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";
import { SlMenu } from "react-icons/sl";
import { ActiveType } from "~/types/types";
import MessageIcon from "../messages/messageIcon";
import FounderNotificationIcon from "../notifications/founderNotificationIcon";
import InvestorNotificationIcon from "../notifications/investorNotificationIcon";
import SearchBar from "./searchBar";

const HamburgerMenu = () => {
  const { user, isLoaded } = useUser();
  let specificContent;
  const [hamMenuOpen, setHamMenuOpen] = useState(false);

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
    <div className="relative">
      <div className="md:hidden">
        <button
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none"
          onClick={() => setHamMenuOpen(!hamMenuOpen)}
        >
          <SlMenu className="h-6 w-6 pt-1.5" />
        </button>
      </div>

      {/* Step 3: Conditionally render the links */}
      {hamMenuOpen && (
        <ul className="absolute flex max-w-5xl grow flex-col items-center justify-end space-x-6">
          {content}
        </ul>
      )}
    </div>
  );
};

export default HamburgerMenu;
