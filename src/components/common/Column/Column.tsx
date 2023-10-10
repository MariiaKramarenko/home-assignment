import { useDispatch, useSelector } from "react-redux"
import "./Column.scss"
import { Id, SubTask, Task } from "../../../store/types"
import { Edit, Trash } from "../../../assets/icons"
import { Button } from "../Button/Button"
import { Card } from "../Card/Card"
import { deleteColumn } from "../../../store/slices/spaceSlice"
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { useMemo, useState } from "react"
import {
  updateColumnName,
  addTaskToColumn,
} from "../../../store/slices/spaceSlice"
import { selectDoneTasksCount, selectTasksInActiveSpace } from "../../../store/selectors/selectors"
import ActionButton from "../ActionButton.tsx/ActionButton"

interface Props {
  key?: number;
  id: Id;
  name: string;
  column: any;
}

export const Column = (props: Props) => {
  const { id, name, column } = props;
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const activeSpaceTasks = selectTasksInActiveSpace(column.id);
  const doneTasksCount = useSelector(selectDoneTasksCount(column.id));
  const tasks = useSelector(activeSpaceTasks);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDeleteClick = () => {
    dispatch(deleteColumn(id));
  };

  const handleEditingClick = () => {
    setEditMode(true);
  };

  const handleUpdateColumnName = (newName: string) => {
    dispatch(updateColumnName({ columnId: id, newName }));
  };

  const createTask = (columnId: Id) => {
    const newTaskText = "New Card";
    const emptySubtasks: SubTask[] = [];
    dispatch(
      addTaskToColumn({ columnId, text: newTaskText, subtasks: emptySubtasks })
    );
  };

  const tasksIds = useMemo(() => tasks.map((task: Task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });


  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  
  if (isDragging) {
    return <div 
    ref={setNodeRef} 
    style={style} 
    className="column-wrapper">
      <div className="drag-box"></div>
    </div>;
  }

  return (<div 
    className="column-wrapper" 
    ref={setNodeRef}
    style={style}
    {...attributes}
    {...listeners}
   >
    <div 
      className="column" 
       onMouseEnter={handleMouseEnter}
       onMouseLeave={handleMouseLeave}
    >
        <div className="column-box">
          {!editMode ? (<div className='title-wrap'>
            <div className="column-title">{name}</div>
            <div className="column-count">Done: {doneTasksCount}</div>
            </div>
          ) : (
            <input
              value={name}
              type="text"
              autoFocus
              onChange={(e) => {
                handleUpdateColumnName(e.target.value);
              }}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setEditMode(false);
              }}
            />
          )}
          
         <div className={`action-buttons ${isHovered && !editMode ? "visible" : ''}`}>
            <ActionButton onClick={handleEditingClick} icon={<Edit />} />
            <ActionButton onClick={handleDeleteClick} icon={<Trash />} />
          </div>
        </div>

      <div className="card-container">
        <SortableContext items={tasksIds}>
          {tasks?.map((task: Task) => (
            <Card key={task.id} columnId={column.id} task={task} />
          ))}
        </SortableContext>
          <Button
          style="list"
          name="Add a card"
          onClick={() => createTask(column.id)}
        /> 
      </div>
    </div>
    </div>
  );
};
