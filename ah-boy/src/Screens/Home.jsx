import { Button, Circle, Heading, Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { LiveAudioVisualizer } from 'react-audio-visualize';

export default function Home() {
    // Mic recorder
    const addAudioElement = (blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        document.body.appendChild(audio);
      };
    
    const {
        startRecording,
        stopRecording,
        togglePauseResume,
        recordingBlob,
        isRecording,
        isPaused,
        recordingTime,
        mediaRecorder
    } = useAudioRecorder();

    useEffect(() => {
        if (!recordingBlob) return;
    
        addAudioElement(recordingBlob);
      }, [recordingBlob])
    
    const start = () => {
        startRecording();
    }

    const stop = () => {
        stopRecording();
      };

    return (
        <>
            <div>
                <Heading>
                    Ask us a question!
                </Heading>
            </div>

            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='6' >
                Chatgpt answer
            </Box>

            {mediaRecorder && (
                <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={200}
                height={75}
                />
            )}

            {!isRecording && <Button size="lg" colorScheme="red" variant="solid" onClick={start}>
                Record
            </Button>}

            {isRecording && <Button size="lg" colorScheme="green" variant="solid" onClick={stop}> 
                Stop
            </Button>}
        </>
    )
}