import './App.scss';
import { WorkSpace } from './components/workSpace/WorkSpace';
import { WorkspacesSidebar } from "./components/workspacesSidebar"

export const App = () => {
  return (
    <div className="container">
      <WorkspacesSidebar />
      <WorkSpace />
    </div>
  )
}