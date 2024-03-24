import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";

import Explorer from "../../reusable/Explorer.tsx";
import BuySmartContractCover from "./BuySmartContractCover.tsx";
import { fetchCovers } from "../../../util/backend.ts";
import type { Cover } from "./Covers.tsx";
import { fetchCover } from "../../../util/hiro.ts";

const SmartContractExplorer = () => {
  const [open, setOpen] = useState(false);
  const [covers, setCovers] = useState([]);
  const [cover, setCover] = useState({} as Cover);
  const [error, setError] = useState("");

  const openCover = (cover: Cover) => {
    setOpen(true);
    setCover(cover);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchCovers()
      .then(async (covers) => {
        const newCovers = await Promise.all(
          covers.map(async (cover: Cover) => {
            const data = await fetchCover(cover.name);
            return {
              ...cover,
              fromChain: {
                riskRating: parseInt(data?.risk_factor?.value ?? 0),
                riskAssessors: parseInt(data?.stakers_risk?.value ?? 0),
                buyers: parseInt(data?.buyers?.value ?? 0),
                claimRequests: parseInt(data?.start_vote?.value ?? 0),
              },
            };
          })
        );
        setCovers(newCovers);
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  return (
    <>
      {error && <>{error}</>}
      <Explorer covers={covers} openCover={openCover} error={error}></Explorer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minHeight: "50vh" }}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Add to Cart"}</DialogTitle>
        <DialogContent>
          <BuySmartContractCover cover={cover}></BuySmartContractCover>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartContractExplorer;
