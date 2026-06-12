import express from 'express';
import * as taskcntrl from '../controller/taskcontroller.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // all task routes require login

router.get('/', taskcntrl.getalltask);
router.get('/search', taskcntrl.gettaskbysearch);
router.get('/:id', taskcntrl.gettaskbyid);
router.post('/', taskcntrl.posttask);
router.put('/:id', taskcntrl.updatetask);
router.delete('/:id', taskcntrl.deletetask);

export default router;