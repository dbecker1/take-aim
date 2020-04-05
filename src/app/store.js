import { configureStore } from '@reduxjs/toolkit';
import shotReducer from "./slices/shotSlice";

export default configureStore({
    reducer: {
        shotTracker: shotReducer,
    },
});
