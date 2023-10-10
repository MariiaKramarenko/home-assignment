import { createSelector } from 'reselect'
import { RootState } from '../store' 

const selectActiveSpaceId = (state: RootState) => state.space.activeSpaceId;
const selectSpaces = (state: RootState) => state.space.spaces;

export const selectActiveSpaceColumns = createSelector(
  [selectActiveSpaceId, selectSpaces],
  (activeSpaceId, spaces) => {
    if (activeSpaceId === null) {
      return []; 
    }

    const activeSpace = spaces.find((space) => space.id === activeSpaceId);

    if (activeSpace) {
      return activeSpace.columns;
    }

    return []; 
  }
);

export const selectTasksInActiveSpace = (columnId: number) =>
  createSelector(
    [selectActiveSpaceId, selectSpaces],
    (activeSpaceId, spaces) => {
      if (activeSpaceId === null) {
        return []; 
      }

      const activeSpace = spaces.find((space) => space.id === activeSpaceId);

      if (activeSpace) {
        const column = activeSpace.columns.find((col) => col.id === columnId);
        if (column) {
          return column.tasks || []; 
        }
      }

      return []; 
    }
  );

export const selectDoneTasksCount = (columnId: number) =>
  createSelector(
    [selectTasksInActiveSpace(columnId)],
    (tasks) => {
      return tasks.reduce((count, task) => {
        return task.done ? count + 1 : count;
      }, 0);
    }
);
