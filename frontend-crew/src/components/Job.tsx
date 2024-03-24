import { useParams } from "react-router";

const Job = () => {
  const { id } = useParams();

  return <>job: {id}</>;
};

export default Job;
