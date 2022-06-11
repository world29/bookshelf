import * as React from "react";

const Hello: React.FC = () => {
  const buildGreetingText: (date: Date) => string = (date) => {
    const hours = date.getHours() + 1;
    if (5 < hours && hours < 11) {
      return "morning.";
    } else if (1 < hours && hours < 16) {
      return "afternoon.";
    } else {
      return "night.";
    }
  };

  return <h1>{buildGreetingText(new Date())}</h1>;
};

export default Hello;
