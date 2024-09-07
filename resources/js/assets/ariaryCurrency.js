import currency from "currency.js";

const Ar = (value) =>
  currency(value, { symbol: " Ar ", precision: 0 }).format();

export default Ar;
