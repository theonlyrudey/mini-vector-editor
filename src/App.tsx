import { CanvasView} from "./ui/CanvasView.tsx";
import { Toolbar } from "./ui/Toolbar.tsx";

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toolbar />
      <CanvasView />
    </div>
  )
}

export default App
