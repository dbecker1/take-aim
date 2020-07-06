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
        },
        tickTargets: state => {
            state.forEach(target => {
                if (target.hasOwnProperty("dx")) {
                    target.x = target.x + target.dx
                    if (target.x > target.maxX || target.x < 0)
                        target.dx = -target.dx
                }
                if (target.hasOwnProperty("dy")) {
                    target.y = target.y + target.dy
                    if (target.y > target.maxY || target.y < 0)
                        target.dy = -target.dy
                }
            })
        }
    },
});

export const { addTarget, wipeTargets, removeTargetById, tickTargets } = targetSlice.actions;

export default targetSlice.reducer;
