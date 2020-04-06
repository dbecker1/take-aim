import { createSlice } from '@reduxjs/toolkit';

export const fabricSlice = createSlice({
    name: 'fabric',
    initialState: {
        fabricObject: {},
        targetRenderScales: []
    },
    reducers: {
        updateFabricObject: (state, action) => {
            state.fabricObject = action.payload
        },
        setTargetRenderScales: (state, action) => {
            state.targetRenderScales = action.payload
        }
    },
});

export const { updateFabricObject, setTargetRenderScales } = fabricSlice.actions;

export default fabricSlice.reducer;
