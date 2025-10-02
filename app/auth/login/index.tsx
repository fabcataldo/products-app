import { useAuthStore } from '@/presentation/auth/store/useAuthStore';
import ThemedButton from '@/presentation/theme/components/themed-button';
import ThemedLink from '@/presentation/theme/components/themed-link';
import { ThemedText } from '@/presentation/theme/components/themed-text';
import ThemedTextInput from '@/presentation/theme/components/themed-text-input';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, useWindowDimensions, View } from 'react-native';


const LoginScreen = () => {
  const { height } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');

  const [isPosting, setIsPosting] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const { login } = useAuthStore();

  const {email, password} = form;

  const onLogin = async() => {
    if(form.email.length === 0 || form.password.length === 0) {
      return;
    }

    setIsPosting(true);

    const wasSuccessful = await login(email, password);

    setIsPosting(false);

    if(wasSuccessful) {
      router.replace('/');
      return;
    }

    Alert.alert('Error', 'Usuario o contraseña no son correctos');
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
            <ThemedText type='title'>Ingresar</ThemedText>
            <ThemedText style={{color: 'grey'}}>
              Por favor, ingrese para continuar
            </ThemedText>
          </View>

          {/* Email y password */}
          <View style={{ marginTop: 20 }}>
            <ThemedTextInput
              placeholder='Correo Electrónico'
              keyboardType='email-address'
              autoCapitalize='none'
              icon="mail-outline"

              value={ form.email }
              onChangeText={(value) => setForm({...form, email: value})}
            />

            <ThemedTextInput
              placeholder='Contraseña'
              secureTextEntry
              autoCapitalize='none'
              icon="lock-closed-outline"
              value={ form.password }
              onChangeText={(value) => setForm({...form, password: value})}
            />
          </View>

          {/* spacer */}
          <View style={{ marginTop: 10}}></View>

          {/* Botón */}
          <ThemedButton icon="arrow-forward-outline" onPress={onLogin} disabled={isPosting}>
            Ingresar
          </ThemedButton>

          {/* spacer */}
          <View style={{ marginTop: 50}}></View>

          {/* Enlace a registro */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <ThemedText>¿No tienes cuenta?</ThemedText>

            <ThemedLink href="/auth/register" style={{ marginHorizontal: 5}}>
              Crear cuenta
            </ThemedLink>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen;