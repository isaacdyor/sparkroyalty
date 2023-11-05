import { NotificationClass } from "@prisma/client";
import Link from "next/link";
import React from "react";
import type { NotificationType } from "~/types/types";
import { timeAgo } from "~/utils/helperFunctions";

const NotificationComponent: React.FC<{
  notification: NotificationType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ notification, setIsModalOpen }) => {
  return (
    <div className="flex flex-col p-2">
      <p className="text-md mb-2">{notification.subject}</p>
      <p className="mb-2 text-sm">{notification.content}</p>
      {notification.notificationClass === NotificationClass.APP_ACCEPTED &&
        notification.link && (
          <NotificationSkeleton
            notification={notification}
            setIsModalOpen={setIsModalOpen}
            linkName={"View Investment"}
          />
        )}

      {notification.notificationClass === NotificationClass.NEW_REVIEW &&
        notification.link && (
          <NotificationSkeleton
            notification={notification}
            setIsModalOpen={setIsModalOpen}
            linkName={"View Review"}
          />
        )}
      {(notification.notificationClass === NotificationClass.FULL_PAY ||
        notification.notificationClass === NotificationClass.JOB_COMPLETE) &&
        notification.link && (
          <NotificationSkeleton
            notification={notification}
            setIsModalOpen={setIsModalOpen}
            linkName={"Leave Review"}
          />
        )}

      {notification.notificationClass === NotificationClass.NEW_APPLICATION &&
        notification.link && (
          <NotificationSkeleton
            notification={notification}
            setIsModalOpen={setIsModalOpen}
            linkName={"View Application"}
          />
        )}
      <p className="mb-1 text-xs">{timeAgo(notification.createdAt)}</p>
    </div>
  );
};

const NotificationSkeleton: React.FC<{
  notification: NotificationType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  linkName: string;
}> = ({ notification, setIsModalOpen, linkName }) => {
  return (
    <>
      <p className="pb-2">
        <Link
          href={notification.link!}
          onClick={() => setIsModalOpen(false)}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          {linkName}
        </Link>
      </p>
    </>
  );
};

export default NotificationComponent;
