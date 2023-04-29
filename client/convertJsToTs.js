import fs from "fs";
import path from "path";

function convertJsxToTsx(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      convertJsxToTsx(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".jsx")) {
      const newFullPath = fullPath.replace(/\.jsx$/, ".tsx");
      fs.renameSync(fullPath, newFullPath);
      console.log(`Renamed: ${fullPath} -> ${newFullPath}`);
    }
  }
}

convertJsxToTsx("./src");
