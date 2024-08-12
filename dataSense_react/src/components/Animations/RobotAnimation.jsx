import React from "react";
import "./RobotAnimation.css";
import robot_pic  from '../../assets/images/color_animation_walk.gif'

const RobotAnimation = () => {
  return (
    <div className="robot-animation-container">
      <img src={robot_pic} alt="AI Robot" className="robot" loading="lazy" />
      
    </div>
  );
};

export default RobotAnimation;
