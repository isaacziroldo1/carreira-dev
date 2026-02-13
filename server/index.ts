import { createApp } from "./app";
import { PORT } from "./config";
import { ensureData } from "./data/store";

const app = createApp();

app.listen(PORT, () => {
  ensureData();
  console.log(`API rodando em http://localhost:${PORT}`);
});
