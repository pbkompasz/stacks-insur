import { useParams } from 'react-router';

const Agent = () => {
  const { id } = useParams();

  return <>agent: {id}</>;
}

export default Agent;
