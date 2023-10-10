import "./ActionButton.scss"
import { ActionButtonProps } from "../../../store/types"

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, icon }) => (
    <button className="action-button" onClick={onClick}>
      {icon}
    </button>
  );
export default ActionButton;