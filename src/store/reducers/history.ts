import { IHistory } from '@/interfaces/history';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const History = createSlice({
  name: 'history',
  initialState: {
    list: [] as Array<IHistory>,
  },
  reducers: {
    add: (state, action: PayloadAction<IHistory>) => {
      const newList = state.list.filter(
        (item) => item.id !== action.payload.id,
      );

      if (newList.length === 100) {
        newList.pop();
      }

      newList.unshift(action.payload);

      state.list = newList;
    },
    clear: (state, _) => {
      state.list = [];
    },
  },
});

export default History.reducer;

export const historyActions = History.actions;
