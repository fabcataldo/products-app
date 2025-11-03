import { useCameraStore } from '@/presentation/store/useCameraStore';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';

export default function CameraScreen() {
  const { addSelectedImage } = useCameraStore();


  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string>();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions({
    writeOnly: true
  });

  const cameraRef = useRef<CameraView>(null);

  const onRequestPermissions = async () => {
    try {
      const { status: cameraPermissionStatus } = await requestCameraPermission();
      if(cameraPermissionStatus !== 'granted') {
        Alert.alert(
          'Lo siento',
          'Necesitamos permiso a la cama para tomar fotos'
        );
        return;
      }

      const { status: mediaPermissionStatus } = await requestMediaPermission();
      if(mediaPermissionStatus !== 'granted') {
        Alert.alert(
          'Lo siento',
          'Necesitamos permiso a la galería para guardar las imágenes'
        );
        return;
      }

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Algo salió mal con los permisos');
    }
  }

  if (!cameraPermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={{
          ...styles.container,
          marginHorizontal: 30,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Text style={styles.message}>
          Necesitamos permiso para usar la cámara y la galería
        </Text>

        <TouchableOpacity
          onPress={onRequestPermissions} 
        >
          <ThemedText type='subtitle'>Solicitar permiso</ThemedText>
        </TouchableOpacity>

      </View>
    );
  }

  const onShutterButtonPress = async () => {
    if(!cameraRef.current) return;

    const picture = await cameraRef.current.takePictureAsync({
      quality: 0.7
    });

    console.log('picture');
    console.log(picture);

    if(!picture?.uri) return;

    setSelectedImage(picture.uri);

    //TODO: guardar imagen
  }

  const onReturnCancel = () => {
    //TODO: limpiar estado
    router.dismiss();
  }

  const onPictureAccepted = async () => {
    
    console.log('on picture accepted')

    if(!selectedImage) return;
    await MediaLibrary.createAssetAsync(selectedImage);

    addSelectedImage(selectedImage);

    router.dismiss();
  }

  const onRetakePhoto = () => {
    setSelectedImage(undefined);
  }

  const onPickImages = async() => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.5,
      aspect: [4, 3], //4 unidades de ancho, y 3 de alto
      // allowsEditing: true, //deshabilitado, ya que si lo habilito, no puedo
      //habilitar el atributo de abajo, y viceversa
      allowsMultipleSelection: true,
      selectionLimit: 10
    });

    if(result.canceled) return;

    console.log(result.assets);

    console.log('anduvooo')

    result.assets.forEach(image => {
      addSelectedImage(image.uri);
    });

    router.dismiss();
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  if(selectedImage){
    return (
      <View style={styles.container}>
        <Image
          source={{uri: selectedImage}}
          style={styles.camera}
        />
        <ConfirmImageButton onPress={onPictureAccepted}/>

        <RetakeImageButton onPress={onRetakePhoto}/>

        <ReturnCancelButton onPress={onReturnCancel}/>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} 
        ref={cameraRef}/>

        <ShutterButton onPress={onShutterButtonPress}/>

        <FlipCameraButton onPress={toggleCameraFacing}/>

        {/* TODO: gallerybutton */}
        <GalleryButton onPress={onPickImages}/>

        <ReturnCancelButton onPress={onReturnCancel}/>


        {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity> */}

    </View>
  );
}

//custom components
const ShutterButton = ({
  onPress = () => {}
}) => {
  const dimensions = useWindowDimensions();
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: primaryColor
        }
      ]}
    >
      
    </TouchableOpacity>
  )
};

const FlipCameraButton = ({
  onPress = () => {}
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.flipCameraButton}
    >
      <Ionicons
        name='camera-reverse-outline'
        size={30}  
        color="white"
      />
    </TouchableOpacity>
  )
}

const GalleryButton = ({
  onPress = () => {}
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.galleryButton}
    >
      <Ionicons
        name='images-outline'
        size={30}  
        color="white"
      />
    </TouchableOpacity>
  )
}


const ReturnCancelButton = ({
  onPress = () => {}
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.returnCancelButton}
    >
      <Ionicons
        name='arrow-back-outline'
        size={30}  
        color="white"
      />
    </TouchableOpacity>
  )
}


const ConfirmImageButton = ({
  onPress = () => {}
}) => {
  const dimensions = useWindowDimensions();
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: primaryColor
        }
      ]}
    >
      <Ionicons name='checkmark-outline' size={30} color={primaryColor}/>
    </TouchableOpacity>
  )
};

const RetakeImageButton = ({
  onPress = () => {}
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.flipCameraButton}
    >
      <Ionicons
        name='close-outline'
        size={30}  
        color="white"
      />
    </TouchableOpacity>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    // borderColor: 'red',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    top: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});