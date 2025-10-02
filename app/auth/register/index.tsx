import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedButton from '@/presentation/theme/components/themed-button';
import ThemedLink from '@/presentation/theme/components/themed-link';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import ThemedTextInput from '@/presentation/theme/components/themed-text-input';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { Alert, KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';

interface RegisterFormInputs{
  fullName: string;
  password: string;
  email: string;
}

const RegisterScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const { handleSubmit, control, formState: {isValid} } = useForm<RegisterFormInputs>();
  const { registerUser } = useAuthStore();
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const onSubmit = async (data: RegisterFormInputs) => {
    console.log('onSubmit data:', data);
    setIsPosting(true);

    const wasSuccessful = await registerUser(data.email, data.password, data.fullName);

    setIsPosting(false);

    if(wasSuccessful) {
      router.replace('/');
      return;
    }

    Alert.alert('Error', 'Hubo un error al registrarse');
  }

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={{flex: 1}}>
        <ScrollView style={{
          paddingHorizontal: 40,
          backgroundColor: backgroundColor
        }}>
          <View style={{
            paddingTop: height * 0.35
          }}>
            <ThemedText type='title'>Crear cuenta</ThemedText>
            <ThemedText style={{color: 'grey'}}>
              Por favor crea una cuenta para continuar
            </ThemedText>
          </View>

          {/* Email y password */}
          <View style={{ marginTop: 20 }}>
            <Controller
              control={control}
              name="fullName"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  placeholder='Nombre completo'
                  autoCapitalize='words'
                  icon="person-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  placeholder='Correo Electrónico'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  icon="mail-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ThemedTextInput
                  placeholder='Contraseña'
                  secureTextEntry
                  autoCapitalize='none'
                  icon="lock-closed-outline"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
          </View>

          {/* spacer */}
          <View style={{ marginTop: 10}}></View>

          {/* Botón */}
          <ThemedButton
            icon="arrow-forward-outline"
            onPress={handleSubmit(onSubmit)}
            disabled={isPosting}
          >
            Crear cuenta
          </ThemedButton>

          {/* spacer */}
          <View style={{ marginTop: 50}}></View>

          {/* Enlace a registro */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ThemedText>¿Ya tienes cuenta?</ThemedText>

            <ThemedLink href="/auth/login" style={{ marginHorizontal: 5}}>
              Ingresar
            </ThemedLink>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen;