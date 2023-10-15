import React, { useState } from "react";
import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Unauthorized from "~/components/conditionals/unauthorized";
import Loading from "~/components/conditionals/loading";
import { ActiveType } from "~/types/types";
import { updateMetadata } from "~/utils/helperFunctions";
import CountryInput from "~/components/profile/countryInput";
import TextArea from "~/components/shared/textArea";

const CreateFounderPage: NextPage = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [educationAndExperience, setEducationAndExperience] = useState("");

  const { mutate } = api.founders.create.useMutation({
    onSuccess: async () => {
      await router.push("/founder");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating founder profile:", errorMessage);
    },
  });

  const createProfile = () => {
    if (!user) {
      console.log("User is not defined");
      return;
    }
    const unsafeMetadata = {
      investor: user.unsafeMetadata.investor,
      founder: true,
      active: ActiveType.FOUNDER,
    };
    updateMetadata(user, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
    mutate({
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      imaegeUrl: user.imageUrl ?? "",
      bio,
      country,
      educationAndExperience,
    });
  };

  if (!isLoaded) return <Loading />;

  if (!user) return <Unauthorized />;

  return (
    <div className="flex flex-grow items-center justify-center  p-4">
      <div className="w-full max-w-xl rounded border border-slate-600  p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">
          Create New Founder Profile
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createProfile();
          }}
        >
          <div className="mb-4">
            <label className="mb-2 block text-white">Bio</label>
            <TextArea
              text={bio}
              setText={setBio}
              placeHolder="Describe yourself..."
            />
          </div>
          <CountryInput country={country} setCountry={setCountry} />
          <div className="mb-4">
            <label className="mb-2 block text-white">
              Education and Experience
            </label>
            <TextArea
              text={educationAndExperience}
              setText={setEducationAndExperience}
              placeHolder="Describe your education and experience..."
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFounderPage;
