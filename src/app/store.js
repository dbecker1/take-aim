import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import shotReducer from "./slices/shotSlice";
import projectorReducer from "./slices/projectorSlice"
import targetReducer from "./slices/targetSlice";
import fabricReducer from "./slices/fabricSlice";
import {detectHitPoints} from "./hitPointDetectionMiddleware";

export default configureStore({
    reducer: {
        shotTracker: shotReducer,
        projector: projectorReducer,
        targets: targetReducer,
        fabric: fabricReducer
    },
    middleware: [...getDefaultMiddleware(), detectHitPoints]
});
