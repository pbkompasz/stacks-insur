import axios from "axios";

const fetchPrice = async (symbol = 'STX') => {
  const resp = await axios.get(
    `https://api.redstone.finance/prices?provider=redstone&symbol=${symbol.toUpperCase()}&limit=1`,
  );
  const stxValue = resp.data[0].value;
  return stxValue;
};

const convertPrice = async (price:number, fromSymbol = 'STX', toSymbol = 'USD') => {
  const fromValue = fromSymbol !== 'USD' ?  await fetchPrice(fromSymbol) : 1;
  const toValue = toSymbol !== 'USD' ?  await fetchPrice(toSymbol) : 1;
  return price * fromValue * (1/toValue);
}

export { fetchPrice, convertPrice };
