import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Center,
    CloseButton,
    Heading,
    Skeleton,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useAudioRecorder} from 'react-audio-voice-recorder';
import {LiveAudioVisualizer} from 'react-audio-visualize';
import Reply from "../Components/Reply";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMicrophone, faSquare} from '@fortawesome/free-solid-svg-icons'

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
        setLoading(true)
        await fetch('http://localhost:5000/api', {
                                    method: 'post',
                                    body: data,
                                }).then(response => response.json()).then(data => {
                                    console.log(data)
                                    setGptReply(data['ans'])
                                    setChildren(children => [<Reply content={data} />, ...children])
                                })
                                .catch(e => setAlert(true))
                                .finally(() => setLoading(false))
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
        <Box flex={1} justifyContent="center" width='100%' h='100%' minHeight='100vh'>
            <Center flex={1}>
                {alert && <Alert status='error' maxW='500px'> 
                    <AlertIcon />
                    <Box flex={1} fontFamily="Microsoft Yahei" fontSize='24'>
                        <AlertTitle>错误警告！</AlertTitle>
                        <AlertDescription>
                        对不起，出现了状况。请再重试！
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
            <Box flexDirection='column' flex={1}>
                <Box flexDirection='column' >
                    <Center>
                        <img src="/src/assets/ahboy_grey.svg" width={250} height={200} />
                    </Center>
                    <Box>
                        <Slider defaultValue={40} min={20} max={60} step={5} onChange={(val) => setSliderValue(val)} w='80%'>
                            <SliderTrack bg='red.100'>
                                <Box position='relative' right={10} />
                                <SliderFilledTrack bg='tomato' />
                            </SliderTrack>
                            <SliderThumb boxSize={6} bgColor='tomato'>
                            </SliderThumb>

                        </Slider>
                        <Box fontSize='24' fontFamily="Microsoft Yahei">
                            字体大小
                        </Box>
                    </Box>
                </Box>
                <Heading style={{marginBottom: 16}} fontWeight='bold' fontFamily="Microsoft Yahei">
                    问 ah boy!
                </Heading>
                
            </Box>
            {!isRecording && <Button isLoading={loading} p={10} colorScheme="red" variant="solid" onClick={start}>
                <FontAwesomeIcon icon={faMicrophone} size='2xl' />
            </Button>}

            {isRecording && <Button p={10} colorScheme="green" variant="solid" onClick={stop}>
                <FontAwesomeIcon icon={faSquare} size='2xl' />
            </Button>}
            <Center>
                {mediaRecorder && (
                    <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    width={200}
                    height={75}
                    />
                )}
            </Center>
            <Center>
                <Box maxW='800px' w='100%' borderWidth='1px' borderRadius='lg' overflow='visible' p='30' content="" 
                    style={{marginBottom: 16, marginTop: 16}} boxSizing="70%" fontSize={sliderValue} 
                    fontFamily="Microsoft Yahei">
                        回答
                        {loading && <Skeleton isLoaded={!loading} height='100px'/>}
                        {children}  
                </Box>
            </Center>
            
        </Box>)
}