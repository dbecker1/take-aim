import { createSlice } from '@reduxjs/toolkit';

export const projectorSlice = createSlice({
    name: 'projector',
    initialState: {
        launch: false,
        resized: false,
        canvasWidth: 0,
        canvasHeight: 0,
        nonTargetElements: [],
    },
    reducers: {
        finishResize: (state, action) => {
            state.resized = true;
            state.canvasHeight = action.payload.canvasHeight;
            state.canvasWidth = action.payload.canvasWidth;
        },
        addNonTargetElement: (state, action) => {
            state.nonTargetElements.push(action.payload)
        },
        removeNonTargetElementByName: (state, action) =>{
            state.nonTargetElements = state.nonTargetElements.filter(a => {return a.name !== action.payoad})
        },
        wipeNonTargetElements: state => {
            state.nonTargetElements = []
        },
        launchProjector: state => {
            state.launch = true;
        }
    },
});

export const { finishResize, addNonTargetElement, removeNonTargetElementByName, wipeNonTargetElements, launchProjector } = projectorSlice.actions;

export default projectorSlice.reducer;
