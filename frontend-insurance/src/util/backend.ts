import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE,
  timeout: 5000,
});

const fetchCovers = async (
  type: "smart_contract" | "de-peg" = "smart_contract"
) => {
  try {
    const resp = await client.get(`/covers?type=${type}`);
    return resp.data.covers;
  } catch (error) {
    throw new Error('Wrong request');
  }
};

export { client, fetchCovers };
