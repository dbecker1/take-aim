import { createSlice } from '@reduxjs/toolkit';

export const targetSlice = createSlice({
    name: 'targets',
    initialState: [],
    reducers: {
        addTarget: (state, action) => {
            state.push(action.payload)
        },
        wipeTargets: state => {
            state = []
        }
    },
});

export const { addTarget, wipeTargets } = targetSlice.actions;

export default targetSlice.reducer;
