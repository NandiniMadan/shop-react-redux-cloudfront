import React, { useCallback, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import LoginModal from "~/components/LoginModal/LoginModal";


type CSVFileImportProps = {
  url: string;
  title: string;
};

const UPLOADED_MESSAGE = "File uploaded successfully";
const ERR_ON_UPLOAD = "File upload failed";

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = useState<File>();
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const [isOpenToaster, setToasterState] = useState(false);
  const [toasterSeverity, setToasterSeverity] = useState<null | boolean>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const handleToaster = useCallback(() => {
    setToasterState((state) => !state);
  }, [isOpenToaster]);

  const handleLoginModalClose = () => {
    setLoginModalOpened(false);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);
    const token = localStorage.getItem('authorization_token');
    if (!file) return;

    // Get the presigned URL
    await axios({
      method: "GET",
      url,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        'Authorization': token ? `Basic ${token}` : false
      },
      params: {
        name: encodeURIComponent(file.name),
      },
    }).then(async (response) => {
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);
      if (response.data) {
        await fetch(response.data.signedURL, {
          method: "PUT",
          body: file,
        }).then((result) => {
          console.log("Result: ", result);
          setToasterState(true);
          setToasterSeverity(true);
          setFile(undefined);
        });
      }
    })
      .catch(() => {
        setToasterSeverity(false);
        setToasterState(true);
      });
  };
  return (
    <>
      <Box>

        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {!file ? (
          <input type="file" onChange={onFileChange} />
        ) : (
          <div>
            <button onClick={removeFile}>Remove file</button>
            <button onClick={uploadFile}>Upload file</button>
          </div>

        )}
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isOpenToaster}
          onClose={handleToaster}
          resumeHideDuration={2000}
        >
          <Alert
            onClose={handleToaster}
            severity={toasterSeverity ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {`${toasterSeverity ? UPLOADED_MESSAGE : ERR_ON_UPLOAD
              }`}
          </Alert>
        </Snackbar>
      </Box>
      <LoginModal
        open={loginModalOpened}
        onClose={handleLoginModalClose}
        onLogin={uploadFile}
      />
    </>
  );
}
