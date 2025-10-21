import React, { useState } from "react";
import { Button, TextField, Stack, Typography, Alert, Snackbar } from "@mui/material";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Login failed ❌", severity: "error" });
    }
  };

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Registration failed ❌", severity: "error" });
    }
  };

  return (
    <Stack spacing={2} sx={{ mt: 8, mx: "auto", maxWidth: 400 }}>
      <Typography variant="h5">Login / Register</Typography>
      <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
      <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={login}>Login</Button>
        <Button variant="outlined" onClick={register}>Register</Button>
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Stack>
  );
}

