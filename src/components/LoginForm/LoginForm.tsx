import { useFormik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import { string, object } from "yup";

export interface LoginFormFields {
    username: string;
    password: string;
}

interface LoginFormProps {
    onSubmit: (values: LoginFormFields) => void;
}

const validationSchema = object({
    username: string().required("Username is required"),
    password: string().required("Password is required"),
});

export default function LoginForm(props: LoginFormProps) {
    const { onSubmit } = props;
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Box sx={{ marginBottom: "10px" }}>
                <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    type="text"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                />
            </Box>
            <Box sx={{ marginBottom: "10px" }}>
                <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
            </Box>
            <Button color="primary" variant="contained" fullWidth type="submit">
                Login
            </Button>
        </form>
    );
}