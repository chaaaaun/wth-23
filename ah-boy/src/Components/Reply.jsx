import { Box, Button, IconButton, Icon } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'


export default function Reply({ content, audio }) {
    const onPlay = () => {

    }

    return(
        <Box bg='green.200' style={{marginBottom: 16, marginTop: 16}} w='100%' borderRadius='lg' overflow='visible' p='10' 
            flexDirection='column' justifyContent='center' alignItems='center'>
            <div>
                {content}
            </div>
            <Button colorScheme="teal" borderRadius='lg' onClick={onPlay} size='lg' style={{marginTop: 16}}>
                <FontAwesomeIcon icon={faPlay} />
            </Button>
        </Box>
    )
}