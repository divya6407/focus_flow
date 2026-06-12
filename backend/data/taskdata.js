// Tasks stored per userId: { [userId]: [{...task}] }
const store = {
  tasksByUser: {},
  nextid: 1,
};

export default store;