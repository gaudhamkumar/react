import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  CssBaseline,
  Container,
  Typography,
  IconButton,
  createTheme,
  ThemeProvider,
  Paper,
  Box,
  Button,
  Snackbar,
  Alert
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import Login from "./components/Login";
import { useReactToPrint } from "react-to-print";
import { db, auth } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  // Theme
  const [mode, setMode] = useState(() => localStorage.getItem("themeMode") || "light");
  useEffect(() => localStorage.setItem("themeMode", mode), [mode]);
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  // Default resume structure
  const defaultData = {
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    languages: [{ language: "" }],
    activities: [{ activity: "" }],
    projects: [{ title: "", description: "" }],
    certifications: [{ name: "", issuer: "" }],
    experience: [{ company: "", role: "", period: "", description: "" }],
    education: [{ institution: "", year: "" }]
  };

  // Resume Data scoped per user
  const [resumeData, setResumeData] = useState(defaultData);

  useEffect(() => {
    if (!user) return;

    // Load from localStorage for this user
    const saved = localStorage.getItem(`resumeData-${user.uid}`);
    if (saved) setResumeData(JSON.parse(saved));
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(`resumeData-${user.uid}`, JSON.stringify(resumeData));
  }, [resumeData, user]);

  // Resume Theme
  const [resumeTheme, setResumeTheme] = useState(() => localStorage.getItem("resumeTheme") || "classic");
  useEffect(() => localStorage.setItem("resumeTheme", resumeTheme), [resumeTheme]);

  // PDF
  const previewRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => previewRef.current,
    documentTitle: `${resumeData.name || "resume"}`
  });

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // Save Resume
  const saveResume = async () => {
    if (!user) return;

    if (!resumeData.name || !resumeData.email || !resumeData.phone) {
      showSnackbar("Fill at least Name, Email, Phone!", "error");
      return;
    }

    try {
      await setDoc(doc(db, "resumes", user.uid), {
        ...resumeData,
        userEmail: user.email
      });
      showSnackbar("Resume saved successfully ✅", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to save resume ❌", "error");
    }
  };

  // Load Resume
  const loadResume = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "resumes", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setResumeData(docSnap.data());
        showSnackbar("Resume loaded successfully ✅", "success");
      } else {
        showSnackbar("No resume found ⚠️", "warning");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to load resume ❌", "error");
    }
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container sx={{ mt: 4, mb: 4, display: "flex", gap: 3 }}>
        <Box sx={{ flex: 1, minWidth: 0, overflowY: "auto", height: "90vh" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4">Resume Builder</Typography>
            <Box>
              <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit">
                {mode === "light" ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
              <Button
                variant="outlined"
                size="small"
                onClick={async () => {
                  await signOut(auth);
                  setUser(null);
                }}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
          </Box>

          <Paper sx={{ p: 2 }}>
            <ResumeForm
              data={resumeData}
              setData={setResumeData}
              onDownload={handlePrint}
              resumeTheme={resumeTheme}
              setResumeTheme={setResumeTheme}
              saveResume={saveResume}
              loadResume={loadResume}
            />
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, position: "sticky", top: 20, alignSelf: "flex-start", height: "90vh", overflowY: "auto" }}>
          <Paper sx={{ p: 2 }}>
            <ResumePreview ref={previewRef} data={resumeData} resumeTheme={resumeTheme} mode={mode} />
            <Button variant="contained" onClick={handlePrint} sx={{ mt: 2 }} disabled={!resumeData.name || !resumeData.email || !resumeData.phone}>
              Download PDF
            </Button>
          </Paper>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
