import { Router } from 'express';
import multer from 'multer';
import path from 'path';

const upload = multer({ dest: process.env.UPLOAD_DIR });
const router = Router();

router.post('/', upload.single('file'), (req, res) => {
  res.json({ filePath: req.file.path });
});

router.get('/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(process.env.UPLOAD_DIR, filename));
});

export default router;