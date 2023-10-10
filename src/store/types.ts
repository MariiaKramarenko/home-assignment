export interface Column {
    id: number;
    name: string;
    tasks: Task[];
}

export type Task = {
    id: Id;
    columnId: Id;
    text: string;
    subtasks: SubTask[],
    done: boolean
}
  
export interface SubTask {
    id: Id;
    text: string;
    completed: boolean;
}

export type Id = number ;

export type ColumnType = {
    id: Id;
    name: string;
    tasks?: Task[]; 
}

export interface ActionButtonProps {
    onClick: () => void;
    icon: React.ReactElement;
}

export interface MenuItem {
    icon: React.ReactNode; 
    label: string;
    isActive: boolean
}

export interface SpaceType {
    id: Id;
    name: string;
    columns: Column[];
}

export interface SpaceState {
    spaces: SpaceType[];
    activeSpaceId: Id | null; 
}