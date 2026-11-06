import fs from 'node:fs';
import path from 'node:path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete file:', filePath, error.message);
  }
};

export const deleteFiles = (filenames = []) => {
  for (const name of filenames) deleteFile(name);
};
