const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const User = require('../models/users');
const Tasks = require('../models/tasks');
const authenticateToken = require('../middlewares/authentication');

router.use(authenticateToken);

router.get('/', async (req, res) => {
    const user = req.user;
    try {
      const { selectFilter } = req.query;
      // Create the filter object
      const filter = {};
  
      // If a filter is selected, apply it
      if (selectFilter) {
        // Handle status filter
        if (["Pending", "In Progress", "Completed"].includes(selectFilter)) {
          filter.status = selectFilter;
        }
  
        // Handle priority filter
        if (["Low", "Medium", "High"].includes(selectFilter)) {
          filter.priority = selectFilter;
        }
  

        if (selectFilter === "Less") {
          filter.duration = { $lt: 60 }; //filter tasks with duration less than 60 minutes
        } else if (selectFilter === "More") {
          filter.duration = { $gte: 60 };  //filter tasks with duration 60 minutes or more
        }
      }
  
      // Fetch tasks based on the filter
      const tasks = await Tasks.find({ userId: user._id, ...filter }).sort({ createdAt: -1 });
  
      // Render the tasks
      res.render('index', { tasks: tasks , user});
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  });
  

router.get('/addtask', async (req, res) => {
    res.render('editTask', { title: 'Edit Task',  task: null });
}); 

router.post('/addtask', async (req, res) => {
    const { title, description, durationforuser, duration, priority, status} = req.body;
    const user = req.user;
    if(!title || !durationforuser ||!duration || !priority || !status) {
        req.flash('addtaskerrors', 'Please fill all fields');
        return res.redirect('/todolist');
    }
    const task = new Tasks({
        title,
        description,
        durationforuser,
        duration,
        priority,
        status,
        userId: user._id
    });
    await task.save();
    res.redirect('/todolist');
});

router.post('/deletetask', async (req, res) => {
    const {taskId} = req.body;
    const deltask = await Tasks.findByIdAndDelete(taskId);
    res.redirect('/todolist');
});


router.get('/:taksid/edittask', async (req, res) => {
    const taskId = req.params.taksid;
    const user = req.user;
    const task = await Tasks.findById(taskId);
    if(!task) {
        return res.status(404).send('Task not found');
    }
    if(task.userId.toString() !== user._id.toString()) {
        return res.status(403).send('Forbidden');
    }

    res.render('editTask', { title: 'Edit Task', task });

});

router.post('/update/task', async (req, res) => {
    const taskId = req.body.taskId;
    const { title, description, durationforuser, duration, priority, status} = req.body;
    const user = req.user;
    if(!title || !durationforuser ||!duration || !priority || !status) {
        req.flash('addtaskerrors', 'Please fill all fields');
        return res.redirect('/todolist');
    } 
    if(!taskId) {
        req.flash('addtaskerrors', 'Task not found');
        return res.redirect('/todolist');
    }
    const task = await Tasks.findByIdAndUpdate(taskId, {
        title,
        description,
        durationforuser,
        duration,
        priority,
        status,
        userId: user._id
    });
    res.redirect('/todolist');
});

router.get('/profile', async (req, res) => {
  const user = req.user;
  res.render('editprofile', { user });
});

router.post('/profile/edit', upload.single('profileImage'), async (req, res) => {
  const update = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.file) {
    update.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };
  }

  await User.findByIdAndUpdate(req.user._id, update);
  res.redirect('/todolist'); // or wherever your user lands
});

router.get('/logout', async (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    req.flash('logoutmessage', 'You have been logged out successfully');
    res.redirect('/users/'); // Redirect to the login page or wherever you want
});

module.exports = router;

