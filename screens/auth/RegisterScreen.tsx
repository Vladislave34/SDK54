import {
    View, Text, TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar
} from "react-native";
import {useForm, Controller} from "react-hook-form";
import {ImagePickerButton} from "@/components/form/ImagePickerButton";

import * as ImagePicker from "expo-image-picker"
import IRegisterModel from "@/model/auth/IRegisterModel";
import {authApi} from "@/services/authService";

import {useAppDispatch} from "@/hooks/redux";
import {loginSuccess} from "@/store/reducers/authSlice";
import {router} from "expo-router";

type RegisterFormData = {
    email: string;
    password: string;
};


export default function RegisterScreen() {
    const {control, handleSubmit} = useForm<IRegisterModel>();
    const dispatch = useAppDispatch();
    const [register] = authApi.useRegisterMutation();
    const pickImage = async () => {
        // console.log("Pick image");
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Доступ до галереї потрібен для вибору фото.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });


    }
    const onSubmit = async (data: IRegisterModel) => {
        try{
            const res = await register(data).unwrap();
            console.log(res);
            dispatch(loginSuccess(res.token));
            router.push("/explore");
        } catch(err){
            console.log(err);
        }



    };

    return (

        <View className="flex-1  dark:bg-zinc-950">
            <StatusBar barStyle="default"/>

            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingBottom: 80,
                        flexGrow: 1,
                    }}
                >

                    <View className="items-center  px-6">
                        <Text className="text-3xl font-bold text-blue-600 mb-8">
                            Реєстрація користувача
                        </Text>

                        <View className={"items-center my-8"}>
                            <ImagePickerButton
                                imageUri = {null}
                                onPress = {pickImage}
                            />\
                            <Text className="text-zinc-400 dark:text-zinc-500 mt-2">
                                Натисніть, щоб обрати фото
                            </Text>
                        </View>

                        <Controller control={control}
                                    name="firstName"
                                    rules={{required: "First name обов’язковий"}}
                                    render={({field: {onChange, value}}) => (
                                        <TextInput
                                            placeholder="First name"
                                            keyboardType="default"
                                            value={value}
                                            onChangeText={onChange}
                                            className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-4 border border-gray-300"
                                        />
                                    )}
                        />
                        <Controller control={control}
                                    name="lastName"
                                    rules={{required: "Last name обов’язковий"}}
                                    render={({field: {onChange, value}}) => (
                                        <TextInput
                                            placeholder="Last name"
                                            keyboardType="default"
                                            value={value}
                                            onChangeText={onChange}
                                            className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-4 border border-gray-300"
                                        />
                                    )}
                        />

                        <Controller control={control}
                                    name="email"
                                    rules={{required: "Email обов’язковий"}}
                                    render={({field: {onChange, value}}) => (
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
                                    rules={{required: "Пароль обов’язковий"}}
                                    render={({field: {onChange, value}}) => (
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
                            <Text className="text-white font-semibold">Зареєструватися</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}