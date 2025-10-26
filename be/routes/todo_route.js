import express from 'express';
import Todo from '../models/todo_models.js';

const router = express.Router();

// Get all todos
router.get('/', async (req , res) => {

    try {
        const todo = await Todo.find();
        console.log("get todos");
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// create todo
router.post('/', async (req, res) => {
    const todo = new Todo({
        text: req.body.text
    })

    try {
        const newTodo = await todo.save();
        console.log(newTodo, "created");
        res.status(200).json(newTodo)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// update todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    console.log(todo, "updating todo");

    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (req.body.text !== undefined) {
      todo.text = req.body.text;
    }

    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.status(200).json(updatedTodo);

  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: error.message });
  }
});

// delete todo 
router.delete('/:id', async (req, res) => {

   try {
        await Todo.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Todo deleted successfully" });
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
})

export default router;