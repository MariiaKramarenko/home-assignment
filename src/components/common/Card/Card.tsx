import { useState } from "react"
import "./Card.scss"
import { Edit, Trash, Plus } from "../../../assets/icons"
import { Id, Task } from "../../../store/types"
import {
  deleteTask,
  updateTaskName,
  createSubtask,
  updateTaskDone,
} from "../../../store/slices/spaceSlice"
import { useDispatch } from "react-redux"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import ActionButton from "../ActionButton.tsx/ActionButton"
import { SubCard } from "./SubCard"

interface Props {
  columnId: Id;
  task: Task;
}

export const Card = (props: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const task = props.task;
  const columnId = props.columnId;
  const taskId = props.task.id;

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

  const handleDeleteClick = () => {
    dispatch(deleteTask({ columnId, taskId }));
  };

  const handleUpdateTaskName = (columnId: Id, taskId: Id, newName: string) => {
    dispatch(updateTaskName({ columnId, taskId, newName }));
  };

  const handleCreateSubtask = () => {
    dispatch(createSubtask({ taskId }));
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskId,
    data: {
      type: "Card",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="card-box"></div>;
  }

  const handleCheckboxChange = (
    columnId: Id,
    taskId: Id,
    currentDoneValue: boolean
  ) => {
    const newDoneValue = !currentDoneValue;
    dispatch(updateTaskDone({ columnId, taskId, done: newDoneValue }));
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-box">
        {!editMode ? (
          <>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() =>
                handleCheckboxChange(columnId, task.id, task.done)
              }
            />
            <div className="card-title">{task.text}</div>
          </>
        ) : (
          <input
            value={task.text}
            type="text"
            autoFocus
            onChange={(e) => {
              handleUpdateTaskName(columnId, taskId, e.target.value);
            }}
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditMode(false);
            }}
          />
        )}
        <div className="card-action-wrap">
        <div className={`action-buttons ${isHovered && !editMode ? "visible" : ""}`}>
          <ActionButton
            onClick={handleCreateSubtask}
            icon={<Plus color="#88819F" />}
          />
          <ActionButton onClick={handleEditingClick} icon={<Edit />} />
          <ActionButton onClick={handleDeleteClick} icon={<Trash />} />
        </div>
        </div>
      </div>
      {task.subtasks.length > 0 &&
        task.subtasks.map((sub) => {
          return (
            <div className="subcard-list" key={sub.id}>
              <SubCard text={sub.text} subTask={sub} taskId={taskId} />
            </div>
          );
        })}
    </div>
  );
};
