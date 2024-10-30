import { app } from "electron";
import { join } from "path";

import { Store } from "./store";
import { Settings } from "../models/settings";

const settingsStore = new Store<Settings>({
  defaults: {
    data_dir: join(app.getPath("documents"), app.name),
    viewer: "",
  },
});

export default settingsStore;
