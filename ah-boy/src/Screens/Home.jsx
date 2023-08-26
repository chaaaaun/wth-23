import { Button, Circle, Heading, Box, others, Alert, AlertIcon, CloseButton, AlertDescription, AlertTitle, Center, Flex,
        Slider, SliderFilledTrack, SliderThumb, SliderMark, SliderTrack, Skeleton } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import Reply from "../Components/Reply";

export default function Home() {
    const [gptReply, setGptReply] = useState('ChatGPT answers will appear here!');
    const [loading, setLoading] = useState(false)
    const[alert, setAlert] = useState(false)
    const[sliderValue, setSliderValue] = useState(40)
    const [children, setChildren] = useState([

    ])

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
                                    setGptReply(data.data)
                                    setChildren(children => [...children, <Reply content={data.data}/>])
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
            <Center>
                {alert && <Alert status='error' maxW='400px'> 
                    <AlertIcon />
                    <Box flex={1}>
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
            </Center>
            <Box flexDirection='column'>
                <Box flexDirection='column' >
                    <Center>
                        <img src="/src/assets/ahboy_grey.svg" width={350} height={300} />
                    </Center>
                    <Box>
                        <Slider defaultValue={40} min={20} max={60} step={5} onChange={(val) => setSliderValue(val)} w='400px'>
                            <SliderTrack bg='red.100'>
                                <Box position='relative' right={10} />
                                <SliderFilledTrack bg='tomato' />
                            </SliderTrack>
                            <SliderThumb boxSize={6} />
                        </Slider>
                        <Box>
                            Font size
                        </Box>
                    </Box>
                </Box>
                <Heading style={{marginBottom: 16}}>
                    Ask Ah Boy a question!
                </Heading>
                
            </Box>
            <Center>
                <Box maxW='800px' w='100%' borderWidth='1px' borderRadius='lg' overflow='visible' p='100' content="" style={{marginBottom: 16}} boxSizing="70%" fontSize={sliderValue}>
                        ChatGPT replies
                        {children}
                    <Skeleton isLoaded={!loading} height='100px'/>
                </Box>
            </Center>
            
            <Center>
                {mediaRecorder && (
                    <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    width={200}
                    height={75}
                    />
                )}
            </Center>

            {!isRecording && <Button isLoading={loading} size="lg" colorScheme="red" variant="solid" onClick={start}>
                Record
            </Button>}

            {isRecording && <Button size="lg" colorScheme="green" variant="solid" onClick={stop}> 
                Stop
            </Button>}
        </>
    )
}