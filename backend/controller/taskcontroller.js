import store from '../data/taskdata.js';

const getUserTasks = (userId) => {
  if (!store.tasksByUser[userId]) store.tasksByUser[userId] = [];
  return store.tasksByUser[userId];
};

export const getalltask = (req, res) => {
  const tasks = getUserTasks(req.user.id);
  res.status(200).json({ sucess: true, data: tasks });
};

export const gettaskbyid = (req, res) => {
  const tasks = getUserTasks(req.user.id);
  const id = parseInt(req.params.id);
  const result = tasks.find((i) => i.id === id);
  res.status(200).json({ sucess: true, data: result });
};

export const gettaskbysearch = (req, res) => {
  const { priority, keyword } = req.query;
  let result = [...getUserTasks(req.user.id)];
  if (priority && keyword) {
    result = result.filter(
      (i) =>
        i.priority.toLowerCase() === priority.toLowerCase() &&
        i.title.toLowerCase().includes(keyword.toLowerCase())
    );
  } else if (priority) {
    result = result.filter((i) => i.priority.toLowerCase() === priority.toLowerCase());
  } else if (keyword) {
    result = result.filter((i) => i.title.toLowerCase().includes(keyword.toLowerCase()));
  }
  res.status(200).json({ sucess: true, data: result });
};

export const posttask = (req, res) => {
  const { title, priority } = req.body;
  if (!title || !priority) {
    return res.status(400).json({ sucess: false, msg: 'title and priority field are required' });
  }
  const tasks = getUserTasks(req.user.id);
  const newpost = { id: store.nextid++, title, priority, completed: false, userId: req.user.id };
  tasks.push(newpost);
  res.status(200).json({ sucess: true, data: newpost });
};

export const updatetask = (req, res) => {
  const tasks = getUserTasks(req.user.id);
  const id = parseInt(req.params.id);
  const uid = tasks.findIndex((i) => i.id === id);
  if (uid === -1) return res.status(404).json({ sucess: false, msg: 'the id is not available' });
  const { title, priority, completed } = req.body;
  tasks[uid] = { ...tasks[uid], title, priority, completed };
  res.status(200).json({ sucess: true, data: tasks[uid] });
};

export const deletetask = (req, res) => {
  const tasks = getUserTasks(req.user.id);
  const id = parseInt(req.params.id);
  const uid = tasks.findIndex((i) => i.id === id);
  if (uid === -1) return res.status(404).json({ sucess: false, msg: 'the id is not available' });
  const deleted = tasks.splice(uid, 1);
  res.status(200).json({ sucess: true, data: deleted });
};