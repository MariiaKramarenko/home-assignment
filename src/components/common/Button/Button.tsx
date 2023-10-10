import { Check, Plus } from "../../../assets/icons"
import "./Button.scss"

interface Props {
  style: string;
  name: string;
  onClick?: () => void;
}

export const Button = (props: Props) => {
  return (
    <div>
      <button
        className={
          props.style === "space"
            ? "button-space"
            : props.style === "edit"
            ? "button-space-edit"
            : "button-add"
        }
        onClick={props.onClick}
      >
        {props.style === "edit" && <Check />}
        {!(props.style === "edit") && (
          <Plus color={props.style === "space" ? "#001C39" : "#88819F"} />
        )}
        {props.name}
      </button>
    </div>
  );
};
