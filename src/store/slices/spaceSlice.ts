import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Column, Id, SpaceState, SpaceType, SubTask, Task } from '../types';
import { generateId } from '../../utilities/generateId';

const initialState: SpaceState = {
  spaces: [],
  activeSpaceId: null, 
};

const spaceSlice = createSlice({
  name: 'space',
  initialState,
  reducers: {
    addSpace: (state: SpaceState) => {
        const spaceToAdd: SpaceType = {
          id: generateId(),
          name: `Workspace name`,
          columns: [],
        };
        state.spaces = [spaceToAdd, ...state.spaces];
        state.activeSpaceId = spaceToAdd.id;;
    },
    deleteSpace: (state: SpaceState, action: PayloadAction<Id>) => {
        const spaceIdToDelete = action.payload;
        state.spaces = state.spaces.filter((space) => space.id !== spaceIdToDelete);
    },
    updateNameSpace: (state: SpaceState, action: PayloadAction<{ spaceId: Id, newName: string }>) => {
        const { spaceId, newName } = action.payload;
        const spaceToChange = state.spaces.find((space) => space.id === spaceId);
        if (spaceToChange) {
          spaceToChange.name = newName;
        }
    },
    replaceSpaces: (state: SpaceState, action: PayloadAction<SpaceType[]>) => {
      state.spaces = action.payload;
    },
    setActiveSpaceId: (state: SpaceState, action: PayloadAction<Id | null>) => {
      state.activeSpaceId = action.payload;
    },

    addColumn: (state: SpaceState) => {
      const columnToAdd: Column = {
        id: generateId(),
        name: `New List`,
        tasks: [], 
      };

      const activeSpace = state.spaces.find((space) => space.id === state.activeSpaceId);

      if (activeSpace) {
        activeSpace.columns = [columnToAdd, ...activeSpace.columns];
      }
    },
    deleteColumn: (state: SpaceState, action: PayloadAction<number>) => {
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
    
      if (activeSpace) {
        const columnIndex = activeSpace.columns.findIndex(
          (column) => column.id === action.payload
        );
    
        if (columnIndex !== -1) {
          activeSpace.columns.splice(columnIndex, 1);
        }
      }
    },
    updateColumnName: (state: SpaceState, action: PayloadAction<{ columnId: Id; newName: string }>) => {
      const { columnId, newName } = action.payload;
      
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
    
      if (activeSpace) {
        const columnIndex = activeSpace.columns.findIndex(
          (column) => column.id === columnId
        );
    
        if (columnIndex !== -1) {
          activeSpace.columns[columnIndex].name = newName;
        }
      }
    },
    replaceColumns: (state: SpaceState, action: PayloadAction<Column[]>) => {
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
    
      if (activeSpace) {
        activeSpace.columns = action.payload;
      }
    },

    addTaskToColumn: (state: SpaceState, action: PayloadAction<{ columnId: Id; text: string, subtasks: SubTask[] }>) => {
      const { columnId, text } = action.payload;
    
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
    
      if (activeSpace) {
        const column = activeSpace.columns.find((col) => col.id === columnId);
    
        if (column) {
          const newTask: Task = {
            id: generateId(),
            columnId,
            text,
            subtasks: [],
            done: false
          };

          if (!column.tasks) {
            column.tasks = [newTask];
          } else {
            column.tasks.push(newTask);
          }
        }
      }
    },
    deleteTask: (state: SpaceState, action: PayloadAction<{ columnId: number; taskId: number }>) => {
      const { columnId, taskId } = action.payload;
    
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
    
      if (activeSpace) {
        const column = activeSpace.columns.find((col) => col.id === columnId);
    
        if (column && column.tasks) {
          const taskIndex = column.tasks.findIndex((task) => task.id === taskId);

          if (taskIndex !== -1) {
            column.tasks.splice(taskIndex, 1);
          }
        }
      }
    },
    updateTaskName: (state: SpaceState, action: PayloadAction<{ columnId: number; taskId: number; newName: string }>) => {
      const { columnId, taskId, newName } = action.payload;
    
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
    
      if (activeSpace) {
        const column = activeSpace.columns.find((col) => col.id === columnId);
    
        if (column && column.tasks) {
          const task = column.tasks.find((task) => task.id === taskId);
          if (task) {
            task.text = newName;
          }
        }
      }
    },

    createSubtask: (state: SpaceState, action: PayloadAction<{ taskId: Id }>) => {
      const { taskId } = action.payload;

      const activeSpace = state.spaces.find((space) => space.id === state.activeSpaceId);

      if (activeSpace) {
        const columnWithTask = activeSpace.columns.find((column) =>
          column.tasks.some((task) => task.id === taskId)
        );

        if (columnWithTask) {
          const task = columnWithTask.tasks.find((task) => task.id === taskId);

          if (task) {
            const newSubtask: SubTask = {
              id: generateId(),
              text:`New Subcard`,
              completed: false,
            };

            if (!task.subtasks) {
              task.subtasks = [newSubtask];
            } else {
              task.subtasks.push(newSubtask);
            }
          }
        }
      }
    },

    
    updateSubtaskName: (
      state: SpaceState,
      action: PayloadAction<{ taskId: Id; subtaskId: Id; newName: string }>
    ) => {
      const { taskId, subtaskId, newName } = action.payload;
  
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
  
      if (activeSpace) {
        const columnWithTask = activeSpace.columns.find((column) =>
          column.tasks.some((task) => task.id === taskId)
        );
  
        if (columnWithTask) {
          const task = columnWithTask.tasks.find((task) => task.id === taskId);
  
          if (task && task.subtasks) {
            const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
  
            if (subtask) {
              subtask.text = newName;
            }
          }
        }
      }
    },

    updateTaskDone: (state: SpaceState, action: PayloadAction<{ columnId: Id; taskId: Id; done: boolean }>) => {
      const { columnId, taskId, done } = action.payload;
      const activeSpace = state.spaces.find((space) => space.id === state.activeSpaceId);
    
      if (activeSpace) {
        const columnWithTask = activeSpace.columns.find((column) => column.id === columnId);
    
        if (columnWithTask) {
          const taskToUpdate = columnWithTask.tasks.find((task) => task.id === taskId);
  
          if (taskToUpdate) {
            taskToUpdate.done = done;
          }
        }
      }
    },
    deleteSubtask: (
      state: SpaceState,
      action: PayloadAction<{ taskId: number; subtaskId: number }>
    ) => {
      const { taskId, subtaskId } = action.payload;
  
      const activeSpace = state.spaces.find(
        (space) => space.id === state.activeSpaceId
      );
  
      if (activeSpace) {
        const columnWithTask = activeSpace.columns.find((column) =>
          column.tasks.some((task) => task.id === taskId)
        );
  
        if (columnWithTask) {
          const task = columnWithTask.tasks.find((task) => task.id === taskId);
  
          if (task && task.subtasks) {
            const subtaskIndex = task.subtasks.findIndex((subtask) => subtask.id === subtaskId);
  
            if (subtaskIndex !== -1) {
              task.subtasks.splice(subtaskIndex, 1);
            }
          }
        }
      }
    },
  },
});

export const { 
  addSpace, 
  deleteSpace, 
  updateNameSpace, 
  replaceSpaces, 
  setActiveSpaceId, 
  addColumn, 
  deleteColumn, 
  updateColumnName,
  replaceColumns, 
  addTaskToColumn, 
  deleteTask, 
  updateTaskName,
  updateTaskDone,
  createSubtask,
  updateSubtaskName,
  deleteSubtask
} = spaceSlice.actions;

export default spaceSlice.reducer;




