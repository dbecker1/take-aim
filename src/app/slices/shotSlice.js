import { createSlice } from '@reduxjs/toolkit';

export const shotSlice = createSlice({
    name: 'shotTracker',
    initialState: {
        shots: [],
        timerStart: null,
        shootingMode: null
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
        },
        setShootingMode: (state, action) => {
            state.shootingMode = action.payload
        }
    },
});

export const { addShot, setTimer, wipeShots, setShootingMode } = shotSlice.actions;

export default shotSlice.reducer;
