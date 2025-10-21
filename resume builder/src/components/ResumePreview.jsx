import React, { forwardRef } from 'react';
import { Typography, Divider, Stack, Box } from '@mui/material';

const themeStyles = {
  classic: {
    fontFamily: 'Times New Roman, serif',
    headerColor: '#2c3e50',
    sectionTitleColor: '#34495e',
    sectionHeaderSize: '18px',
    sectionContentSize: '14px',
    sectionSpacing: 16,
  },
  modern: {
    fontFamily: 'Arial, sans-serif',
    headerColor: '#1976d2',
    sectionTitleColor: '#0d47a1',
    sectionHeaderSize: '20px',
    sectionContentSize: '15px',
    sectionSpacing: 20,
  },
  creative: {
    fontFamily: 'Courier New, monospace',
    headerColor: '#d32f2f',
    sectionTitleColor: '#5d9971',
    sectionHeaderSize: '19px',
    sectionContentSize: '14px',
    sectionSpacing: 18,
  },
};

const ResumePreview = forwardRef(({ data = {}, resumeTheme = 'classic', mode = 'light' }, ref) => {
  const theme = themeStyles[resumeTheme] || themeStyles.classic;
  const backgroundColor = mode === 'light' ? '#ffffff' : '#1e1e1e';
  const textColor = mode === 'light' ? '#000000' : '#ffffff';

  const sectionTitleStyle = {
    color: theme.sectionTitleColor,
    fontSize: theme.sectionHeaderSize,
    fontWeight: 'bold',
    mt: theme.sectionSpacing / 8,
    mb: theme.sectionSpacing / 8,
    fontFamily: theme.fontFamily,
  };

  const contentStyle = {
    fontSize: theme.sectionContentSize,
    color: textColor,
    whiteSpace: 'pre-wrap',
    mb: theme.sectionSpacing / 4,
    fontFamily: theme.fontFamily,
    lineHeight: 1.5,
  };

  return (
    <Box
      ref={ref}
      sx={{
        p: 3,
        backgroundColor,
        color: textColor,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" sx={{ color: theme.headerColor, fontFamily: theme.fontFamily, fontWeight: 'bold', fontSize: '26px', mb: 1 }}>
        {data.name}
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 0.5, fontFamily: theme.fontFamily, fontSize: '18px' }}>
        {data.title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, fontFamily: theme.fontFamily, fontSize: '14px' }}>
        {data.email} | {data.phone}
      </Typography>
      <Divider sx={{ my: 2 }} />

      {data.summary && (
        <>
          <Typography sx={sectionTitleStyle}>Summary</Typography>
          <Typography sx={contentStyle}>{data.summary}</Typography>
        </>
      )}

      {data.skills && (
        <>
          <Typography sx={sectionTitleStyle}>Skills</Typography>
          <Typography sx={contentStyle}>{data.skills}</Typography>
        </>
      )}

      {Array.isArray(data.languages) && data.languages.length > 0 && (
        <>
          <Typography sx={sectionTitleStyle}>Languages</Typography>
          <Stack spacing={1}>
            {data.languages.map((lang, i) => (
              <Typography key={i} sx={contentStyle}>
                - {lang.language}
              </Typography>
            ))}
          </Stack>
        </>
      )}

      {Array.isArray(data.activities) && data.activities.length > 0 && (
        <>
          <Typography sx={sectionTitleStyle}>Activities</Typography>
          <Stack spacing={1}>
            {data.activities.map((act, i) => (
              <Typography key={i} sx={contentStyle}>
                - {act.activity}
              </Typography>
            ))}
          </Stack>
        </>
      )}

      {Array.isArray(data.experience) && data.experience.length > 0 && (
        <>
          <Typography sx={sectionTitleStyle}>Experience</Typography>
          <Stack spacing={1}>
            {data.experience.map((exp, i) => (
              <Box key={i}>
                <Typography sx={{ ...contentStyle, fontWeight: 'bold' }}>{exp.company}</Typography>
                <Typography sx={contentStyle}>
                  {exp.role} ({exp.period})
                </Typography>
                <Typography sx={contentStyle}>{exp.description}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {Array.isArray(data.education) && data.education.length > 0 && (
        <>
          <Typography sx={sectionTitleStyle}>Education</Typography>
          <Stack spacing={1}>
            {data.education.map((edu, i) => (
              <Box key={i}>
                <Typography sx={{ ...contentStyle, fontWeight: 'bold' }}>{edu.institution}</Typography>
                <Typography sx={contentStyle}>{edu.year}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {Array.isArray(data.projects) && data.projects.length > 0 && (
        <>
          <Typography sx={sectionTitleStyle}>Projects</Typography>
          <Stack spacing={1}>
            {data.projects.map((proj, i) => (
              <Box key={i}>
                <Typography sx={{ ...contentStyle, fontWeight: 'bold' }}>{proj.title}</Typography>
                <Typography sx={contentStyle}>{proj.description}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {Array.isArray(data.certifications) && data.certifications.length > 0 && (
        <>
          <Typography sx={sectionTitleStyle}>Certifications</Typography>
          <Stack spacing={1}>
            {data.certifications.map((cert, i) => (
              <Box key={i}>
                <Typography sx={{ ...contentStyle, fontWeight: 'bold' }}>{cert.name}</Typography>
                <Typography sx={contentStyle}>Issued By: {cert.issuer}</Typography>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
});

export default ResumePreview;
