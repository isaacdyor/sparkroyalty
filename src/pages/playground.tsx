import Pusher from "pusher-js";
import React, { useEffect, useState } from "react";
// import { pusherClient } from "~/utils/pusher";

const MessageListener: React.FC = () => {
  console.log("Component is rendering"); // Log each render
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   console.log("Effect is running"); // Log when useEffect runs
  //   const pusherClient = new Pusher("YOUR_APP_KEY", {
  //     cluster: "us3",
  //     // Additional options if needed
  //   });
  //   const channel = pusherClient.subscribe("channel");

  //   const eventHandler = () => {
  //     console.log("event");
  //   };
  //   channel.bind("event", eventHandler);

  //   return () => {
  //     console.log("cleaning up");
  //     // Unbind the event handler
  //     channel.unbind("event", eventHandler);

  //     // Unsubscribe from the channel to avoid memory leaks
  //     pusherClient.unsubscribe("channel");

  //     // Disconnect from Pusher
  //     pusherClient.disconnect();
  //   };
  // }, []);
  return <>{count} </>;
};

export default MessageListener;
