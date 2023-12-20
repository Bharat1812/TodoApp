const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { connect, getDb } = require("./config/config");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
connect().catch((error) => process.exit(1));

//created schema
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const Task = mongoose.model("Task", taskSchema);

//api to get the task
app.get("/tasks", async (req, res) => {
  try {
    // Retrieve tasks from MongoDB
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//api to post tasks
app.post("/tasks", async (req, res) => {
  const newText = req.body.text;

  try {
    // Insert a new task into MongoDB
    const newTask = new Task({ text: newText });
    await newTask.save();
    res.json({ id: newTask._id, text: newText });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//api to update task
app.put("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const newText = req.body.text;

  try {
    // Update the task in MongoDB
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { text: newText },
      { new: true }
    );
    res.json({ id: updatedTask._id, text: newText });
  } catch (err) {
    console.error("Error editing task:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//api to delete 
app.delete("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  try {
    // Delete the task from MongoDB
    await Task.findByIdAndDelete(taskId);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
