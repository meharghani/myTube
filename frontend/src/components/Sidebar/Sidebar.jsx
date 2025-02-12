import { faSquareYoutube } from "@fortawesome/free-brands-svg-icons";
import { faClock, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import {
  faClockRotateLeft,
  faFilm,
  faHouse,
  faList,
  faUser,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Sidebar = ({ menu }) => {
  return menu ? (
    <div>
      <div className="text-lg flex flex-col border-b-2 pb-2 px-1 mt-4">
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl">
          <FontAwesomeIcon icon={faHouse} />
          <span className="text-sm font-semibold">Home</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faSquareYoutube} />
          <span className="text-sm font-semibold">Shorts</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faFilm} />
          <span className="text-sm font-semibold">Subscriptions</span>
        </div>
      </div>
      <div className="text-lg flex flex-col border-b-2 pb-2 px-1">
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-1 rounded-2xl text-center mt-2">
          <span className="font-semibold text-lg">You</span>
          <span className="font-serif text-lg ml-2">{">"}</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 mt-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faClockRotateLeft} />
          <span className="text-sm font-semibold">History</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faList} />
          <span className="text-sm font-semibold">Playlist</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faVideo} />
          <span className="text-sm font-semibold">Your Videos</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faClock} />
          <span className="text-sm font-semibold">Watch Later</span>
        </div>
        <div className="flex gap-4 hover:bg-slate-200 w-[100%] pl-4 pr-8 py-2 rounded-2xl text-center">
          <FontAwesomeIcon icon={faThumbsUp} />
          <span className="text-sm font-semibold">Liked Videos</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-lg flex flex-col gap-6 px-1 mt-4">
      <div className="flex gap-1 flex-col text-center">
        <FontAwesomeIcon icon={faHouse} />
        <span className="text-xs font-semibold">Home</span>
      </div>
      <div className="flex gap-1 flex-col text-center">
        <FontAwesomeIcon icon={faSquareYoutube} />
        <span className="text-xs font-semibold">Shorts</span>
      </div>
      <div className="flex gap-1 flex-col text-center">
        <FontAwesomeIcon icon={faFilm} />
        <span className="text-xs font-semibold">Subscriptions</span>
      </div>
      <div className="flex gap-1 flex-col text-center">
        <FontAwesomeIcon icon={faUser} />
        <span className="text-xs font-semibold">You</span>
      </div>
    </div>
  );
};

export default Sidebar;
