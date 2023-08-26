import { Button, Circle, Heading, Box, others } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { LiveAudioVisualizer } from 'react-audio-visualize';

export default function Home() {
    const [gptReply, setGptReply] = useState('ChatGPT answer');

    // Mic recorder
    const addAudioElement = async (blob) => {
        const data = new FormData();
        data.append('file', blob);
        const output = await fetch('http://localhost:5000/api', {
                                    method: 'post',
                                    body: data,
                                }).then(response => {
                                    var reply = response.json()
                                    console.log(reply)
                                    return reply;
                                }).then(data => {
                                    console.log(data)
                                    setGptReply(data.data.text)
                                    // const url = URL.createObjectURL(data.data.audio.data);
                                    // const audio = document.createElement("audio");
                                    // audio.src = url;
                                    // audio.controls = true;
                                    // document.body.appendChild(audio);
                                })
                                    


                                
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

            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='6' content="">
                {gptReply}
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