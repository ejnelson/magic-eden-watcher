import './App.css';
import {Watcher} from './components/Watcher';
import {useState}from 'react';

function App() {
const [projectName, setProjectName] = useState('')
const [watcherName, setWatcherName] = useState('')
  const handleChange=(event)=> {
    setProjectName(event.target.value);
  }

  const handleSubmit=(event)=> {
    event.preventDefault();
    setWatcherName(projectName)
    // alert('A name was submitted: ' + projectName);
  }

  return (
    <div className="App">
      <label>
        Magic eden string name:
        <input type="text" name="projectName"  onChange={handleChange}/>
      </label>
      <button type="button"  onClick={handleSubmit} disabled={!!watcherName}>Submit</button>
      {watcherName&&<Watcher projectName={watcherName}/>}
    </div>
  );
}

export default App;
