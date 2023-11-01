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

const HamburgerMenu: React.FC = () => {
  const { user, isLoaded } = useUser();

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
      <Link
        href="/investments/create"
        passHref
        onClick={() => setHamMenuOpen(false)}
      >
        <p className="whitespace-nowrap py-2">Create Venture</p>
      </Link>

      <Link
        href="/founder/investments"
        passHref
        onClick={() => setHamMenuOpen(false)}
      >
        <p className="whitespace-nowrap py-2">Your Ventures</p>
      </Link>
    </>
  );

  const investorContent = (
    <>
      <Link
        href="/investor/jobs"
        passHref
        onClick={() => setHamMenuOpen(false)}
      >
        <p className="whitespace-nowrap py-2 ">My Jobs</p>
      </Link>
    </>
  );

  const iconGroup = (
    <>
      <Link
        href="/notifications"
        passHref
        onClick={() => setHamMenuOpen(false)}
      >
        <p className="whitespace-nowrap py-2">Notifications</p>
      </Link>
      <Link href="/messages" passHref onClick={() => setHamMenuOpen(false)}>
        <p className="whitespace-nowrap py-2">Messages</p>
      </Link>
      <p className="py-2">Saved</p>
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
        <Link
          href="/investor"
          passHref
          onClick={() => {
            setHamMenuOpen(false);
            setInvestorActive();
          }}
        >
          <p className=" py-2">Login as Investor</p>
        </Link>
      ) : (
        <Link
          href="/investor/create"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          <p className="py-2">Become an Investor</p>
        </Link>
      )}

      {user?.unsafeMetadata.founder ? (
        <Link
          href="/founder"
          passHref
          onClick={() => {
            setHamMenuOpen(false);
            setFounderActive();
          }}
        >
          <p className="py-2">Login as Founder</p>
        </Link>
      ) : (
        <Link
          href="/founder/create"
          passHref
          onClick={() => setHamMenuOpen(false)}
        >
          <p className="py-2">Become a Founder</p>
        </Link>
      )}
    </>
  );
  const signedInContent = (
    <>
      <Link href="/profile" passHref onClick={() => setHamMenuOpen(false)}>
        <p className="whitespace-nowrap py-2">Profile</p>
      </Link>
      {user?.unsafeMetadata.active == ActiveType.NONE
        ? inactiveContent
        : activeContent}
    </>
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref?.current && ref.current.contains(e.target as Node)) {
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
          <div className="flex w-full flex-col border-b-2 border-b-border bg-background p-4 text-lg text-muted-foreground ">
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
          <div ref={ref} className="h-full w-full bg-black bg-opacity-60" />
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
