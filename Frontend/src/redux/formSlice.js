import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    title: "",
    body: "",
    recipients: [],
    scheduleTime: "",
    attachments: [],
  },
  reducers: {
    setField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetForm: (state) => {
      state.title = "";
      state.body = "";
      state.recipients = [];
      state.scheduleTime = "";
      state.attachments = [];
    },
  },
});

export const { setField, resetForm } = formSlice.actions;
export default formSlice.reducer;
