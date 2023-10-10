import "./WorkspacesSidebar.scss"
import { UserProfile } from "../userProfile"
import { WorkspaceSettings } from "../workspaceSettings"
import { Home, Layout, Search, User } from "../../assets/icons"
import { Button } from "../common/Button/Button"
import { Space } from "../common/Space/Space"
import { useDispatch, useSelector } from "react-redux"
import {
  addSpace,
  replaceSpaces,
  setActiveSpaceId,
} from "../../store/slices/spaceSlice"
import { RootState } from "../../store/store"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { useEffect, useMemo, useState } from "react"
import { MenuItem, SpaceType } from "../../store/types"

export const WorkspacesSidebar = () => {
  const dispatch = useDispatch();
  const spaces = useSelector((state: RootState) => state.space.spaces);
  const [, setActiveSpace] = useState<SpaceType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const activeSpaceId = useSelector(
    (state: RootState) => state.space.activeSpaceId
  );

  const menuItems: MenuItem[] = [
    { icon: <Home />, label: "Dashboard", isActive: false },
    { icon: <Layout />, label: "Boards", isActive: true },
    { icon: <User />, label: "Profile", isActive: false },
    { icon: <Search />, label: "Search", isActive: false },
  ];

  useEffect(() => {
    if (spaces.length === 0 && activeSpaceId !== null) {
      dispatch(setActiveSpaceId(null));
    }
  }, [spaces.length, activeSpaceId]);

  const handleCreationSpace = () => {
    dispatch(addSpace());
    setIsEditing(true);
  };

  const handleSaveCreation =() =>{
    setIsEditing(false);
  }

  const spacesIds = useMemo(() => spaces.map((space: SpaceType) => space.id), [spaces]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Space") {
      setActiveSpace(event.active.data.current.space);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveSpace(null);
    const { active, over } = event;
    if (!over) return;

    const activeSpaceId = Number(active.id);
    const overSpaceId = Number(over.id);

    if (activeSpaceId === overSpaceId) return;

    const newSpaces: SpaceType[] = arrayMove(
      spaces,
      spacesIds.indexOf(activeSpaceId),
      spacesIds.indexOf(overSpaceId)
    );
    dispatch(replaceSpaces(newSpaces));
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeSpaceId = Number(active.id);
    const overSpaceId = Number(over.id);

    if (activeSpaceId === overSpaceId) return;

    const newSpaces: SpaceType[] = arrayMove(
      spaces,
      spacesIds.indexOf(activeSpaceId),
      spacesIds.indexOf(overSpaceId)
    );

    dispatch(replaceSpaces(newSpaces));
  };

  return (
    <div className="workspaces">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="workspaces-header">
          <SortableContext items={spacesIds}>
            {spaces && spaces.length
              ? spaces.map((space: SpaceType) => (
                  <Space
                    key={space.id}
                    name={space.name}
                    id={space.id}
                    space={space}
                    isEditing={isEditing}
                  />
                ))
              : null}
          </SortableContext>
        </div>
      </DndContext>
      <div className="create-button">

       {!isEditing && <Button
          style="space"
          name={"Create workspace"}
          onClick={() => handleCreationSpace()}
        />} 

        {isEditing && 
        <Button
        style="edit"
        name={"Save new workspace"}
        onClick={() => handleSaveCreation()}
      />}
      </div>

      <div className="spaces-line">
      </div>
      <div className="menu-list">

        {menuItems.map((menuItem, index) => (
          <div className="menu-item" key={index}>
            <div className="menu-icon">{menuItem.icon}</div>
            <div className={menuItem.isActive? 'active' : ''}>{menuItem.label}</div>
          </div>
        ))}

      </div>
      <div className="workspaces-footer">
        <UserProfile />
        <WorkspaceSettings />
      </div>
    </div>
  );
};
