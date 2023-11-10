import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";

const MessageListener: React.FC = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "us3",
    });

    const channel = pusher.subscribe("channel");

    const handler = () => {
      console.log("received event");
      setCount((prev) => prev + 1);
    };

    channel.bind("event", handler);

    return () => {
      pusher.unsubscribe("channel");
      pusher.unbind("event", handler);
      pusher.disconnect();
    };
  }, []);
  return <>{count} </>;
};

export default MessageListener;
