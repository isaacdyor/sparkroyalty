import React, { useEffect, useRef, useState } from "react";
import { timeAgo } from "~/utils/helperFunctions";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { BsArchive } from "react-icons/bs";
import { api } from "~/utils/api";
import { NotificationClass } from "@prisma/client";
import { ActiveType, type NotificationType } from "~/types/types";
import { pusherClient } from "~/utils/pusher";
import { toPusherKey } from "~/utils/helperFunctions";
import { useUser } from "@clerk/nextjs";

const NotificationIcon: React.FC = () => {
  const { data, isLoading } = api.notifications.getCurrent.useQuery();

  console.log(data);

  const { user, isLoaded } = useUser();

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

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredNotificationId, setHoveredNotificationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isLoading && data) {
      setNotifications(data);
    }
  }, [isLoading, data]);

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

  // subscribe to pusher
  // useEffect(() => {
  //   if (isLoaded) {
  //     if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
  //       pusherClient.subscribe(toPusherKey(`founder:${user?.id}`));
  //     } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
  //       pusherClient.subscribe(toPusherKey(`investor:${user?.id}`));
  //     }
  //   }
  //   const newNotificationHandler = (notification: NotificationType) => {
  //     const date = new Date(notification.createdAt);
  //     const newNotification = {
  //       ...notification,
  //       createdAt: date,
  //     };
  //     setNotifications((prevNotifications) => {
  //       const updatedNotifications = [
  //         ...(prevNotifications || []),
  //         newNotification,
  //       ];
  //       return updatedNotifications;
  //     });
  //     void ctx.notifications.getCurrent.invalidate();
  //     // toast
  //   };

  //   pusherClient.bind("new-notification", newNotificationHandler);

  //   return () => {
  //     if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
  //       pusherClient.unsubscribe(toPusherKey(`founder:${user?.id}`));
  //     } else if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
  //       pusherClient.unsubscribe(toPusherKey(`investor:${user?.id}`));
  //     }
  //     pusherClient.unbind("new-notification", newNotificationHandler);
  //   };
  // }, [user, isLoaded, ctx.notifications.getCurrent]);

  if (!data) return null;

  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <div className=" w-full max-w-2xl p-10 pt-4">
        <p className="w-full pb-4 text-left text-4xl">Notifications</p>
        <div className=" w-full rounded-lg border-2 border-border">
          {data.length === 0 && <p className="m-2 text-sm">No notifications</p>}
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
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
              <div
                className={`flex w-full flex-col p-3 ${
                  index != 0 && "border-t border-border"
                }`}
              >
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationIcon;
