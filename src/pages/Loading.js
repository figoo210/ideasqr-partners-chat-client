import React from "react";
import "../assets/css/loading.css";

function Loading(props) {
  return (
    <div className="loading-screen" onAnimationStart={props.onLoad}>
      <div className="loading-spinner"></div>
    </div>
  );
}

export default Loading;
