import { createSlice } from '@reduxjs/toolkit';

export const targetSlice = createSlice({
    name: 'targets',
    initialState: [],
    reducers: {
        addTarget: (state, action) => {
            state.push(action.payload)
        },
        wipeTargets: state => {
            state.length = 0;
        },
        removeTargetById: (state, action) => {
            return state.filter(a => a.id !== action.payload);
        }
    },
});

export const { addTarget, wipeTargets, removeTargetById } = targetSlice.actions;

export default targetSlice.reducer;
