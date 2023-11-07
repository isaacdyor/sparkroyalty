import { api } from "~/utils/api";
import type { NextPage } from "next/types";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import InvestorSkill from "~/components/profile/investorSkill";
import Unauthorized from "~/components/conditionals/unauthorized";
import type { ExperienceLevelType } from "@prisma/client";
import router from "next/router";
import Loading from "~/components/conditionals/loading";
import { ActiveType } from "~/types/types";
import { updateMetadata } from "~/utils/helperFunctions";
import CountryInput from "~/components/profile/countryInput";
import TextArea from "~/components/shared/textArea";

interface Skill {
  skill: string;
  experience: ExperienceLevelType | "";
}

interface SkillInput {
  skill: string;
  experience: ExperienceLevelType;
}

const NewInvestor: NextPage = () => {
  const { mutate } = api.investors.create.useMutation({
    onSuccess: async () => {
      await router.push("/investor");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating creating profile:", errorMessage);
    },
  });

  const { user, isLoaded } = useUser();

  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<Skill[]>([
    { skill: "", experience: "" },
  ]);
  const [country, setCountry] = useState("");
  const [educationAndExperience, setEducationAndExperience] = useState("");

  const createProfile = async () => {
    if (!user) {
      console.log("User is not defined");
      return;
    }
    const unsafeMetadata = {
      investor: true,
      founder: user.unsafeMetadata.founder,
      active: ActiveType.INVESTOR,
    };
    updateMetadata(user, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
    mutate({
      fullName: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      imageUrl: user.imageUrl ?? "",
      title,
      bio,
      skills: skills as SkillInput[],
      country,
      educationAndExperience,
    });
    await router.push("/profile");
  };

  if (!isLoaded) return <Loading />;

  if (!user) return <Unauthorized />;

  return (
    <div className="flex flex-grow items-center justify-center  p-4">
      <div className="w-full max-w-xl rounded border-2 border-border p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">
          Create New Investor Profile
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createProfile().catch((err) => {
              console.error("Error creating profile", err);
            });
          }}
        >
          <div className="mb-4">
            <label className="mb-2 block text-white">Occupation</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full rounded bg-input px-4 py-2 text-white "
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-white">Bio</label>
            <TextArea
              text={bio}
              setText={setBio}
              placeHolder="Describe yourself..."
            />
          </div>
          <InvestorSkill skills={skills} setSkills={setSkills} />
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

export default NewInvestor;
