import React, { useEffect, useRef, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { GoDotFill } from "react-icons/go";
import { BsArchive } from "react-icons/bs";
import { api } from "~/utils/api";
import { ActiveType, type NotificationType } from "~/types/types";
import { pusherClient } from "~/utils/pusher";
import { toPusherKey } from "~/utils/helperFunctions";
import { useUser } from "@clerk/nextjs";
import NotificationComponent from "./notificationComponent";

const NotificationIcon: React.FC = () => {
  const { data, isLoading } = api.notifications.getCurrent.useQuery();

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

  const unreadNotifications = notifications?.filter((n) => !n.read);

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
    <div ref={ref}>
      <div className="notifications-icon relative hover:cursor-pointer">
        {unreadNotifications && unreadNotifications.length > 0 ? (
          <div>
            <BellIcon
              onClick={() => setIsModalOpen(true)}
              className=" h-7 w-7 text-muted-foreground "
            />
            <div className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-blue-500 text-sm text-white" />
          </div>
        ) : (
          <BellIcon
            onClick={() => setIsModalOpen(true)}
            className="h-7 w-7 text-muted-foreground"
          />
        )}
      </div>

      {isModalOpen && (
        <div className="absolute right-12 top-[59px] z-50 flex w-full max-w-sm items-center justify-center rounded-lg bg-secondary bg-opacity-80">
          <div className=" flex max-h-[500px] w-full flex-col overflow-scroll rounded-lg  shadow-md">
            {data.length === 0 && (
              <p className="m-2 text-sm">No notifications</p>
            )}
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <hr
                  className={`${index != 0 && "border-t-2 border-slate-600"}`}
                />
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
                  <NotificationComponent
                    notification={notification}
                    setIsModalOpen={setIsModalOpen}
                  />
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
