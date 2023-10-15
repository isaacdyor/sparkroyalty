import type { NextPage } from "next";
import { api } from "~/utils/api";
import Link from "next/link";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";

const FounderNotificationsPage: NextPage = () => {
  const ctx = api.useContext();

  const { data, isLoading, error } =
    api.founderNotifications.getCurrent.useQuery();

  const { mutate: deleteNotification } =
    api.founderNotifications.delete.useMutation({
      onSuccess: () => {
        void ctx.founderNotifications.getCurrent.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        console.error("Error creating investment:", errorMessage);
      },
    });

  const { mutate: markRead } = api.founderNotifications.markRead.useMutation({
    onSuccess: async () => {
      void ctx.founderNotifications.getCurrent.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        If you see this check out founder/notifications
      </div>
    );
  }

  if (error) return <Unauthorized />;

  return (
    <div className="flex items-center justify-center bg-black">
      <div className="mx-auto grid max-w-6xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Investments
        </h1>
        {data.map((notification) => (
          <div
            key={notification.id}
            className={`rounded bg-gray-800 p-4 text-white ${
              notification.read ? "text-normal" : "font-semibold"
            }`}
            onClick={() => {
              if (!notification.read) {
                markRead({
                  notificationId: notification.id,
                });
              }
            }}
          >
            <p className="mb-2 text-sm text-gray-300">
              Subject: {notification.subject}
            </p>
            <p className="mb-2 text-sm text-gray-300">
              Content: {notification.content}
            </p>
            {notification.type === "NEW_REVIEW" && notification.link && (
              <>
                <Link
                  href={notification.link}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Read review
                </Link>
              </>
            )}
            {notification.type === "JOB_COMPLETE" && notification.link && (
              <>
                <Link
                  href={notification.link}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Leave Review
                </Link>
              </>
            )}
            {notification.type === "NEW_APPLICATION" && notification.link && (
              <>
                <Link
                  href={notification.link}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Application
                </Link>
              </>
            )}
            <button
              className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={() => {
                deleteNotification({
                  notificationId: notification.id,
                });
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FounderNotificationsPage;
