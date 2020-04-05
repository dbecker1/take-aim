import { createSlice } from '@reduxjs/toolkit';

export const projectorSlice = createSlice({
    name: 'projector',
    initialState: {
        resized: false,
        canvasWidth: 0,
        canvasHeight: 0,
        nonTargetElements: [],
        fabricObject: {}
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
        updateFabricObject: (state, action) => {
            state.fabricObject = action.payload
        }
    },
});

export const { finishResize, addNonTargetElement, removeNonTargetElementByName, wipeNonTargetElements, updateFabricObject } = projectorSlice.actions;

export default projectorSlice.reducer;
