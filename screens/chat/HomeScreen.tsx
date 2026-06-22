import {View, Text, StatusBar, TouchableOpacity, Image, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {useState} from "react";
import * as ImagePicker from "expo-image-picker";

import {useAppDispatch, useAppSelector} from "@/hooks/redux";
import {BASE_URL} from "@/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loginSuccess, logout} from "@/store/reducers/authSlice";
import IEditProfile from "@/model/auth/IEditProfile";
import {authApi} from "@/services/authService";


export default function HomeScreen() {
    const {data : user} = authApi.useGetUserQuery();
    const dispatch = useAppDispatch();

    const [editUser, {isLoading: isSaving}] = authApi.useEditUserMutation();

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [editImage, setEditImage] = useState<{ uri: string; name: string; type: string } | null>(null);

    const onLogout = () => {
        router.replace("/");
    };

    const openEditModal = () => {
        setFirstName(user?.fullName.split(" ")[0] ?? "");
        setLastName(user?.fullName.split(" ")[1] ?? "");
        setEmail(user?.email ?? "");
        setEditImage(null);
        setIsEditModalVisible(true);
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            console.log("Дозвіл на доступ до галереї не надано");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setEditImage({
                uri: asset.uri,
                name: asset.fileName ?? "profile.jpg",
                type: asset.mimeType ?? "image/jpeg",
            });
        }
    };

    const onSaveProfile = async () => {
        if (!user?.email) return;

        const model: IEditProfile = {
            email,
            firstName,
            lastName,
            imageFile: editImage
        };

        try {
            const res = await editUser(model).unwrap();
            dispatch(loginSuccess(res.token));
            await AsyncStorage.setItem('token', res.token);
            setIsEditModalVisible(false);
        } catch (error) {
            console.error("Помилка оновлення профілю:", error);
        }
    };
    console.log("homescreen");

    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default"/>

            <LinearGradient
                colors={["rgba(16,185,129,0.35)", "transparent"]}
                className="absolute w-full h-[380px] rounded-full blur-[120px]"
            />

            <SafeAreaView className="flex-1 px-8 justify-between">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{paddingBottom: 10}}
                >
                    <View className="items-center mt-10 py-16">
                        <View className="bg-emerald-500/10 px-4 py-1 rounded-full mb-4 border border-emerald-500/20">
                            <Text className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-[3px] uppercase">
                                чат система
                            </Text>
                        </View>

                        <Text className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter text-center">
                            Привіт,{" "}
                            <Text className="text-emerald-500">
                                {user?.fullName.split(" ")[0] ?? user?.email ?? "Гість"}
                            </Text>
                        </Text>

                        <View className="h-[2px] w-12 bg-emerald-500 my-6 rounded-full"/>

                        <Text className="text-zinc-500 dark:text-zinc-400 text-center text-lg leading-7 font-medium px-4">
                            Обери, що хочеш зробити далі
                        </Text>
                    </View>

                    <View className="items-center my-10">
                        <View className="relative">
                            <View className="w-44 h-44 rounded-full bg-emerald-500/10 items-center justify-center overflow-hidden">
                                {user?.image && `${BASE_URL.baseUrl}/images/` ? (
                                    <Image
                                        source={{uri: `${BASE_URL.baseUrl}/images/400_${user.image}`}}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-7xl">👤</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={openEditModal}
                                className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-emerald-500 items-center justify-center shadow-lg"
                            >
                                <Text className="text-xl">✏️</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="gap-y-5">
                        <View className="relative">
                            <View className="absolute top-1 left-0 right-0 bottom-[-4] bg-emerald-700 rounded-2xl"/>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => router.replace('/chat/create')}
                                className="bg-emerald-500 py-4 rounded-2xl items-center"
                            >
                                <Text className="text-white text-xl font-bold tracking-tight">
                                    Створити новий чат
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => router.replace('/chat/join')}
                            className="border border-zinc-300 dark:border-zinc-700 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-zinc-900 dark:text-zinc-100 text-lg font-semibold">
                                Підключитися до чату
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={async () => {
                                await AsyncStorage.removeItem("token");
                                dispatch(logout());
                                router.replace("/(auth)/login");
                            }}
                            className="bg-red-500/10 border border-red-500/20 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-red-500 text-xl font-bold tracking-tight">
                                Вийти з аккаунту
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                        <View className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-6 pb-10">
                            <View className="w-12 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded-full self-center mb-6"/>

                            <Text className="text-2xl font-black text-zinc-900 dark:text-white mb-6">
                                Редагувати профіль
                            </Text>

                            <View className="items-center mb-6">
                                <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                                    <View className="w-28 h-28 rounded-full bg-emerald-500/10 items-center justify-center overflow-hidden">
                                        {editImage ? (
                                            <Image source={{uri: editImage.uri}} className="w-full h-full" resizeMode="cover"/>
                                        ) : user?.image ? (
                                            <Image
                                                source={{uri: `${BASE_URL.baseUrl}/images/400_${user.image}`}}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <Text className="text-5xl">👤</Text>
                                        )}
                                    </View>
                                    <Text className="text-emerald-500 text-center text-sm font-semibold mt-2">
                                        Змінити фото
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-2">
                                Ім&apos;я
                            </Text>
                            <TextInput
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholder="Ім'я"
                                className="border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white mb-4"
                            />

                            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-2">
                                Прізвище
                            </Text>
                            <TextInput
                                value={lastName}
                                onChangeText={setLastName}
                                placeholder="Прізвище"
                                className="border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white mb-6"
                            />
                            <Text className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-2">
                                Email
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder="Email"
                                className="border border-zinc-300 dark:border-zinc-700 rounded-2xl px-4 py-3 text-zinc-900 dark:text-white mb-6"
                            />

                            <View className="gap-y-3">
                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={onSaveProfile}
                                    disabled={isSaving}
                                    className="bg-emerald-500 py-4 rounded-2xl items-center"
                                >
                                    <Text className="text-white text-lg font-bold">
                                        {isSaving ? "Збереження..." : "Зберегти"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.85}
                                    onPress={() => setIsEditModalVisible(false)}
                                    className="py-4 rounded-2xl items-center"
                                >
                                    <Text className="text-zinc-500 dark:text-zinc-400 text-base font-semibold">
                                        Скасувати
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
}