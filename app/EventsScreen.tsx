import {useCallback, useState} from 'react';
import {FlatList, Image, TouchableOpacity, View} from 'react-native';
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {Text} from "~/components/ui/text";
import {SafeAreaView} from "react-native-safe-area-context";
import {Button} from "~/components/ui/button";
import {Skeleton} from "~/components/ui/skeleton";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {app} from '~/firebase/firebaseConfig';
import {Card, CardContent} from "~/components/ui/card";

export default function EventsScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        const db = getFirestore(app);
        const eventsCollection = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setEvents(eventList);
        setLoading(false);
    };

    // Refetch the events every time the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchEvents();
        }, [])
    );

    const renderSkeleton = () => (
        <View className="w-full max-w-sm p-6 rounded-2xl">
            <Skeleton className='h-[250px] w-full rounded-2xl mb-2'/>
        </View>
    );

    const renderEventCard = ({item}: { item: any }) => {
        const {name, image = null, date = 'TBD', time = 'TBD', rate = 'TBD'} = item;
        return (
            <TouchableOpacity activeOpacity={0.7}>
                <Card className="w-full max-w-sm pt-2.5 rounded-2xl shadow mb-4">
                    <Text className="pb-2 text-center font-bold text-xl">{name}</Text>
                    <CardContent>
                        {image ? (
                            <Image source={{uri: image}} className="h-40 w-full rounded-2xl mb-4"/>
                        ) : (
                            <View className="h-40 w-full bg-gray-300 rounded-2xl mb-4 items-center justify-center">
                                <Text className="text-center">No Image Available</Text>
                            </View>
                        )}
                        <View className="flex flex-row gap-x-2 justify-center">
                            <Text className="text-gray-600">Date: {date}</Text>
                            <Text className="text-gray-600">Time: {time}</Text>
                            <Text className="text-gray-600">Rate: GHc. {rate}</Text>
                        </View>
                    </CardContent>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView className="flex-1 px-4 pt-4">
            <View className="p-4">
                <View className="flex flex-row justify-between">
                    <Text className="text-3xl font-bold">Events</Text>
                    <Button
                        className="w-28"
                        onPress={() => navigation.navigate('CreateEventScreen')}>
                        <Text>Create</Text>
                    </Button>
                </View>
                <Text className="text-muted-foreground">All events are listed here</Text>

                {/* Skeleton or Event List */}
                <View className="py-2 max-h-screen">
                    {loading ? (
                        // Show skeleton while loading
                        <FlatList
                            data={[1, 2, 3, 4]}
                            renderItem={renderSkeleton}
                            keyExtractor={(item) => String(item)}
                            contentContainerStyle={{paddingBottom: 100}}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : events.length === 0 ? (
                        // Show no event image when no data
                        <View className="flex h-full justify-center items-center">
                            <Image
                                source={require('~/assets/images/no-events.jpg')}
                                className="w-full h-64"
                            />
                            <Text className="text-center text-gray-500 mt-4">No events available</Text>
                        </View>
                    ) : (
                        // Render event cards when data is available
                        <FlatList
                            data={events}
                            renderItem={renderEventCard}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{paddingBottom: 100}}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

/*

<Card className="w-full max-w-sm p-6 rounded-2xl">
                        <CardHeader className="items-center">
                            <CardTitle className="pb-2 text-center">Sign Up</CardTitle>
                        </CardHeader>
                        <CardContent>

                        </CardContent>
                        <CardFooter className="flex-col gap-3 pb-0">

                        </CardFooter>
                    </Card>
**/