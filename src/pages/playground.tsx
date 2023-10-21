import { NotificationClass } from "@prisma/client";
import type { NextPage } from "next/types";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import { sendToast } from "~/utils/toast";

const Playground: NextPage = () => {
  const { mutate: sendNotification } = api.notifications.create.useMutation({
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <button
        className="rounded-xl bg-primary p-4 text-4xl"
        onClick={() => {
          sendToast("isaac dyor", "got ya girl");
        }}
      >
        Send a notification
      </button>
    </div>
  );
};

export default Playground;
