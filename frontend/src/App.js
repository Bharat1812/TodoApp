import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  useEffect(() => {
    // Fetch tasks from the backend when the component mounts
    getTask();
  }, []);

  //to get tasks from backend
  const getTask = () => {
    axios
      .get("http://localhost:8000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

    //to add tasks
  const addTask = () => {
    axios
      .post("http://localhost:8000/tasks", { text: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        getTask();
        toast.success("Task added successfully!");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        toast.error("Error adding task. Please try again.");
      });
    setNewTask("");
  };

  //to edit task
  const editTask = (id, newText) => {
    axios
      .put(`http://localhost:8000/tasks/${id}`, { text: newText })
      .then((response) => {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? response.data : task
        );
        setTasks(updatedTasks);
        getTask();
        toast.success("Task edited successfully!");
      })
      .catch((error) => {
        console.error("Error editing task:", error);
        toast.error("Error editing task. Please try again.");
      });
  };

  //to delete task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:8000/tasks/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        getTask();
        toast.success("Task deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Error deleting task. Please try again.");
      });
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4">To-Do List</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask();
        }}
      >
        <TextField
          label="Add a new task"
          variant="outlined"
          fullWidth
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="mt-2"
        >
          Add Task
        </Button>
      </form>
      {tasks.length === 0 ? (
        <h3 className="mt-4 text-center">No tasks available, Please add some tasks</h3>
      ) : (
        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={task._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{task.text}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        editTask(task._id, prompt("Edit task:", task.text))
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => deleteTask(task._id)}
                      className="ms-2"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default App;
