import { useState } from "react";
import { Check, Plus } from "../../../assets/icons"
import "./Button.scss"

interface Props {
  style: string;
  name: string;
  onClick?: () => void;
}

export const Button = (props: Props) => {
  const [isHovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };
  return (
    <div>
      <button
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
        className={
          props.style === "space"
            ? "button-space"
            : props.style === "edit"
            ? "button-space-edit"
            : "button-add"
        }
        onClick={props.onClick}
      >
        {props.style === "edit" && <Check color={!isHovered ? "#594F78" : "#fff"} />}
        {!(props.style === "edit") && (
          <Plus color={props.style === "space" ? "#001C39" : "#88819F"} />
        )}
        {props.name}
      </button>
    </div>
  );
};
