import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginForm, { LoginFormFields } from "~/components/LoginForm/LoginForm";
import { Modal } from "@mui/material";
import { useLogin } from "~/hooks/useLogin";

interface LoginModalProps {
    onLogin: () => void;
    open: boolean;
    onClose?: () => void;
}

export default function LoginModal(props: LoginModalProps) {
    const { open, onLogin, onClose } = props;
    const { login } = useLogin();

    const handleSubmit = (creds: LoginFormFields) => {
        login(creds);
        onClose?.();
        onLogin();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography mb={1} variant="h5" component="h2">
                    Sign in
                </Typography>
                <LoginForm onSubmit={handleSubmit} />
            </Box>
        </Modal>
    );
}