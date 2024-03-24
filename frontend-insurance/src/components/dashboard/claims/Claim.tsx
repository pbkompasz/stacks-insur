type Claim = {
  id: string;
};

const Claim = ({ claim }: { claim: Claim }) => {
  return <>{claim.id}</>;
};

export default Claim;
