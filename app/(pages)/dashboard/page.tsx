'use client';

import InputFile from "@/components/forms/inputs/InputFile";
import Form from "@/components/forms/Form";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [audioFiles, setAudioFiles] = useState<{ name: string, data: string }[]>([]);

  useEffect(() => {
    const files = JSON.parse(localStorage.getItem('audio_files') || '[]');
    setAudioFiles(files);
  }, []);

  const handleSubmit = (data: any) => {
    const file = data.audio;
    if (file && file.name) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = e.target?.result as string;
        const files = JSON.parse(localStorage.getItem('audio_files') || '[]');
        files.push({ name: file.name, data: base64 });
        localStorage.setItem('audio_files', JSON.stringify(files));
        setAudioFiles(files);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <InputFile name="audio" accept='/audio/*'/>
        <button type="submit">Submit</button>
      </Form>
      <ul>
        {audioFiles.map((file, id) => (
          <li key={id}>
            {file.name}
            <audio controls src={file.data} />
          </li>
        ))}
      </ul>
    </>
  );
}
