import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

    const [newTask, setnewTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [canEdit, setCanEdit] = useState(false);
    const [editTaskId, setEditTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState('');

    // Add new Task
    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const res = await axios.post('/api/todos', { text: newTask, completed: false });
            setTasks([...tasks, res.data]);
            setnewTask('');
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch task data from db
    const fetchTask = async () => {
        try {
            const res = await axios.get('/api/todos');
            setTasks(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTask();
    }, []);

    // Edit Task
    const editTask = (item) => {
        setCanEdit(true);
        setEditTaskId(item._id);
    };

    // Save edited Task
    const saveTask = async (item) => {
        try {
            const res = await axios.patch(`/api/todos/${item._id}`, { text: editTaskText });
            setTasks(tasks.map((task) => (task._id === item._id ? res.data : task)));
            setCanEdit(false);
            setEditTaskId(null);
            setEditTaskText('');
        } catch (error) {
            console.log(error);
        }
    };

    // Delete task
    const deleteTask = async (item) => {
        try {
            await axios.delete(`/api/todos/${item._id}`);
            setTasks(tasks.filter((task) => task._id !== item._id));
        } catch (error) {
            console.log(error);
        }
    };

    // Toggle complete status and update DB
    const toggleCheck = async (item) => {
        try {

            const res = await axios.patch(`/api/todos/${item._id}`, {
                completed: !item.completed,
            });

            setTasks(tasks.map((task) => (task._id === item._id ? res.data : task)));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="taskform">
            <h1>Task Form</h1>

            <form>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setnewTask(e.target.value)}
                    placeholder="Enter a new task..."
                />
                <button onClick={addTask}>Add Task</button>
            </form>

            <div>
                <h1>Task To Do</h1>

                {tasks.length === 0 ? (
                    <div>
                        <h3>No Task To Do</h3>
                    </div>
                ) : (
                    <div>
                        {tasks.map((item) => (
                            <div key={item._id} className="task-item">
                                {canEdit && item._id === editTaskId ? (
                                    <div>
                                        <input
                                            type="text"
                                            value={editTaskText}
                                            onChange={(e) => setEditTaskText(e.target.value)}
                                            placeholder={item.text}
                                        />
                                        <button onClick={() => saveTask(item)}>Save</button>
                                        <button onClick={() => setCanEdit(false)}>Close</button>
                                    </div>
                                ) : (
                                    <>

                                        <button
                                            className={`check ${item.completed ? 'checked' : ''}`}
                                            onClick={() => toggleCheck(item)}
                                        ></button>


                                        <span
                                            className={`task-text ${item.completed ? 'completed' : ''}`}
                                        >
                                            {item.text}
                                        </span>


                                        {!item.completed && (
                                            <div className="task-buttons">
                                                <button
                                                    className="edit"
                                                    onClick={() => editTask(item)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete"
                                                    onClick={() => deleteTask(item)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
