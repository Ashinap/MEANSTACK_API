const express =require('express');
const app=express();
const mongoose = require('./database/mongoose');
const cors = require('cors');

const TaskList = require('./database/models/taskList')
const Task = require('./database/models/task');

app.use(express.json());//3rd party body parser
// Enable CORS for all routes
app.use(cors());//CORS -cross origin request security
//routes  of Rest API
//Tasklist -create,update,ReadtaskListById,ReadAllTaskList
//Task -create,update,ReadtaskById,ReadAllTask
//get all tasklists
//http://localhost:3000/tasklists

app.get('/tasklists',(req,res)=>{
TaskList.find({})
.then((lists)=>
{
    res.send(lists)
    res.status(200);

})
.catch((error)=>{console.log('error')});
});

//get only one object

app.get('/tasklists/:tasklistId',(req,res)=>{
    let tasklistId= req.params.tasklistId;
    TaskList.find({_id:tasklistId}) 
    .then((taskList)=>
    {
        res.send(taskList)
        res.status(200);
    
    })
    .catch((error)=>{console.log('error')});
    }   );

    //Route or endpoint for creating a tasklist

app.post('/tasklists',(req,res)=>{
  let taskListObj ={'title':req.body.title}
  TaskList(taskListObj).save()
  .then((taskList)=>{
    res.status(201);
    res.send(taskList)
    
})
.catch((error)=>{console.log('error')});

})
// put-full update

app.put('/tasklists/:tasklistId',(req,res)=>{
    TaskList.findOneAndUpdate({_id:req.params.tasklistId},{$set:req.body})
    .then((taskList)=>
    {
        res.send(taskList)
        res.status(200);
    
    })
    
    .catch((error)=>{console.log('error')});
});
//patch- partial update
app.patch('/tasklists/:tasklistId',(req,res)=>{
    TaskList.findOneAndUpdate({_id:req.params.tasklistId},{$set:req.body})
    .then((taskList)=>
    {
        res.send(taskList)
        res.status(200);
    
    })
    
    .catch((error)=>{console.log('error')});
});
//delete a task
app.delete('/tasklists/:tasklistId',(req,res)=>{

//delete all taskswithin a tasklist if that tasklist is deleted
const deleteAllContainingTask =(taskList)=>{
    Task.deleteMany({_taskListId:req.params.tasklistId})
    .then(()=>{return taskList})
    .catch((error)=>{console.log('error')});


}


   const responseTaskList= TaskList.findByIdAndDelete(req.params.tasklistId)
    .then((taskList)=>
    {
        deleteAllContainingTask(taskList);
        
    
    })
    
    .catch((error)=>{console.log('error')});

    res.send(responseTaskList)
        res.status(201);
});



// crud operations for task, a task is always belongs ti tasklist

//http://localhost:3000/task/lists/:tasklistId/tasks
app.get('/tasklists/:tasklistId/tasks',(req,res)=>{
    
    Task.find({_taskListId: req.params.tasklistId}) 
    .then((tasks)=>
    {
        res.send(tasks)
        res.status(200);
    
    })
    .catch((error)=>{console.log('error')});
    }   );
    app.post('/tasklists/:tasklistId/tasks',(req,res)=>{
        let taskObj ={'title':req.body.title,'_taskListId':req.params.tasklistId}
        Task(taskObj).save()
        .then((task)=>{
          res.status(201);
          res.send(task)
          
      })
      .catch((error)=>{console.log('error')});
      
      })
      //
// create a task inside a particulr task list
app.post('/tasklists/:tasklistId/tasks',(req,res)=>{
    let taskObj ={'title':req.body.title,'_taskListId':req.params.tasklistId}
    Task(taskObj).save()
    .then((task)=>{
      res.status(201);
      res.send(task)
      
  })
  .catch((error)=>{console.log('error')});
  
  })
//get one task inside the tasklist
app.get('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
    
    Task.findOne({_taskListId: req.params.tasklistId,_id:req.params.taskId}) 
    .then((task)=>
    {
        res.send(task)
        res.status(200);
    
    })
    .catch((error)=>{console.log('error')});
    }   );
//update 1 task belonging to one tasklist
app.patch('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
    Task.findOneAndUpdate({_taskListId:req.params.tasklistId,_id:req.params.taskId},{$set:req.body})
    .then((task)=>
    {
        res.send(task)
        res.status(200);
    
    })
    
    .catch((error)=>{console.log('error')});
});



//Delete  a task inside a tasklist
app.delete('/tasklists/:tasklistId/tasks/:taskId',(req,res)=>{
    Task.findOneAndDelete({_taskListId:req.params.tasklistId,_id:req.params.taskId})
    .then((task)=>
    {
        res.send(task)
        res.status(200);
    
    })
    
    .catch((error)=>{console.log('error')});
});




app.listen(3000,function(){
    console.log('sever started on port 3000')
})