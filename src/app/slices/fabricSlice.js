import { createSlice } from '@reduxjs/toolkit';

export const fabricSlice = createSlice({
    name: 'fabric',
    initialState: {
        fabricObject: {}
    },
    reducers: {
        updateFabricObject: (state, action) => {
            state.fabricObject = action.payload
        }
    },
});

export const { updateFabricObject } = fabricSlice.actions;

export default fabricSlice.reducer;
