import { Button, Circle, Heading, Box, others, Alert, AlertIcon, CloseButton, AlertDescription, AlertTitle } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { LiveAudioVisualizer } from 'react-audio-visualize';

export default function Home() {
    const [gptReply, setGptReply] = useState('ChatGPT answer');
    const [loading, setLoading] = useState(false)
    const[alert, setAlert] = useState(false)

    // Mic recorder
    const addAudioElement = async (blob) => {
        const data = new FormData();
        data.append('file', blob);
        setLoading(!loading)
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
                                    setLoading(false);
                                }).catch(e => {
                                    setLoading(false);
                                    setAlert(true);
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

    const onClose = () => {
        setAlert(false);
    }

    return (
        <>
            {alert && <Alert status='error'>
                <AlertIcon />
                <Box>
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>
                    Something went wrong! Please try again
                    </AlertDescription>
                </Box>
                <CloseButton
                    alignSelf='flex-start'
                    position='relative'
                    right={-1}
                    top={-1}
                    onClick={onClose}
                />
            </Alert>}
            <div>
                <img src="/src/assets/ahboy_grey.svg" width={350} height={300} />
                <Heading style={{marginBottom: 16}}>
                    Ask Ah Boy a question!
                </Heading>
            </div>

            <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' p='6' content="" style={{marginBottom: 16}}>
                {gptReply}
            </Box>

            {mediaRecorder && (
                <LiveAudioVisualizer
                mediaRecorder={mediaRecorder}
                width={200}
                height={75}
                />
            )}

            {!isRecording && <Button isLoading={loading} size="lg" colorScheme="red" variant="solid" onClick={start}>
                Record
            </Button>}

            {isRecording && <Button size="lg" colorScheme="green" variant="solid" onClick={stop}> 
                Stop
            </Button>}
        </>
    )
}