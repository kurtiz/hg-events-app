import * as React from 'react';
import {ActivityIndicator, Alert, Image, TouchableOpacity, View} from 'react-native';
import {Text} from '~/components/ui/text';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Label} from "~/components/ui/label";
import {Input} from "~/components/ui/input";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import {format} from 'date-fns';
import {addDoc, collection, getFirestore} from "firebase/firestore";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {app} from '~/firebase/firebaseConfig';
import {Button} from "~/components/ui/button";
import {showToastable} from "react-native-toastable"; // Adjust based on your firebase config path

export default function CreateEventScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [eventName, setEventName] = React.useState('');
    const [eventRate, setEventRate] = React.useState('');
    const [eventTime, setEventTime] = React.useState<Date>(new Date());
    const [eventDate, setEventDate] = React.useState<Date>(new Date());
    const [eventImage, setEventImage] = React.useState<string | null>(null); // Store image URI

    const [showTimePicker, setShowTimePicker] = React.useState(false);
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const db = getFirestore(app);
    const storage = getStorage(app);

    const handleTimeConfirm = (event: any, selectedDate: Date | undefined) => {
        setShowTimePicker(false); // Hide the picker after selection
        if (selectedDate) {
            setEventTime(selectedDate);
        }
    };

    const handleDateConfirm = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false); // Hide the picker after selection
        if (selectedDate) {
            setEventDate(selectedDate);
        }
    };


    // Function to handle image picking
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access media library is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setEventImage(result.assets[0].uri); // Set the selected image URI
        }
    };

    // Validate inputs before saving to Firebase
    const validateInputs = () => {
        if (!eventName || !eventRate) {
            Alert.alert('Validation Error', 'Event name and rate are required.');
            return false;
        }
        return true;
    };

    // Upload image to Firebase Storage
    const uploadImage = async () => {
        if (!eventImage) return null;

        const response = await fetch(eventImage);
        const blob = await response.blob();

        const storageRef = ref(storage, `eventImages/${Date.now()}_${eventName}.jpg`);
        await uploadBytes(storageRef, blob);

        // Get the image URL after upload
        return await getDownloadURL(storageRef);
    };

    // Save Event to Firestore
    const saveEvent = async () => {
        if (!validateInputs()) return;

        setLoading(true);

        try {
            // Upload image to Firebase Storage and get URL
            const imageUrl = await uploadImage();

            // Save event details to Firestore
            await addDoc(collection(db, "events"), {
                name: eventName,
                rate: eventRate,
                time: format(eventTime, 'hh:mm a'),
                date: format(eventDate, 'yyyy-MM-dd'),
                image: imageUrl || null,
            });

            showToastable({message: "Event created successfully!", status: "success"});
            navigation.goBack();
        } catch (error: any) {
            console.error('Error adding event: ', error?.message);
            Alert.alert('Error', 'Failed to create the event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView>
            <View className="p-4">
                <Text className="text-3xl font-bold">Create Event</Text>
                <Text className="text-muted-foreground">Enter event details here</Text>
                <View className="p-6 bg-secondary/30 max-h-screen">
                    {/* Event Name Input */}
                    <Label nativeID="event_name" className="mb-1">Event Name</Label>
                    <Input
                        placeholder="eg. Pool Party"
                        inputMode="text"
                        value={eventName}
                        onChangeText={(value) => setEventName(value)}
                        className="mb-3"
                    />

                    {/* Event Time Picker */}
                    <Label nativeID="event_time" className="mb-1">Event Time</Label>
                    <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                        <Input
                            placeholder="Select Event Time"
                            value={format(eventTime, 'hh:mm a')} // Display formatted time
                            editable={false} // Disable manual editing
                            className="mb-3"
                        />
                    </TouchableOpacity>

                    {/* Show Time Picker Conditionally */}
                    {showTimePicker && (
                        <RNDateTimePicker
                            mode="time"
                            value={eventTime}
                            onChange={handleTimeConfirm}
                        />
                    )}

                    {/* Event Date Picker */}
                    <Label nativeID="event_date" className="mb-1">Event Date</Label>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <Input
                            placeholder="Select Event Date"
                            value={format(eventDate, 'yyyy-MM-dd')} // Display formatted date
                            editable={false} // Disable manual editing
                            className="mb-3"
                        />
                    </TouchableOpacity>

                    {/* Show Date Picker Conditionally */}
                    {showDatePicker && (
                        <RNDateTimePicker
                            mode="date"
                            value={eventDate}
                            onChange={handleDateConfirm}
                        />
                    )}

                    {/* Event Rate Input */}
                    <Label nativeID="event_rate" className="mb-1">Event Rate (GHc.)</Label>
                    <Input
                        placeholder="eg. 100.00"
                        inputMode="decimal"
                        value={eventRate}
                        onChangeText={(value) => setEventRate(value)}
                        className="mb-3"
                    />

                    {/* Add Image Button */}
                    <Label nativeID="event_image" className="mb-1">Event Image</Label>
                    <Button onPress={pickImage} variant="outline" className="mb-3">
                        <Text className="text-center">Add Image</Text>
                    </Button>

                    {/* Display Image Preview */}
                    {eventImage && (
                        <Image
                            source={{uri: eventImage}}
                            style={{width: '100%', height: 200, borderRadius: 10}}
                            className="mb-3"
                        />
                    )}

                    {/* Save Button */}
                    <Button onPress={saveEvent} disabled={loading} className="mt-4 flex flex-row justify-center">
                        {loading && <ActivityIndicator size="small" color="black"/>}
                        <Text className="text-white text-center">
                            {loading ? 'Saving...' : 'Save Event'}
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    );
}
