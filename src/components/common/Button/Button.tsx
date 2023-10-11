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
            ? "btn button-space"
            : props.style === "edit"
            ? "btn button-space-edit"
            : "btn button-add"
        }
        onClick={props.onClick}
      >
        {props.style === "edit" && <Check color={"#fff"} />}
        {!(props.style === "edit") && (
          <Plus color={props.style === "space" ? "#001C39" : "#88819F"} />
        )}
        {props.name}
      </button>
    </div>
  );
};
