const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 4000;
const app = express();
app.use(express.json())
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://maruf:HlySRHaaykFIugON@cluster0.c1kdkc3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const users = client.db('Task-Management').collection('users');
    const tasks = client.db('Task-Management').collection('tasks')
  if(err){
    console.log(err);

  }
  else{
    // Sending user to the database

  app.post('/users',async(req,res)=>{
    const data = req.body
    const result = await users.insertOne(data)
    res.status(200).send(result)
  })

  // Sending the tasks to the user
  app.get('/tasks',async(req,res)=>{
    const data = req.headers.email;
    const filter = {user: data, completed: false }
    const result = await tasks.find(filter).toArray()
    res.send(result)
  })

  // Storing task data to the server
  app.post('/tasks',async(req,res)=>{
    const data = req.body;
    const result = await tasks.insertOne(data);
    res.send(result)  
  })

  // Updating the taasks to complete
  app.put('/tasks',async(req,res)=>{
    const data = req.body;
    const query = {_id: ObjectId(data.id)}
   
    const options = { upsert: true };
    const updateINFO = {
      $set: {
        completed: data.completed
      }
    }

    console.log(data);
    
    const result = await tasks.updateOne(query,updateINFO,options);
    res.send(result)

  })

  // Deleting tasks
  app.delete("/tasks",async(req,res)=>{
    const data = req.headers.taskid;
    
    const filter = {_id: ObjectId(data)}
    const result = await tasks.deleteOne(filter)
    res.send(result);
  })

  // Completed task section 
  app.get('/completed',async(req,res)=>{
  const email = req.headers.email;
  const filter = {user: email, completed:true }

  const result = await tasks.find(filter).toArray();
  res.send(result)
  })
  
  }
});



app.get('/',(req,res)=>{
    res.send("Your server is running")
})
app.listen(port,()=>{
    console.log("Running");
})
