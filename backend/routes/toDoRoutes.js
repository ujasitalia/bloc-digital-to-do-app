import express from "express";
import { stringValidator, categoryValidator } from "../helpers.js";
import { getUserByEmail } from "../data/userData.js";
import { createTodo, getToDoById, deleteToDoById, editToDoByIdToComplete, getAllToDoByUserName, filterToDos, sortToDos } from "../data/toToData.js";

const router = express.Router();

router.post("/new", async function (req, res) {
  let { userName, text, category } = req.body;
  const user = req.user;
  //   data validation
  try {
    userName = stringValidator(userName, "username");
    text = stringValidator(text, "text");
    category = categoryValidator(category);
    if(user.email !== userName) {
        res.status(400).json({ error: "username and the user does not match" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }

  //   send data to db
  try {
    // check if user is in db
    await getUserByEmail(userName);
    // create to-do in db
    const toDo = await createTodo(userName, text, category);
    res.status(200).json({ toDo: toDo });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error});
  }
});

router.delete('/delete/:id', async function(req, res) {
    const user = req.user;
    const id = req.params.id;
    // check if this to-do belongs to the authenticated/current user
    try {
        let toDo = await getToDoById(id);
        console.log('found todo');
        if(!(toDo.userName === user.email)) {
            res.status(404).json({ error: 'this to-do belongs to a different user' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error});
    }
    
    // delete the to-do
    try {
        const deletedToDo = await deleteToDoById(id);
        res.status(200).json(`deleted to-do with ${id}`);
    } catch (error) {
        console.log('here');
        console.log(error);
        res.status(400).json({ error: error});
    }
})

router.put('/complete/:id', async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    // check if this to-do belongs to the authenticated/current user
    try {
        let toDo = await getToDoById(id);
        if(!(toDo.userName === user.email)) {
            res.status(404).json({ error: 'this to-do belongs to a different user' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error});
    }

    // edit the to-do
    try {
       const toDo = await editToDoByIdToComplete(id); 
    //    console.log(toDo);
       res.status(200).json(toDo);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error});
    }
})

router.get('/', async (req, res) => {
    const user = req.user;
    // get all the to-dos that belong to this user
    try {
        const toDos = await getAllToDoByUserName(user.email);
        res.status(200).json(toDos);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error});
    }
})

// filter the to-dos based on category or completion
router.get('/filter/:by/:value', async (req, res) => {
   let by = req.params.by;
   let value = req.params.value;
   const user = req.user;
   try {
    const toDos = await filterToDos(user.email, by, value);
    // console.log(toDos);
    res.status(200).json(toDos);
   } catch (error) {
    console.log(error);
        res.status(400).json({ error: error});
   } 
})

// sort the to-dos by category or timestamp or completion
router.get('/sort/:by', async function (req, res) {
    const user = req.user;
    const sortBy = req.params.by;
    try {
    const toDos = await sortToDos(user.email, sortBy);
    res.status(200).json(toDos);
   } catch (error) {
    console.log(error);
        res.status(400).json({ error: error});
   } 
})

export default router;
