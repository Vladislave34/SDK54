import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {useRouter} from "expo-router";
import {authApi} from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loginSuccess} from "@/store/reducers/authSlice";

import {useAppDispatch} from "@/hooks/redux";

type LoginFormData = {
    email: string;
    password: string;
};

export default function LoginScreen() {
    const { control, handleSubmit } = useForm<LoginFormData>();
    const [login] = authApi.useLoginMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const onSubmit = async (data: LoginFormData) => {
        const res = await login(data).unwrap();
        console.log(res);
        dispatch(loginSuccess(res.token));
        await AsyncStorage.setItem('token', res.token);
        router.push("/chat/home");
    };
    const onHandleToLogger = () => {
        router.push("/logger");
    }

    return (
        <View className="flex-1 justify-center items-center  px-6">
            <Text className="text-3xl font-bold text-blue-600 mb-8">
                Увійти в акаунт
            </Text>

            <Controller control={control}
                        name="email"
                        rules={{ required: "Email обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Email"
                                keyboardType="email-address"
                                value={value}
                                onChangeText={onChange}
                                className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-4 border border-gray-300"
                            />
                        )}
            />

            <Controller control={control}
                        name="password"
                        rules={{ required: "Пароль обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput placeholder="Пароль"
                                       secureTextEntry
                                       value={value}
                                       onChangeText={onChange}
                                       className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-6 border border-gray-300"
                            />
                        )}
            />

            <Pressable onPress={handleSubmit(onSubmit)}
                       className="w-full max-w-md bg-blue-500 rounded-lg py-3 items-center"
            >
                <Text className="text-white font-semibold">Увійти</Text>
            </Pressable>

            <Pressable onPress={onHandleToLogger}
                       className="w-full mt-4 max-w-md bg-blue-500 rounded-lg py-3 items-center"
            >
                <Text className="text-white font-semibold">Логер</Text>
            </Pressable>
        </View>
    );
}