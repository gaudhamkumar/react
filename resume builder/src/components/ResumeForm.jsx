import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ArrayInput = ({ label, items, fields, setData, keyName, addLabel }) => (
  <>
    <Typography variant="h6" sx={{ mt: 2 }}>
      {label}
    </Typography>
    {Array.isArray(items) && items.map((item, i) => (
      <Stack spacing={1} key={i} direction="row" alignItems="flex-start">
        <Stack spacing={1} sx={{ flex: 1 }}>
          {fields.map((f) => (
            <TextField
              key={f.name}
              label={f.label}
              multiline={f.multiline || false}
              rows={f.rows || 1}
              value={item[f.name] || ""}
              onChange={(e) => {
                const updated = [...items];
                updated[i][f.name] = e.target.value;
                setData((prev) => ({ ...prev, [keyName]: updated }));
              }}
            />
          ))}
        </Stack>
        {items.length > 1 && (
          <Button
            variant="outlined"
            color="error"
            sx={{ height: "40px", mt: 1 }}
            onClick={() => {
              const updated = items.filter((_, index) => index !== i);
              setData((prev) => ({ ...prev, [keyName]: updated.length ? updated : [{}] }));
            }}
          >
            Delete
          </Button>
        )}
      </Stack>
    ))}
    <Button
      variant="outlined"
      size="small"
      sx={{ mt: 1 }}
      onClick={() => {
        const empty = fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
        setData((prev) => ({ ...prev, [keyName]: [...(Array.isArray(items) ? items : []), empty] }));
      }}
    >
      {addLabel}
    </Button>
  </>
);

export default function ResumeForm({ data, setData, onDownload, resumeTheme, setResumeTheme, user }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));
  const canDownload = data.name && data.email && data.phone;

  // Save resume per user UID
  const saveResume = async () => {
    if (!user) {
      setSnackbar({ open: true, message: "User not authenticated", severity: "error" });
      return;
    }
    try {
      await setDoc(doc(db, "resumes", user.uid), { ...data, userEmail: user.email });
      setSnackbar({ open: true, message: "Resume saved successfully ✅", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to save resume ❌", severity: "error" });
    }
  };

  // Load resume per user UID
  const loadResume = async () => {
    if (!user) {
      setSnackbar({ open: true, message: "User not authenticated", severity: "error" });
      return;
    }
    try {
      const docRef = doc(db, "resumes", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
        setSnackbar({ open: true, message: "Resume loaded successfully ✅", severity: "success" });
      } else {
        setSnackbar({ open: true, message: "No resume found for this user", severity: "info" });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to load resume ❌", severity: "error" });
    }
  };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>Resume Theme</InputLabel>
        <Select value={resumeTheme} onChange={(e) => setResumeTheme(e.target.value)} label="Resume Theme">
          <MenuItem value="classic">Classic</MenuItem>
          <MenuItem value="modern">Modern</MenuItem>
          <MenuItem value="creative">Creative</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6">Personal Info</Typography>
      <TextField label="Full Name" value={data.name || ""} onChange={handleChange("name")} required />
      <TextField label="Title / Role" value={data.title || ""} onChange={handleChange("title")} />
      <TextField label="Email" value={data.email || ""} onChange={handleChange("email")} required />
      <TextField label="Phone" value={data.phone || ""} onChange={handleChange("phone")} required />

      <TextField label="Summary" multiline rows={3} value={data.summary || ""} onChange={handleChange("summary")} />
      <TextField label="Skills" multiline rows={2} value={data.skills || ""} onChange={handleChange("skills")} />

      <ArrayInput
        label="Languages"
        items={data.languages || [{ language: "" }]}
        keyName="languages"
        setData={setData}
        fields={[{ name: "language", label: "Language" }]}
        addLabel="+ Add Language"
      />
      <ArrayInput
        label="Activities"
        items={data.activities || [{ activity: "" }]}
        keyName="activities"
        setData={setData}
        fields={[{ name: "activity", label: "Activity", multiline: true, rows: 2 }]}
        addLabel="+ Add Activity"
      />
      <ArrayInput
        label="Experience"
        items={data.experience || []}
        keyName="experience"
        setData={setData}
        fields={[
          { name: "company", label: "Company" },
          { name: "role", label: "Role" },
          { name: "period", label: "Period" },
          { name: "description", label: "Description", multiline: true, rows: 2 },
        ]}
        addLabel="+ Add Experience"
      />
      <ArrayInput
        label="Education"
        items={data.education || []}
        keyName="education"
        setData={setData}
        fields={[
          { name: "institution", label: "Institution" },
          { name: "year", label: "Year" },
        ]}
        addLabel="+ Add Education"
      />
      <ArrayInput
        label="Projects"
        items={data.projects || []}
        keyName="projects"
        setData={setData}
        fields={[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", multiline: true, rows: 2 },
        ]}
        addLabel="+ Add Project"
      />
      <ArrayInput
        label="Certifications"
        items={data.certifications || []}
        keyName="certifications"
        setData={setData}
        fields={[
          { name: "name", label: "Certification Name" },
          { name: "issuer", label: "Issuer" },
        ]}
        addLabel="+ Add Certification"
      />

      <Stack direction="row" spacing={2} mt={2}>
        <Button variant="contained" onClick={saveResume}>
          Save Resume
        </Button>
        <Button variant="outlined" onClick={loadResume}>
          Load Resume
        </Button>
        <Button variant="contained" onClick={onDownload} disabled={!canDownload}>
          Download PDF
        </Button>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Stack>
  );
}
