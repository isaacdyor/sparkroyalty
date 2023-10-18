import React, { useEffect, useRef, useState } from "react";
import { AiFillBell } from "react-icons/ai";
import { timeAgo } from "~/utils/helperFunctions";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import { GoDotFill } from "react-icons/go";
import { BsArchive } from "react-icons/bs";
import { api } from "~/utils/api";
import { NotificationClass } from "@prisma/client";

const NotificationIcon: React.FC = () => {
  const { data } = api.notifications.getCurrent.useQuery();

  const ctx = api.useContext();

  const { mutate: archiveNotification } = api.notifications.delete.useMutation({
    onSuccess: () => {
      void ctx.notifications.getCurrent.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const { mutate: markRead } = api.notifications.markRead.useMutation({
    onSuccess: async () => {
      void ctx.notifications.getCurrent.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error creating investment:", errorMessage);
    },
  });

  const ref = useRef<HTMLDivElement>(null);

  const unreadNotifications = data?.filter((n) => !n.read);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredNotificationId, setHoveredNotificationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    }

    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen]);

  if (!data) return null;

  return (
    <div ref={ref}>
      <div className="notifications-icon relative hover:cursor-pointer">
        {unreadNotifications && unreadNotifications.length > 0 ? (
          <div>
            <AiFillBell
              onClick={() => setIsModalOpen(true)}
              className=" h-7 w-7 text-white "
            />
            <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-sm text-white" />
          </div>
        ) : (
          <AiFillBell
            onClick={() => setIsModalOpen(true)}
            className="h-7 w-7 text-white"
          />
        )}
      </div>

      {isModalOpen && (
        <div className="absolute right-12 top-[57px] z-50 flex items-center justify-center rounded-lg bg-secondary bg-opacity-80">
          <div className=" flex max-h-[500px] w-80 flex-col overflow-scroll rounded-lg  shadow-md">
            <div className="flex items-center justify-between">
              <p className="m-2 text-lg">Notifications</p>
              <button
                onClick={() => setIsModalOpen(false)}
                className="mr-2 text-white hover:text-gray-400"
              >
                <RxCross2 className="h-6 w-6" />
              </button>
            </div>
            {data.length === 0 && (
              <p className="m-2 text-sm">No notifications</p>
            )}
            {data.map((notification) => (
              <div key={notification.id}>
                <hr className="border-t-2 border-slate-600" />
                <div
                  className="flex items-center justify-between pt-1 hover:cursor-pointer hover:bg-gray-700"
                  onMouseEnter={() => setHoveredNotificationId(notification.id)}
                  onMouseLeave={() => setHoveredNotificationId(null)}
                  onClick={() => {
                    if (!notification.read) {
                      markRead({
                        notificationId: notification.id,
                      });
                    }
                  }}
                >
                  <div className="mb-3 ml-2 flex w-60 flex-col">
                    <p className="text-md mb-2">{notification.subject}</p>
                    <p className="mb-2 text-sm">{notification.content}</p>
                    {notification.notificationClass ===
                      NotificationClass.APP_ACCEPTED &&
                      notification.link && (
                        <>
                          <Link
                            href={notification.link}
                            onClick={() => setIsModalOpen(false)}
                            className="mb-2 text-sm text-blue-500 hover:text-blue-600"
                          >
                            View investment
                          </Link>
                        </>
                      )}
                    {notification.notificationClass ===
                      NotificationClass.NEW_REVIEW &&
                      notification.link && (
                        <>
                          <Link
                            href={notification.link}
                            onClick={() => setIsModalOpen(false)}
                            className="mb-2 text-sm text-blue-500 hover:text-blue-600"
                          >
                            View review
                          </Link>
                        </>
                      )}
                    {notification.notificationClass ===
                      NotificationClass.FULL_PAY &&
                      notification.link && (
                        <>
                          <Link
                            href={notification.link}
                            onClick={() => setIsModalOpen(false)}
                            className="mb-2 text-sm text-blue-500 hover:text-blue-600"
                          >
                            Leave review
                          </Link>
                        </>
                      )}
                    {notification.notificationClass ===
                      NotificationClass.JOB_COMPLETE &&
                      notification.link && (
                        <>
                          <Link
                            href={notification.link}
                            onClick={() => setIsModalOpen(false)}
                            className="text-small mb-2 text-blue-500 hover:text-blue-600"
                          >
                            Leave Review
                          </Link>
                        </>
                      )}
                    {notification.notificationClass ===
                      NotificationClass.NEW_APPLICATION &&
                      notification.link && (
                        <>
                          <Link
                            href={notification.link}
                            onClick={() => setIsModalOpen(false)}
                            className="text-small mb-2 text-blue-500 hover:text-blue-600"
                          >
                            View Application
                          </Link>
                        </>
                      )}
                    <p className="mb-1 text-xs">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {!notification.read && (
                      <div className="mr-1">
                        <GoDotFill className="h-6 w-6 text-blue-500" />
                      </div>
                    )}
                    {hoveredNotificationId === notification.id && (
                      // <div className="group mr-3 hover:text-white">
                      <div
                        className={`group mr-1 rounded-2xl bg-gray-700 p-2 hover:bg-slate-500 ${
                          !notification.read ? "cursor-pointer" : ""
                        }`}
                      >
                        <BsArchive
                          className="h-4 w-4  text-slate-500 group-hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click event from propagating to the parent div
                            archiveNotification({
                              notificationId: notification.id,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
