import { createSlice } from '@reduxjs/toolkit';

export const shotSlice = createSlice({
    name: 'shotTracker',
    initialState: {
        shots: [],
        timerStart: null
    },
    reducers: {
        addShot: (state, action) => {
            if (state.timerStart != null && !!action.payload.timestamp) {
                let split = action.payload.timestamp - state.timerStart;
                action.payload.split = split;
            }
            state.shots.push(action.payload)
        },
        setTimer: (state, action) => {
            state.timerStart = action.payload
        },
        wipeShots: state => {
            state.shots = []
        }
    },
});

export const { addShot, setTimer, wipeShots } = shotSlice.actions;

export default shotSlice.reducer;
