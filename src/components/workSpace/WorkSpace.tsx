import { useDispatch, useSelector } from 'react-redux'
import "./WorkSpace.scss" 
import { addColumn, replaceColumns } from '../../store/slices/spaceSlice'
import { Button } from "../common/Button/Button"
import { Column } from "../common/Column/Column"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useMemo, useState } from 'react'
import { ColumnType, Task } from '../../store/types'
import { createPortal } from 'react-dom'
import { Card } from '../common/Card/Card'
import { selectActiveSpaceColumns } from '../../store/selectors/selectors'
import { RootState } from '../../store/store'

export const WorkSpace = () => {
  const dispatch = useDispatch();
  const columns = useSelector(selectActiveSpaceColumns);
  const [activeColumn, setActiveColumn] = useState<ColumnType | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const activeSpaceId = useSelector((state: RootState) => state.space.activeSpaceId);
  const columnsId = useMemo(() => columns.map((col: ColumnType) => col.id), [columns]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Card") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeColumnId = Number(active.id);
    const overColumnId = Number(over.id); 

    if (activeColumnId === overColumnId) return;

    const newColumns = arrayMove(
      columns,
      columnsId.indexOf(activeColumnId),
      columnsId.indexOf(overColumnId)
    );

    dispatch(replaceColumns(newColumns)); 
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || !active) return;
  
    const activeTaskId = Number(active.id);
    const overTaskId = Number(over.id);
  
    const isActiveATask = active.data.current?.type === "Card";
    const isOverATask = over.data.current?.type === "Card";
  
    if (!isActiveATask || !isOverATask) return;
  
    const activeColumnId = active.data.current?.task.columnId;
    const overColumnId = over.data.current?.task.columnId;
  
    const activeColumn = columns.find((column: ColumnType) => column.id === activeColumnId);
    const overColumn = columns.find((column: ColumnType) => column.id === overColumnId);
  
    if (!activeColumn || !overColumn) return;
  
    const activeTask = activeColumn.tasks.find((task: Task) => task.id === activeTaskId);
  
    if (!activeTask) return;
  
    if (activeColumnId !== overColumnId) {
      const updatedActiveColumn = {
        ...activeColumn,
        tasks: activeColumn.tasks.filter((task: Task) => task.id !== activeTaskId),
      };
  
      const updatedActiveTask = { ...activeTask, columnId: overColumnId };
  
      const updatedOverColumn =
        overColumn.tasks.length === 0
          ? { ...overColumn, tasks: [updatedActiveTask] }
          : {
              ...overColumn,
              tasks: [
                ...overColumn.tasks.slice(0, overTaskId),
                updatedActiveTask,
                ...overColumn.tasks?.slice(overTaskId),
              ],
            };
  
      const updatedColumns = columns.map((column: any) =>
        column.id === updatedActiveColumn.id
          ? updatedActiveColumn
          : column.id === updatedOverColumn.id
          ? updatedOverColumn
          : column
      );
      dispatch(replaceColumns(updatedColumns));
    }
  }
  
  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
      <div className='overlay'>
        <SortableContext items={columnsId}>
          {columns.map((column: ColumnType) => (
            <Column key={column.id} name={column.name} id={column.id} column={column} />
          ))}
        </SortableContext>
        
        {activeSpaceId != null 
        && <Button name="Add another list" style='list'onClick={() => dispatch(addColumn())} />} 

      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <Column name={activeColumn.name} id={activeColumn.id} column={activeColumn} />
          )}
          {activeTask && (
            <Card task={activeTask} columnId={activeColumn?.id!} />
          )}
        </DragOverlay>,
        document.body
      )}
      </div>
    </DndContext>
  );
};

