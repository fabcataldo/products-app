import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

const LogoutIconButton = () => {

    const primaryColor = useThemeColor({}, 'primary');
    const { logout } = useAuthStore();

    return (
        <TouchableOpacity style={{marginRight: 8}} onPress={logout}>
            <Ionicons name="log-out-outline" size={24} color={primaryColor}></Ionicons>
        </TouchableOpacity>
    )
}

export default LogoutIconButton