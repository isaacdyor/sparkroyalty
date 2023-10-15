import React, { useState } from "react";
import Image from "next/image";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { MdLocationPin } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import Modal from "../shared/modal";
import { type FounderType, ProfileType } from "~/types/types";
import SwitchProfileButton from "./switchProfile";
import DeleteProfileButton from "./deleteProfile";
import LinkedAccounts from "./linkedAccounts";
import MultiStarsComponent from "../review/multiStars";

const FounderProfileComponent: React.FC<{
  founder: FounderType;
  imageUrl: string;
}> = ({ founder, imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const month = founder.createdAt.toLocaleString("default", { month: "long" });
  const year = founder.createdAt.getFullYear();

  if (!founder.reviews) return null;

  return (
    <div className="mt-4 w-full max-w-3xl rounded border-2 border-border p-6">
      <div className="mb-4 flex items-center justify-center">
        <Image
          src={imageUrl}
          className="mr-6 h-24 w-24 rounded-full object-cover"
          alt={`@${founder.firstName}'s profile picture`}
          width={120}
          height={120}
        />

        <div className="flex flex-col">
          <div className="mb-1 flex items-center">
            <h1 className="mr-2 text-2xl font-semibold">{founder.fullName}</h1>
            <button onClick={openModal}>
              <Cog6ToothIcon className="ml-2 mt-1 h-6 w-6 text-white" />
            </button>
          </div>
          <p className="mb-3 text-gray-600">{founder.email}</p>
          <button className=" flex-grow rounded bg-blue-500 px-2 py-1 text-sm font-semibold text-white hover:bg-blue-600">
            <Link href="/founder/edit">Edit Profile</Link>
          </button>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <MultiStarsComponent reviews={founder.reviews} />
          {founder.reviews.length > 0 && (
            <div className="mt-1 text-blue-500 hover:text-blue-600">
              <Link href={`/founder/${founder.id}/reviews`}>
                See all reviews
              </Link>
            </div>
          )}
        </div>
      </div>

      <hr className="my-4 border-t-2 border-border" />

      <div className="mb-4 flex flex-col">
        <div className="mb-1 mr-4 flex items-center justify-between">
          <div className="flex items-center">
            <MdLocationPin className="mr-2 h-4 w-4 text-white" />
            <p className="text-md mr-2">From</p>
          </div>
          <p className="text-md font-semibold">{founder.country}</p>
        </div>
        <div className="mr-4 flex items-center justify-between">
          <div className="flex items-center">
            <FaUser className="mr-2 h-4 w-4 text-white" />
            <p className="text-md">Member since</p>
          </div>
          <p className="text-md font-semibold">
            {month} {year}
          </p>
        </div>
      </div>
      <hr className="my-4 border-t-2 border-border" />

      <div className="mb-4">
        <p className="text-lg font-semibold">About</p>
        <p>{founder.bio}</p>
      </div>
      <hr className="my-4 border-t-2 border-border" />

      <div className="mb-4">
        <p className="text-lg font-semibold">Education and Experience</p>
        <p>{founder.educationAndExperience}</p>
      </div>
      <hr className="my-4 border-t-2 border-border" />

      <LinkedAccounts />

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="modal-content flex w-80 flex-col rounded-lg bg-slate-800 shadow-md">
              <SwitchProfileButton profileType={ProfileType.FOUNDER} />
              <DeleteProfileButton profileType={ProfileType.FOUNDER} />
              <button onClick={closeModal} className="text-white">
                <div className="rounded-b-lg p-4 text-center hover:bg-slate-600">
                  Cancel
                </div>
              </button>
            </div>
          </div>
          ,
        </Modal>
      )}
    </div>
  );
};

export default FounderProfileComponent;
