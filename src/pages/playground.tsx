import { NotificationClass } from "@prisma/client";
import type { NextPage } from "next/types";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

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
          sendNotification({
            subject: "subject",
            content: "content",
            founderId: "user_2WnIEBwcE03MsmAtORSOlD41hFu",
            notificationClass: NotificationClass.APP_ACCEPTED,
            link: "hello",
          });
          toast("Hello World");
        }}
      >
        Send a noti
      </button>
    </div>
  );
};

export default Playground;
