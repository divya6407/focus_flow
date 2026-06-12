import store from '../data/taskdata.js'


export const getalltask = (req, res) => {
  res.status(200).json({
    sucess:true,
    data:store.tasks
  });
};

export const gettaskbyid =(req,res)=>{
    const id = parseInt(req.params.id);
    const result = store.tasks.find((i)=>i.id===id);
    res.status(200).json({
        sucess:true,
        data:result
    });
}

export const gettaskbysearch =(req,res)=>{
    const { priority, keyword }=req.query;
    console.log(req.query);
    let result=[...store.tasks];
    if(priority&&keyword) {result =result.filter((i)=>i.priority.toLowerCase()===priority.toLowerCase()&& i.title.toLowerCase().includes(keyword.toLowerCase()))}
    else if(priority){result =result.filter((i)=>i.priority.toLowerCase()===priority.toLowerCase())}
    else if(keyword){result =result.filter((i)=>i.title.toLowerCase().includes(keyword.toLowerCase()))}
    res.status(200).json({
      sucess:true,
      data:result
    })
}

export const posttask=(req,res)=>{
  console.log(req.body)
  const { title , priority}=req.body;
  console.log(title,priority);
  if(!title || !priority){
    return res.status(400).json({
      sucess:false,
      msg:"title and priority field are required"
    })
  }
  const newpost ={
    id:store.nextid++,
    "title":title,
    "priority":priority,
    "completed":false
  }
  store.tasks.push(newpost)
  res.status(200).json({
    sucess:true,
    data:newpost
  })
}

export const updatetask =(req,res)=>{
  const id =parseInt(req.params.id);
  let uid = store.tasks.findIndex(i=> i.id===id);

  if(uid==-1){
    return res.status(404).json({
      sucess:false,
      msg:"the id is not available"
    })
  }
  const {title, priority,completed}=req.body;
  store.tasks[uid] = {
    ...store.tasks[uid],
    title,
    priority,
    completed
  }
  res.status(200).json({
    sucess:true,
    data:store.tasks[uid]
  })
}

export const deletetask=(req,res)=>{
  const id = parseInt(req.params.id);
  let uid = store.tasks.findIndex(i=> i.id===id);
  if(uid==-1){
    return res.status(404).json({
      sucess:false,
      msg:"the id is not available"
    })
  }
  let deleted = store.tasks.splice(uid,1);
  res.status(200).json({
    sucess:true,
    data:deleted
  })
}