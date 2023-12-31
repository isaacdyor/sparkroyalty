import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { ActiveType } from "~/types/types";
import { updateMetadata } from "~/utils/helperFunctions";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "./searchBar";

const HamburgerMenu: React.FC = () => {
  const { user } = useUser();

  const ref = useRef<HTMLDivElement>(null);

  const [hamMenuOpen, setHamMenuOpen] = useState(false);

  const setFounderActive = () => {
    const unsafeMetadata = {
      investor: user!.unsafeMetadata.investor,
      founder: true,
      active: ActiveType.FOUNDER,
    };
    updateMetadata(user!, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const setInvestorActive = () => {
    const unsafeMetadata = {
      investor: true,
      founder: user!.unsafeMetadata.founder,
      active: ActiveType.INVESTOR,
    };
    updateMetadata(user!, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const founderContent = (
    <>
      <p className="whitespace-nowrap py-2 ">
        <Link
          className="hover:text-white"
          href="/investments/create"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Create Venture
        </Link>
      </p>

      <p className="whitespace-nowrap py-2">
        {" "}
        <Link
          className="hover:text-white"
          href="/founder/investments"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Your Ventures
        </Link>
      </p>
    </>
  );

  const investorContent = (
    <>
      <p className="whitespace-nowrap py-2 ">
        <Link
          className="hover:text-white"
          href="/investments"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Ventures
        </Link>
      </p>
      <p className="whitespace-nowrap py-2 ">
        <Link
          className="hover:text-white"
          href="/investor/jobs"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          My Jobs
        </Link>
      </p>
    </>
  );

  const iconGroup = (
    <>
      <p className="whitespace-nowrap py-2">
        <Link
          className="hover:text-white"
          href="/notifications"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Notifications
        </Link>
      </p>

      <p className="whitespace-nowrap py-2">
        <Link
          className="hover:text-white"
          href="/messages"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Messages
        </Link>
      </p>

      <p className="whitespace-nowrap py-2">
        <Link
          className="hover:text-white"
          href="/investments/saved"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Saved{" "}
        </Link>
      </p>
    </>
  );

  const activeContent = (
    <>
      {user?.unsafeMetadata.active == ActiveType.INVESTOR
        ? investorContent
        : founderContent}
      {iconGroup}
    </>
  );
  const inactiveContent = (
    <>
      {user?.unsafeMetadata.investor ? (
        <p className=" py-2">
          <Link
            className="hover:text-white"
            href="/investor"
            passHref
            onClick={() => {
              setHamMenuOpen(false);
              setInvestorActive();
            }}
          >
            Login as Investor
          </Link>
        </p>
      ) : (
        <p className="py-2">
          <Link
            className="hover:text-white"
            href="/investor/create"
            passHref
            onClick={() => setHamMenuOpen(false)}
          >
            Become an Investor
          </Link>
        </p>
      )}

      {user?.unsafeMetadata.founder ? (
        <p className="py-2">
          <Link
            className="hover:text-white"
            href="/founder"
            passHref
            onClick={() => {
              setHamMenuOpen(false);
              setFounderActive();
            }}
          >
            Login as Founder
          </Link>
        </p>
      ) : (
        <p className="py-2">
          <Link
            className="hover:text-white"
            href="/founder/create"
            passHref
            onClick={() => setHamMenuOpen(false)}
          >
            Become a Founder
          </Link>
        </p>
      )}
    </>
  );
  const signedInContent = (
    <>
      <p className="whitespace-nowrap py-2">
        <Link
          className="hover:text-white"
          href="/profile"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          Profile
        </Link>
      </p>

      {user?.unsafeMetadata.active == ActiveType.NONE
        ? inactiveContent
        : activeContent}
    </>
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref?.current && !ref.current.contains(e.target as Node)) {
        setHamMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div>
      {hamMenuOpen ? (
        <button
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none"
          onClick={() => setHamMenuOpen(false)}
        >
          <XMarkIcon className="h-8 w-8 pt-1.5" />
        </button>
      ) : (
        <button
          type="button"
          className="text-white hover:text-gray-300 focus:outline-none"
          onClick={() => setHamMenuOpen(true)}
        >
          <Bars3Icon className="h-8 w-8 pt-1.5" />
        </button>
      )}

      {hamMenuOpen && (
        <div className="absolute left-0 top-[63px] z-50 flex h-full w-full flex-col ">
          <div
            ref={ref}
            className="flex w-full flex-col border-b-2 border-b-border bg-background p-4 text-lg text-muted-foreground "
          >
            <SignedIn>{signedInContent}</SignedIn>
            <SignedOut>
              <p className="py-2">
                <SignInButton />
              </p>
              <p className="py-2">
                <SignUpButton
                  redirectUrl="/"
                  unsafeMetadata={{
                    active: "none",
                    investor: false,
                    founder: false,
                  }}
                />
              </p>
            </SignedOut>
          </div>
          <div className="h-full w-full bg-black bg-opacity-60" />
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
