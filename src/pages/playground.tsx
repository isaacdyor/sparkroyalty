import React, { useEffect } from "react";
import Pusher from "pusher-js";

const MessageListener: React.FC = () => {
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "us3",
    });
    console.log("subscribing");
    pusher.subscribe("channel");

    const handler = () => {
      console.log("event");
    };

    pusher.bind("event", handler);

    return () => {
      console.log("unsubscribing");
      pusher.unsubscribe("channel");
      pusher.unbind("event", handler);
      pusher.disconnect();
    };
  }, []);
  return <>hello </>;
};

export default MessageListener;
