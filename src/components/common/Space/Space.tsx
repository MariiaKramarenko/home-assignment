import { useState } from "react"
import { Edit, Group, Trash } from "../../../assets/icons"
import "./Space.scss"
import { CSS } from "@dnd-kit/utilities"
import { Id, SpaceType } from "../../../store/types"
import { useDispatch, useSelector } from "react-redux"
import { deleteSpace, updateNameSpace, setActiveSpaceId } from "../../../store/slices/spaceSlice"
import { useSortable } from "@dnd-kit/sortable"
import { RootState } from "../../../store/store"
import ActionButton from "../ActionButton.tsx/ActionButton"

interface Props {
  id: Id;
  name: string;
  space: SpaceType;
  isEditing: boolean;
}

export const Space = (props: Props) => {
  const { id, name, space } = props;
  const [editMode, setEditMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const activeSpaceId = useSelector((state: RootState) => state.space.activeSpaceId);
  const dispatch = useDispatch();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleDeleteClick = () => {
    dispatch(deleteSpace(id));
  };

  const handleEditingClick = () => {
    setEditMode(true);
  };

  const handleUpdateSpaceName = (newName: string) => {
    dispatch(updateNameSpace({ spaceId: id, newName }));
  };

  const handleClickSpace = () => {
    dispatch(setActiveSpaceId(id));
  };

  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: space.id,
    data: {
      type: "Space",
      space,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      className={activeSpaceId === space.id ? 'space-card space-card-active' : 'space-card'}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClickSpace}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Group />
      {!editMode && !(activeSpaceId === space.id && props.isEditing) ?
       (
       <div className="space-text-wrap">
          <span>{name}</span>
        </div>
        )
       :
       (
        <div className="space-text-wrap">
        <input
          value={name}
          type="text"
          autoFocus
          onChange={(e) => {
            handleUpdateSpaceName(e.target.value);
          }}
          onBlur={() => setEditMode(false)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            setEditMode(false);
          }}
        />
        </div>
       )
      }
      <div className="space-wrapper">
      <div className={`action-buttons ${isHovered && !(activeSpaceId === space.id && props.isEditing) ? "visible" : ''}`}>
        <ActionButton onClick={handleEditingClick} icon={<Edit />} />
        <ActionButton onClick={handleDeleteClick} icon={<Trash />} />
      </div>
      </div>
    </div>

  );
};