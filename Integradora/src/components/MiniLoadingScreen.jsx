import React from "react";
import '../css/loading.css';

export default function MiniLoadingScreen() {
  return (
    <div className="centered h-100">
      <div className="span-col">
        <span className="span-load"></span>
        <span className="span-load"></span>
        <span className="span-load"></span>
      </div>
    </div>
  );
}
