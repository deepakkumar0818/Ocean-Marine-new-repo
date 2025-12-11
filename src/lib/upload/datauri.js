import DataURIParser from "datauri/parser";
import path from "path";

const parser = new DataURIParser();

export const formatBufferTo64 = (file) => {
  const ext = path.extname(file.originalname).toString();
  return parser.format(ext, file.buffer);
};
