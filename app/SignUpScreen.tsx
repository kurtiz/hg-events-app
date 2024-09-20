import * as React from 'react';
import {useEffect} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {Button} from '~/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '~/components/ui/card';
import {Text} from '~/components/ui/text';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {Eye, EyeOff} from 'lucide-react-native';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import {app} from '~/firebase/firebaseConfig';
import {doc, getFirestore, setDoc} from 'firebase/firestore';
import Animated, {FadeInUp, FadeOutDown, LayoutAnimationConfig} from 'react-native-reanimated';
import {showToastable} from 'react-native-toastable';
import {parseFirebaseError} from "~/lib/parseFirebaseError";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export default function SignUpScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [emailValue, setEmailValue] = React.useState('');
    const [nameValue, setNameValue] = React.useState('');
    const [passwordValue, setPasswordValue] = React.useState('');
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const auth = getAuth(app);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            navigation.navigate('EventsScreen');
        }
    }, [auth, navigation]);

    const handleSignUp = async () => {
        try {
            setIsLoading(true);

            const db = getFirestore(app);
            const userCredential = await createUserWithEmailAndPassword(auth, emailValue, passwordValue);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: nameValue,
                email: emailValue,
                uid: user.uid,
            });

            // Clear the form fields after success
            setEmailValue('');
            setNameValue('');
            setPasswordValue('');

            showToastable({
                message: "Sign up successful!",
                duration: 3000,
                status: 'success',
                position: 'top'
            });

            navigation.navigate('index');
        } catch (error: any) {
            setErrorMessage(parseFirebaseError(error?.message));

            showToastable({
                message: parseFirebaseError(error?.message),
                duration: 3000,
                status: 'danger',
                position: 'top'
            });

            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
            console.error('Error creating user:', error?.message.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center gap-5 p-6 bg-secondary/30">
            <Card className="w-full max-w-sm p-6 rounded-2xl">
                <CardHeader className="items-center">
                    <CardTitle className="pb-2 text-center">Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label nativeID="name">Name</Label>
                    <Input
                        placeholder="Name"
                        value={nameValue}
                        onChangeText={(value) => setNameValue(value)}
                        className="mb-3"
                    />

                    <Label nativeID="email">Email</Label>
                    <Input
                        placeholder="Email"
                        inputMode="email"
                        value={emailValue}
                        onChangeText={(value) => setEmailValue(value)}
                        className="mb-3"
                    />

                    <Label nativeID="password">Password</Label>
                    <View className="flex flex-row justify-between gap-x-3">
                        <Input
                            placeholder="Password"
                            value={passwordValue}
                            secureTextEntry={isPasswordVisible}
                            onChangeText={(value) => setPasswordValue(value)}
                            className="mb-3 flex-1"
                        />
                        <Button
                            variant="outline"
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        >
                            {isPasswordVisible ? <Eye size={15} color="black"/> : <EyeOff size={15} color="black"/>}
                        </Button>
                    </View>
                    {errorMessage && <Text className="text-red-500 mt-3">{errorMessage}</Text>}
                </CardContent>
                <CardFooter className="flex-col gap-3 pb-0">
                    <LayoutAnimationConfig skipEntering>
                        <Animated.View
                            entering={FadeInUp}
                            exiting={FadeOutDown}
                            className="w-full flex items-center justify-center"
                        >
                            <Button
                                variant="outline"
                                className="shadow shadow-foreground/5 flex flex-row"
                                disabled={isLoading}
                                onPress={handleSignUp}
                            >
                                {isLoading ? (
                                    <>
                                        <ActivityIndicator size="small" color="black"/>
                                        <Text className="ml-2">Signing Up</Text>
                                    </>
                                ) : (
                                    <Text>Sign Up</Text>
                                )}
                            </Button>
                        </Animated.View>
                    </LayoutAnimationConfig>
                    <TouchableOpacity
                        className="w-full flex items-center justify-center mt-2"
                        onPress={() => navigation.navigate('index')}>
                        <Text className="text-blue-700 underline underline-offset-1">Login</Text>
                    </TouchableOpacity>
                </CardFooter>
            </Card>
        </View>
    );
}
