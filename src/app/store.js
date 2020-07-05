import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import shotReducer from "./slices/shotSlice";
import projectorReducer from "./slices/projectorSlice"
import targetReducer from "./slices/targetSlice";
import configReducer from "./slices/configSlice";
import {detectHitPoints} from "./hitPointDetectionMiddleware";

export default configureStore({
    reducer: {
        shotTracker: shotReducer,
        projector: projectorReducer,
        targets: targetReducer,
        config: configReducer
    },
    middleware: [...getDefaultMiddleware(), detectHitPoints]
});
