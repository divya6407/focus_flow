const BASE_URL ="https://focus-flow-9je5.onrender.com";

export const gettask= async()=>
{
    const res =await fetch(`${BASE_URL}/task`);
    return res.json();
}
export const gettaskbyid= async(id)=>
{
    const res =await fetch(`${BASE_URL}/task/${id}`);
    return res.json();
}
export const searchtask= async({priority,keyword})=>
{
    const params = new URLSearchParams();
    if (priority) params.append("priority", priority);
  if (keyword) params.append("keyword", keyword);

    const res =await fetch(`${BASE_URL}/task/search?${params}`);
    return res.json();
}

export const posttask =async (taskdata)=>{
    const res = await fetch(`${BASE_URL}/task`,
        {method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(taskdata),}
    );
    return res.json();
}

export const updatetask =async (id,taskdata)=>{
    const res = await fetch(`${BASE_URL}/task/${id}`,
        {method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(taskdata),}
    );
    return res.json();
}
export const deletetask =async (id)=>{
    const res = await fetch(`${BASE_URL}/task/${id}`,
        {method:  "DELETE",
    }
    );
    return res.json();
}
