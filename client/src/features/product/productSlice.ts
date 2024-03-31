import axios from "axios";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IProduct {
  _id:string
  name: string;
  description: string;
  price: number;
  img: string;
  category: string;
}

interface IProductState {
  productList: IProduct[];
  isLoading: boolean;
}

const initialState: IProductState = {
  productList: [],
  isLoading: false,
};

export const getAllProduct = createAsyncThunk(
  "auth/register",
  async (queryObject: { category : string , search : string}, thunkApi) => {
    try {
      const response = await axios.get(`http://localhost:5000/product?category=${queryObject.category}&search=${queryObject.search}`);
      console.log(response);
      return response.data;
    } catch (err: any) {
      console.log(err);
      const msg =
        typeof err?.response?.data?.message === "object"
          ? err?.response?.data?.message[0]
          : err?.response?.data?.message;
      return thunkApi.rejectWithValue(msg);
    }
  }
);

const ProductSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllProduct.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getAllProduct.fulfilled, (state, action) => {
      state.productList = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllProduct.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default ProductSlice.reducer;
