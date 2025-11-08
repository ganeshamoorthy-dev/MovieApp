import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useParams } from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import AppLoading from "@cs/components/app-loading/AppLoading";

export function AppVideo()
{
  const params = useParams();
  const [loading, setLoading] = useState(true);
  
  return (

    <Dialog
      maxWidth="lg"
      open={true}
      fullWidth={true}
      onClose={() => window.history.back()}
    >

      <DialogTitle sx={{ backgroundColor: "var(--bg-color-3)", color: "var(--text-color-2)", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1.5rem", color: "var(--active-color)" }} > CineSphere Clips</span>
        <IconButton onClick={() => window.history.back()}>
          <CloseIcon sx={{ color: "var(--text-color-2)", "&:hover": { color: "var(--active-color)" } }}></CloseIcon>
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: "var(--bg-color-3)", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {loading && (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
            <AppLoading size="large" text="Loading video..." />
          </div>
        )}
        <div style={{ width: "100%", opacity: loading ? 0 : 1, transition: "opacity 0.3s" }}>
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${ params.videoId }?autoplay=1&mute=0`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoading(false)}>
          </iframe>
        </div>
      </DialogContent>
    </Dialog>

    //We can custom person
    // createPortal(
    //   <dialog open stye>
    //     This is  a dialog
    //   </dialog>
    //   , document.getElementById("overlay"))


  );
}
