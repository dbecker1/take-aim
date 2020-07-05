import { createSlice } from '@reduxjs/toolkit';

export const configSlice = createSlice({
    name: 'config',
    initialState: {
        twoPlayer: false,
    },
    reducers: {
        setTwoPlayerStatus: (state, action) => {
            state.twoPlayer = action.payload
        },
    },
});

export const { setTwoPlayerStatus } = configSlice.actions;

export default configSlice.reducer;
