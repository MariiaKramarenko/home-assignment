import { useState } from "react";
import { useDispatch } from "react-redux";
import { Edit } from "../../../assets/icons/Edit";
import { Trash } from "../../../assets/icons/Trash";
import {
  deleteSubtask,
  updateSubtaskName,
} from "../../../store/slices/spaceSlice";
import { Id, SubTask} from "../../../store/types";
import "./Card.scss";
import ActionButton from "../ActionButton.tsx/ActionButton";

interface Props {
  text: string;
  subTask: SubTask;
  taskId: Id;
}

export const SubCard = (props: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const subTaskId = props.subTask.id;
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleEditingClick = () => {
    setEditMode(true);
  };

  const handleDeleteSubtask = () => {
    dispatch(deleteSubtask({ taskId: props.taskId, subtaskId: subTaskId }));
  };

  const handleUpdateSubTaskName = (newName: string) => {
    dispatch(
      updateSubtaskName({ taskId: props.taskId, subtaskId: subTaskId, newName })
    );
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="card-box">
        {!editMode ? (
          <div className="card-title">{props.text}</div>
        ) : (
          <input
            value={props.text}
            type="text"
            autoFocus
            onChange={(e) => handleUpdateSubTaskName(e.target.value)}
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditMode(false);
            }}
          />
        )}
        <div className="card-action-wrap">
        <div className={`action-buttons ${isHovered ? "visible" : ''}`}>
          <ActionButton onClick={handleEditingClick} icon={<Edit />} />
          <ActionButton onClick={handleDeleteSubtask} icon={<Trash />} />
        </div>
        </div>
      </div>
    </div>
  );
};
