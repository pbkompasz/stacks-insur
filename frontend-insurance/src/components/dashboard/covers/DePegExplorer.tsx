import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";

import Explorer from "../../reusable/Explorer.tsx";
import BuyDePegCover from "./BuyDePegCover.tsx";
import { fetchCovers } from "../../../util/backend.ts";
import type { Cover } from "./Covers.tsx";


const DePegExplorer = () => {
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
    fetchCovers('de-peg')
      .then((covers) => {
        setCovers(covers);
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
          <BuyDePegCover cover={cover}></BuyDePegCover>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DePegExplorer;
