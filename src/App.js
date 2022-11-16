import { useState } from 'react';
import { ethers } from "ethers";
import './App.css';
import './main.css'
import ABI from './ABI.json'

function App() {

  const contractAddress = '0x0AA43Edf3a94233EeC567c272A11F5A1cCeeB6CE'
  const [walltedAddress, setWalltedAddress] = useState(null)
  const [tasks, setTasks] = useState([])
  const [tasksToRender, setTasksToRender] = useState([])
  const [taskInput, setTaskInput] = useState('')
  const [contract, setContract] = useState(null)
  const [activeOption, setActiveOption] = useState('All')


  if (!window.ethereum) {
    console.log('Please, install metamask.');
  }

  const login = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const address = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const TaskContract = new ethers.Contract(contractAddress, ABI, signer);
    console.log(TaskContract);
    setWalltedAddress(address[0])
    const tasks = await TaskContract.getAllTasks()
    setTasks(tasks)
    setTasksToRender(tasks)
    console.log(tasks);
    setContract(TaskContract)
  }

  const sentTaskInput = async (e) => {
    e.preventDefault()
    if (!taskInput || !contract) {
      console.log('No contract instance or missing task input', taskInput);
      return
    }
    await contract.createTask(taskInput)
  }

  const changeActiveOptions = (optionValue) => {
    setActiveOption(optionValue)
    // tasks.filter(task => )
    if (optionValue === 'Completed') {
      setTasksToRender(tasks.filter(task => task.completed === true && task))
    }else if (optionValue === 'Pending') {
        setTasksToRender(tasks.filter(task => task.completed === false))
    }else{
      setTasksToRender(tasks)
    }
  }

  const markTaskCompleted = async(id) =>{
    await contract.markTaskCompleted(id)
  }

  const markTaskDeleted = async(id) =>{
    await contract.markTaskDeleted(id)
  }

  return (
    <div className="App">
      <div className="wrapper">
        {/* input */}
        <form className="input-box" onSubmit={sentTaskInput}>
          <input type='text' placeholder='Add a new task' value={taskInput} onChange={e => setTaskInput(e.target.value)} />
        </form>
        {/* control options */}
        <div className="control-box">
          <div className='options'>
            {/* setActiveOption('All')} -- too may re renders */}
            <span onClick={e => changeActiveOptions('All')} className={activeOption === 'All' && 'active'} >All</span>
            <span onClick={e => changeActiveOptions('Pending')} className={activeOption === 'Pending' && 'active'}>Pending</span>
            <span onClick={e => changeActiveOptions('Completed')} className={activeOption === 'Completed' && 'active'}>Completed</span>
          </div>
        </div>
        {/* task box */}
        <div className="task-box">
          {tasksToRender.map(task => (<div className="task">
                <div className="task-details">
                  <p >{task.taskText}</p>
                </div>
                <div className="task-signs">
                  <div onClick={e => markTaskCompleted(task.id)} className="task-sign">
                    ✓
                  </div>
                  <div onClick={e => markTaskDeleted(task.id)} className="task-sign">
                    ❌
                  </div>
                </div>

              </div>)
          )}



        </div>
        <p>{walltedAddress ?
          `Logged as ${walltedAddress.slice(0, 5)}...${walltedAddress.slice(walltedAddress.length - 5, walltedAddress.length)}`
          : <u onClick={login} >Click Here To Login!</u>}</p>
      </div>

    </div>
  );
}

export default App;
