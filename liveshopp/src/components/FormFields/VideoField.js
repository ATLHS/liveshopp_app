import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFileVideo} from '@fortawesome/free-solid-svg-icons';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import Toast from 'react-native-toast-message';
import colors from '../../styles/colors';

const TextArea = ({field}) => {
    let player = useRef(null);
    const [videoUri, setVideoUri] = useState(null);

    const setAuctionVideoItem = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'video',
                durationLimit: 60,
                maxWidth: 1920,
                maxHeight: 1080,
                formatAsMp4: true,
            });

            handleImageLibraryResponse(result);
        } catch (error) {
            console.error(
                'An error occurred while selecting a video:',
                error.message,
            );
        }
    };

    const handleImageLibraryResponse = result => {
        const {didCancel, errorMessage, assets} = result;

        if (didCancel) {
            handleCancel();
        } else if (errorMessage) {
            handleError(errorMessage);
        } else if (assets[0].duration > 40) {
            handleSelectedVideoExceedDurationLimit();
        } else {
            handleSuccess(assets[0]);
        }
    };

    const handleCancel = () => {
        console.log('The user cancelled the process of selecting a video');
    };

    const handleError = errorMessage => {
        console.error(
            'An error occurred while selecting a video:',
            errorMessage,
        );
    };

    const handleSelectedVideoExceedDurationLimit = () => {
        Toast.show({
            type: 'error',
            text1: 'La durée maximale pour une vidéo enchères doit être de 40 secondes maximum.',
        });
        console.error('The user exceeded the duration limit of the video');
    };

    const handleSuccess = selectedVideo => {
        field.onChange(selectedVideo);
        setVideoUri(selectedVideo);
    };

    return (
        <View>
            <TouchableOpacity
                onPress={setAuctionVideoItem}
                style={styles.container}>
                <>
                    {videoUri && videoUri.uri ? (
                        <Video
                            source={{uri: videoUri.uri}}
                            ref={ref => {
                                player = ref;
                            }}
                            muted={true}
                            onLoad={() => {
                                if (videoUri) {
                                    field.onChange(videoUri);
                                }
                            }}
                            style={styles.backgroundVideo}
                            fullscreen={true}
                            repeat={true}
                            audioOnly={true}
                            resizeMode={'cover'}
                            playInBackground={true}
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <FontAwesomeIcon
                                icon={faFileVideo}
                                color={colors.LIGHT}
                                size={40}
                                style={styles.icon}
                            />
                            <Text style={styles.text}>
                                Sélectionner un fichier vidéo
                            </Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={setAuctionVideoItem}>
                                <Text style={styles.buttonText}>
                                    Sélectionner
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.tip}>
                                👋 Astuces : Optimisez vos chances de réussite
                                en respectant le format des reels/stories. Des
                                vidéos claires et attrayantes attirent plus
                                d'enchérisseurs.
                            </Text>
                        </View>
                    )}
                </>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#cecece',
        height: 600,
        marginBottom: 10,
        position: 'relative',
        borderRadius: 6,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 6,
    },
    placeholder: {
        backgroundColor: 'black',
        alignItems: 'center',
        height: '100%',
        borderRadius: 6,
        borderStyle: 'dashed',
        borderColor: colors.LIGHT,
        borderWidth: 2,
    },
    icon: {
        marginTop: 150,
    },
    text: {
        marginTop: 20,
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        color: colors.LIGHT,
    },
    button: {
        marginTop: 20,
        height: 40,
        backgroundColor: colors.LIGHT,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: colors.DARK,
        paddingRight: 20,
        paddingLeft: 20,
    },
    tip: {
        marginTop: 10,
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: colors.LIGHT,
        width: 250,
        textAlign: 'center',
    },
});

export default TextArea;
