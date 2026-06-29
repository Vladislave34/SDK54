// screens/ResetPasswordScreen.tsx
import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {authApi} from "@/services/authService";
import IResetPasswordModel from "@/model/auth/IResetPasswordModel";


const schema = yup.object({
    email: yup
        .string()
        .email('Некоректний email')
        .required('Email обовʼязковий'),
    code: yup
        .string()
        .length(6, 'Код має бути 6 символів')
        .required('Код обовʼязковий'),
    newPassword: yup
        .string()
        .min(8, 'Мінімум 8 символів')
        .required('Пароль обовʼязковий'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Паролі не збігаються')
        .required('Підтвердіть пароль'),
})

type FormValues = IResetPasswordModel & { confirmPassword: string }

export default function ResetPasswordScreen({ navigation }: any) {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [resetPassword, { isLoading }] = authApi.useResetPasswordMutation()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            code: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (data: FormValues) => {
        const { confirmPassword, ...model } = data
        try {
            await resetPassword(model).unwrap()
            Alert.alert('Готово', 'Пароль успішно змінено')
            navigation.goBack()
        } catch (e: any) {
            Alert.alert('Помилка', e?.data?.message ?? 'Спробуйте ще раз')
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>‹ Назад</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Новий пароль</Text>
                <Text style={styles.subtitle}>
                    Введіть email, код підтвердження та новий пароль.
                </Text>

                {/* Email */}
                <Text style={styles.label}>EMAIL</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.email && styles.inputError]}
                            placeholder="your@email.com"
                            placeholderTextColor="#c7c7cc"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                {/* Code */}
                <Text style={styles.label}>КОД ПІДТВЕРДЖЕННЯ</Text>
                <Controller
                    control={control}
                    name="code"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[styles.input, errors.code && styles.inputError]}
                            placeholder="6-значний код"
                            placeholderTextColor="#c7c7cc"
                            keyboardType="number-pad"
                            maxLength={6}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.code && <Text style={styles.error}>{errors.code.message}</Text>}

                {/* New password */}
                <Text style={styles.label}>НОВИЙ ПАРОЛЬ</Text>
                <Controller
                    control={control}
                    name="newPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={[styles.passwordRow, errors.newPassword && styles.inputError]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Мін. 8 символів"
                                placeholderTextColor="#c7c7cc"
                                secureTextEntry={!showPassword}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {errors.newPassword && <Text style={styles.error}>{errors.newPassword.message}</Text>}

                {/* Confirm password */}
                <Text style={styles.label}>ПІДТВЕРДІТЬ ПАРОЛЬ</Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <View style={[styles.passwordRow, errors.confirmPassword && styles.inputError]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Повторіть пароль"
                                placeholderTextColor="#c7c7cc"
                                secureTextEntry={!showConfirm}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                            <TouchableOpacity onPress={() => setShowConfirm(v => !v)}>
                                <Text style={styles.eyeIcon}>{showConfirm ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {errors.confirmPassword && (
                    <Text style={styles.error}>{errors.confirmPassword.message}</Text>
                )}

                <TouchableOpacity
                    style={[styles.submitBtn, isLoading && styles.submitDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.submitText}>Змінити пароль</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.resendText}>
                    Не отримали листа?{' '}
                    <Text style={styles.resendLink} onPress={() => {}}>
                        Надіслати повторно
                    </Text>
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#f2f2f7' },
    container: { padding: 24, paddingTop: 60 },
    backBtn: { marginBottom: 28 },
    backText: { fontSize: 17, color: '#007AFF' },
    title: { fontSize: 34, fontWeight: '700', color: '#1c1c1e', marginBottom: 8 },
    subtitle: { fontSize: 15, color: '#8e8e93', lineHeight: 22, marginBottom: 32 },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#8e8e93',
        letterSpacing: 0.5,
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        fontSize: 17,
        color: '#1c1c1e',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: { borderColor: '#ff3b30' },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    passwordInput: { flex: 1, paddingVertical: 14, fontSize: 17, color: '#1c1c1e' },
    eyeIcon: { fontSize: 18, paddingLeft: 8 },
    error: { fontSize: 13, color: '#ff3b30', marginTop: 4 },
    submitBtn: {
        backgroundColor: '#007AFF',
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 20,
    },
    submitDisabled: { opacity: 0.6 },
    submitText: { fontSize: 17, fontWeight: '600', color: '#fff' },
    resendText: { fontSize: 14, color: '#8e8e93', textAlign: 'center' },
    resendLink: { color: '#007AFF' },
})