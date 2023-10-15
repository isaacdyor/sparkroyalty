import React from "react";
import MoreInfo from "../shared/moreInfo";
import TextArea from "../shared/textArea";
import InvestmentSkill from "./investmentSkill";
import WorkTypeInput from "./workTypeInput";
import { PaymentBasisType, type FrequencyType } from "@prisma/client";

interface PayoutFormProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  workType: string;
  setWorkType: React.Dispatch<React.SetStateAction<string>>;
  workDescription: string;
  setWorkDescription: React.Dispatch<React.SetStateAction<string>>;
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  paymentBasis: PaymentBasisType;
  setPaymentBasis: React.Dispatch<React.SetStateAction<PaymentBasisType>>;
  percent: string;
  setPercent: React.Dispatch<React.SetStateAction<string>>;
  totalPayout: string;
  setTotalPayout: React.Dispatch<React.SetStateAction<string>>;
  setPayoutFrequency: React.Dispatch<React.SetStateAction<FrequencyType>>;
  extraDetails: string;
  setExtraDetails: React.Dispatch<React.SetStateAction<string>>;
}

const InvestmentForm: React.FC<PayoutFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  workType,
  setWorkType,
  workDescription,
  setWorkDescription,
  skills,
  setSkills,
  paymentBasis,
  setPaymentBasis,
  percent,
  setPercent,
  totalPayout,
  setTotalPayout,
  setPayoutFrequency,
  extraDetails,
  setExtraDetails,
}) => {
  return (
    <>
      <h2 className="mb-4 text-xl font-semibold text-white">
        Investment Details
      </h2>
      <div className="mb-4">
        <label className="mb-2 block text-white">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full rounded bg-neutral-800 px-4 py-2 text-white"
          required
        />
      </div>
      <div className="mb-4">
        <MoreInfo
          label="Description"
          infoText="Describe your company. Inlcude the problem you're solving, your solution, and how far along you are. Be detailed!"
        />
        <TextArea
          text={description}
          setText={setDescription}
          placeHolder="Describe your company..."
        />
      </div>
      <WorkTypeInput workType={workType} setWorkType={setWorkType} />
      <div className="mb-4">
        <MoreInfo
          label="Work description"
          infoText="Describe the service you need done. Include the scope of the work and the deliverables. Be detailed!"
        />
        <TextArea
          text={workDescription}
          setText={setWorkDescription}
          placeHolder="Describe the service you are looking for..."
        />
      </div>
      <InvestmentSkill skills={skills} setSkills={setSkills} />
      <hr className="my-4 border-t-2 border-slate-600" />
      <h2 className="mb-4 text-xl font-semibold text-white">Payout Details</h2>
      <div className="flex flex-col">
        <div className="flex">
          <div className="mb-4 w-1/2 ">
            <MoreInfo
              label="Royalty Payment Basis"
              infoText="Whether your royalty percentage will be calculated based on revenue or profit"
            />
            <button
              className={`w-1/2 rounded-l px-4 py-2 font-semibold text-white  ${
                paymentBasis === PaymentBasisType.REVENUE
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setPaymentBasis(PaymentBasisType.REVENUE);
              }}
            >
              Revenue
            </button>
            <button
              className={`w-1/2 rounded-r px-4 py-2 font-semibold text-white  ${
                paymentBasis === PaymentBasisType.PROFIT
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-neutral-800 hover:bg-neutral-700"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setPaymentBasis(PaymentBasisType.PROFIT);
              }}
            >
              Profit
            </button>
          </div>
          <div className="w-5/12 pb-4 pl-10">
            <MoreInfo
              label={`Percent of ${paymentBasis.toLowerCase()}`}
              infoText={`The percent of your ${paymentBasis.toLowerCase()} you will pay to the worker.`}
            />
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="100"
                value={percent}
                placeholder="0"
                onChange={(e) => {
                  const inputValue = parseFloat(e.target.value);
                  setPercent(inputValue.toString());
                }}
                className="input grow rounded bg-neutral-800 px-4 py-2 text-white"
                required
              />
              <p className="pl-1">%</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mb-4 w-1/2">
            <MoreInfo
              label="Payment Frequency"
              infoText="How often payments will be sent. Along with each payment you will include a brief report of your revenue, progress, and plans for the future."
            />
            <select
              className="w-full rounded border border-gray-600 bg-neutral-800 py-2 pl-1 text-white focus:outline-none"
              id="payout-frequency-dropdown"
              onChange={(e) => {
                setPayoutFrequency(e.target.value as FrequencyType);
              }}
            >
              <option className="bg-gray-800 text-white" value="MONTHLY">
                Monthly
              </option>
              <option className="bg-gray-800 text-white" value="QUARTERLY">
                Quarterly
              </option>
              <option
                className="bg-gray-800 text-blue-500"
                value="SEMI_ANNUALLY"
              >
                Semi-Annually
              </option>
              <option className="bg-gray-800 text-blue-500" value="ANNUALLY">
                Annually
              </option>
            </select>
          </div>
          <div className="w-5/12 pb-4 pl-10">
            <MoreInfo
              label="Total payout ($)"
              infoText="The maximum amount you will pay the worker assuming everything goes perfectly. Once this value is met there are no more royalty payments."
            />
            <div className="flex items-center">
              <input
                type="number"
                min="0"
                max="10000000"
                value={totalPayout}
                placeholder="0"
                onChange={(e) => {
                  const inputValue = parseFloat(e.target.value);
                  setTotalPayout(inputValue.toString());
                }}
                className="input w-full rounded bg-neutral-800 px-4 py-2 text-white"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <hr className="my-4 border-t-2 border-slate-600" />
      <div className="mb-4">
        <MoreInfo
          label="Extra Details"
          infoText="Please include any extra details you think are important."
        />
        <TextArea
          text={extraDetails}
          setText={setExtraDetails}
          placeHolder="Describe any extra details..."
        />
      </div>
    </>
  );
};

export default InvestmentForm;
