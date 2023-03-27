import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getMessage = async () => {
      window.electronAPI.doThing().then((res) => setMessage(res));
    };
    getMessage();
  }, []);

  return <div>{message}</div>;
}
