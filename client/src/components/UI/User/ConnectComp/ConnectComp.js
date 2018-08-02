import React from "react";
import "./ConnectComp.css";
import Header from "./Header/Header";
import FilterBar from "./FilterBar/FilterBar";

const ConnectComp = ({ users, pendingConnections, requestConnection, user, getUsers }) => {
  /* Renders the list of potential connections */
  // console.log("ConnectComp, pendingConnections", pendingConnections);

  const loggedInUserId = user._id;
  const { acceptable, pending } = pendingConnections;

  const connectionList = users.map((user, i) => {
    // console.log(`USER ${i} ${user._id}`);
    const { _id, firstName, lastName, username } = user;
    const renderConnectBtn = () => {
      if (pending.length > 0 || acceptable.length > 0) {
        // then filter and see if current request exists from logged in user
        if (
          pending.some(request => {
            // console.log(`Pending Req ${i} ${request.requestingUser}`);
            /* 
            * 1. checks if loggedInUser is === requestingUser  && 
            * 2. if current requestedUser === current user that is being mapped through 
            */

            return (
              request.requestingUser === loggedInUserId &&
              request.requestedUser._id === _id
            );
          })
        ) {
          //* if true - return pending btn - currently disabled
          return (
            <button disabled className="button is-info is-inverted is-static">
              Pending Response
            </button>
          );
        } else if (
          pendingConnections.acceptable.some(request => {
            // console.log(`Acceptable Req ${i} ${request.requestedUser}`);
            return (
              request.requestingUser._id === _id &&
              request.requestedUser === loggedInUserId
            ); 
          })
        ) {
          // if true - return acceptance button;
          // * Not sure if we'll actually render 'acceptable' in /connect, but using this as a placeholder for now
          return (
            <button
              className="button is-success is-outlined"
              onClick={() => console.log("ACCEPTING")}
            >
              Accept Request
            </button>
          );
        } else {
          // if false - render request btn
          return (
            <button
              className="button is-primary"
              onClick={() => requestConnection(_id)}
            >
              CONNECT
            </button>
          );
        }
      } else {
        // Connect Request Btn
        return (
          <button
            className="button is-primary"
            onClick={() => requestConnection(_id)}
          >
            CONNECT
          </button>
        );
      }
    };

    return (
      <li className="list-item-container" key={_id}>
        <div className="media">
          <div className="media-left">
            <figure className="image is-96x96">
              <img
                src="https://bulma.io/images/placeholders/96x96.png"
                alt="Placeholder"
              />
            </figure>
          </div>
          <div className="media-content">
            <div className="media">
              <div className="media-content">
                <p className="title is-4">{`${firstName} ${lastName}`}</p>
                <p className="subtitle is-6">Username: {username}</p>
                {/* <p className="subtitle is-6">ID: (for testing): {_id}</p> */}
              </div>
            </div>
          </div>
          <div className="media-right">{renderConnectBtn()}</div>
        </div>
      </li>
    );
  });
  /* Returns both Header Component, Filter, and List */
  return (
    <div className="column is-three-quarters">
      <Header/>
      <FilterBar users={users} getUsers={getUsers}/>
      <ul>{connectionList}</ul>
    </div>
  );
};

export default ConnectComp;
