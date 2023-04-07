import { Store } from "./store";
import { Settings } from "../models/settings";

const settingsStore = new Store<Settings>({ defaults: { viewer: "" } });

export default settingsStore;
