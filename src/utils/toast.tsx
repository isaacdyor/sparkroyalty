import toast from "react-hot-toast";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";

export const sendToast = (
  subject: string,
  content: string,
  imageUrl?: string
) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } group pointer-events-auto flex w-full max-w-sm items-start rounded-lg bg-secondary`}
      >
        <div className="w-0 flex-1 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              {imageUrl && (
                <Image
                  className="h-10 w-10 rounded-full"
                  src={imageUrl}
                  alt=""
                  width={40}
                  height={40}
                />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">{subject}</p>

              <p className="mt-1 text-sm text-slate-300">{content}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => toast.remove(t.id)}
          className="cursor-default p-3"
        >
          <RxCross2 className="h-6 w-6 text-secondary group-hover:text-slate-400 hover:cursor-pointer hover:!text-slate-500" />
        </button>
      </div>
    ),
    {
      duration: 10000,
      position: "bottom-right",
    }
  );
};
