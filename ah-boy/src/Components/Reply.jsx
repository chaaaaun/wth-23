import {Box, Button, IconButton, Icon, Text} from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faVolumeHigh, faBullhorn } from '@fortawesome/free-solid-svg-icons'


export default function Reply({ content }) {
    const onPlay = () => {

    }
    const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    // if (content['data']) {
    //     const blob = b64toBlob(content['data']['blob'], content['data']['content-type']);
    //     const blobUrl = URL.createObjectURL(blob);
    //     const audio = document.createElement("audio");
    //     audio.src = blobUrl;
    //     audio.controls = true;
    // }

    return(
        <Box bg='green.200' style={{marginBottom: 16, marginTop: 16}} w='100%' borderRadius='lg' overflow='visible' p='10' 
            flexDirection='column' justifyContent='center' alignItems='center'>
            <Text>
                {content['ans']}
            </Text>
            <Button colorScheme="teal" borderRadius='lg' onClick={onPlay} size='lg' style={{marginTop: 16}} p={10}>
                <FontAwesomeIcon icon={faVolumeHigh} size="2xl"/>
            </Button>
        </Box>
    )
}