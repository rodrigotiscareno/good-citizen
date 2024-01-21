import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Landing from "../Landing";
import SignIn from "../Signin";
import SignUp from "../Signup";
import PasswordReset from "../PasswordReset";
import CommunityMap from "../CommunityMap";
import Feed from "../Feed";
import Voice from "../Voice";
import EventCreation from "../CommunityMap/Events/EventCreation";
import NoticeCreation from "../CommunityMap/Notices/NoticeCreation";
import Profile from "../Profile";
import NoticesAndEvents from "../ViewEventsNotices";
import Messaging from "../Messaging";
import Assistant from "../Assistant";
import Chat from "../Messaging";
import ChatWindow from "../Messaging/ChatWindow";
import EditProfile from "../EditProfile";
import EventProfile from "../CommunityMap/EventProfile";

export default function PrivateRouteAuthenticated() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/chat" exact component={Assistant} />
        <Route path="/reset" exact component={PasswordReset} />
        <Route path="/community-map" exact component={CommunityMap} />
        <Route path="/feed" exact component={Feed} />
        <Route path="/create-event" exact component={EventCreation} />
        <Route path="/create-notice" exact component={NoticeCreation} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/editprofile" exact component={EditProfile} />
        <Route
          path="/view-events-and-notices"
          exact
          component={NoticesAndEvents}
        />
        <Route path="/messaging" exact component={Messaging} />
        <Route
          path="/view-events-and-notices"
          exact
          component={NoticesAndEvents}
        />
        <Route path="/messaging" exact component={Chat} />
        <Route path="/chat/:userId1/:userId2" component={ChatWindow} />
        <Route
          path="/voice"
          exact
          component={() => {
            return <Voice newPoll={false} />;
          }}
        />
        <Route
          path="/voice/new"
          exact
          component={() => {
            return <Voice newPoll={true} />;
          }}
        />
        <Route path="/assistant" exact component={Assistant} />
        <Route path="/events/:event_id" component={EventProfile} />
      </Switch>
    </BrowserRouter>
  );
}
