import React, { useEffect, useState } from "react";
import { useAuth } from "../Firebase/firebase";
import MyAppBar from "../MyAppBar";
import TabBar from "../TabBar";
import ViewPolls from "./ViewPolls";
import CreatePoll from "./CreatePoll";
import { BallTriangle } from "react-loader-spinner";

const Voice = (props) => {
  const [loading, setLoading] = useState(true);
  const currentUser = useAuth();
  let authenticated = Boolean(currentUser);
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    setLoading(false);
  }, [currentUser]);

  const Loader = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <BallTriangle type="ThreeDots" color="#00BFFF" timeout={3000} />
      </div>
    );
  };

  return (
    <>
      <MyAppBar authenticated={authenticated} />
      <div className="p-4">
        {props.newPoll ? (
          <CreatePoll currentUser={currentUser} />
        ) : loading ? (
          <Loader
            type="ThreeDots"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000}
          />
        ) : (
          <ViewPolls currentUser={currentUser} />
        )}
      </div>
      <TabBar />
    </>
  );
};

export default Voice;
