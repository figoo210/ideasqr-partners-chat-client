import React, { useCallback, useContext, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { storage } from "../services/firebase";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, Typography } from "@mui/material";
import { Delete, Done } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import CustomModal from "./Modal";
import { AuthContext } from "../services/AuthContext";
import { removeFromArrayByIndex } from "../services/helper";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function AttachmentsUpload(props) {
  const { user } = useContext(AuthContext);
  const [filesPreview, setFilesPreview] = useState([]);
  const [uploadedFilesUrls, setUploadedFilesUrls] = useState([]);
  const [storageState, setStorageState] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [data, setData] = useState(null);
  const [attachOpen, setAttachOpen] = useState(false);

  const openAttachModal = () => {
    setAttachOpen(true);
  };

  const getAddedData = (d) => {
    setData([...data, d]);
  };

  const handleUpload = (event) => {
    const previewFiles = [];
    const urls = [];
    const storages = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      setUploading(true);
      setUploaded(false);
      const storageRef = ref(storage, `chat_files/${file.name}`);
      storages.push(storageRef);

      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploading(true);
        },
        (error) => {
          // Handle unsuccessful uploads
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            urls.push(downloadURL);
            previewFiles.push(file.name);

            setStorageState(storages);
            setFilesPreview(previewFiles);
            setUploadedFilesUrls(urls);
            setUploading(false);
            setUploaded(true);
          });
        }
      );
    }
  };

  const deleteUploaded = () => {
    // Delete the file
    for (let i = 0; i < storageState.length; i++) {
      const element = storageState[i];
      deleteObject(element)
        .then(() => {
          // File deleted successfully
          setFilesPreview([]);
          setUploaded(false);
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
          console.log("Deleting Error: ", error);
        });
    }
  };

  const UploadContent = useCallback(() => {
    return (
      <>
        {uploading ? (
          <LoadingButton
            loading
            startIcon={<SaveIcon />}
            sx={{
              mx: 1,
              width: "100%",
              my: 5,
              height: "60px",
            }}
            variant="outlined"
          >
            Uploading....
          </LoadingButton>
        ) : (
          <Button
            component="label"
            variant="contained"
            startIcon={uploaded ? <Done /> : <CloudUploadIcon />}
            sx={{
              height: "60px",
              mx: 1,
              width: "100%",
              my: 3,
            }}
            color="warning"
            disabled={uploaded}
          >
            {uploaded ? "Uploaded" : "Upload Attachments"}
            <VisuallyHiddenInput
              type="file"
              accept="*"
              onChange={handleUpload}
              multiple
            />
          </Button>
        )}

        {filesPreview && filesPreview.length > 0 && (
          <Box textAlign={"center"}>
            {filesPreview.map((fp, idx) => (
              <Box
                textAlign="center"
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                key={idx}
                width={600}
                color="black"
              >
                <Typography flex={4} color="black">
                  {fp}
                </Typography>
              </Box>
            ))}

            <Button
              startIcon={<Delete />}
              color="error"
              onClick={deleteUploaded}
              sx={{ mb: 1, flex: 1 }}
            >
              Delete
            </Button>
          </Box>
        )}
      </>
    );
  }, [filesPreview]);

  const sendAttachmentMessage = () => {
    uploadedFilesUrls.forEach((url) => {
      let addMessage = {
        chat_id: props.chatId,
        sender_id: user.data.id,
        message: url,
        is_file: true,
      };
      props.sendMsg(addMessage);
    });
    setAttachOpen(false);
  };

  return (
    <div>
      <AttachFileIcon
        sx={{
          color: "gray",
          fontSize: 28,
          mb: 0.5,
          mr: 0.5,
          cursor: "pointer",
        }}
        onClick={openAttachModal}
      />
      <CustomModal
        open={attachOpen}
        modalTitle={"Send Attachment"}
        updateOpenValue={setAttachOpen}
        ModalContent={UploadContent}
        getAddedData={getAddedData}
        actionBtn="Send"
        actionBtnAction={sendAttachmentMessage}
      />
    </div>
  );
}

export default AttachmentsUpload;
