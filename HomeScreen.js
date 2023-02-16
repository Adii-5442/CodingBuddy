import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Animated, Easing, Image, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
const HomeScreen = () => {
    const [Contests, setContests] = useState([]);
    const [triggerChange, setTriggerChange] = useState('')
    const [elapsedTime, setElapsedTime] = useState(0);
    const [finalContestsList, setfinalContestsList] = useState([])
    const [isLoader, setisLoader] = useState(false)
    const API_URL = 'https://codeforces.com/api/contest.list';

    const getUpcomingContests = async () => {
        setisLoader(true)
        try {

            const response = await axios.get(API_URL, {
            params: {
                apiKey: '',
                gym: false, // only get non-gym contests
                phase: 'BEFORE', // only get contests that haven't started yet
            },
            });

            const contests = response.data.result;
            const upcomingContests = contests.filter((contest) => contest.phase === 'BEFORE');
            setisLoader(false)
            return upcomingContests;
            } catch (error) {
                console.error(error);
                setisLoader(false)
            return [];
            }
        };

    useEffect(() => {
        getUpcomingContests().then((upcomingContests) => {
            setContests(upcomingContests);
        });
    }, []);
    useEffect(() => {
        const sortedContests = Contests.sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
        setfinalContestsList(sortedContests)
      
    }, [Contests])
    
   

    const renderContests = ({ item , index }) => {
        let cardColor;
        let statusColor;
        switch (item.status) {
            case 'New':
              item.statusColor = 'blue';
              break;
            case 'Urgent':
              item.statusColor = 'orange';
              break;
            case 'ready':
              item.statusColor = 'green';
              break;
            case 'Time Over':
                item.statusColor = 'black';
            default:
              statusColor = 'black';
          }
        
        const handleTimerFinish = () => {
          if(item.status != 'Ready For Pickup'){
            item.status = '⚠️ Time Over';
            item.statusColor = 'white'
            item.color = '#fa5050'
            //setTriggerChange(Math.random()*10)
          }
            
        };
        const handleCompleted = (itemId,index) =>{
            const updatedContests = Contests.filter((item) => item.id !== itemId);
            setContests(updatedContests)
        }
        const now = new Date();
        const utcSeconds = Math.floor(now.getTime() / 1000);

        
        
        return (
            <TouchableOpacity style={{backgroundColor: item.color? item.color :'white',padding: 10,marginBottom: 10,borderRadius:20,height:170}}>
              <View style={{flexDirection:'row',marginBottom:10}}>
                    <Text style={styles.ContestsName}>{item.name}</Text>
                    {/* {item.showDelivery ? 
                      <Image
                        style={{ height:40,width:40,left:'20%' }}
                        source={require('../assets/delivery-bike.png')}
                      /> :null} */}
              </View>
              <View style={{alignContent:'flex-end'}}>
              </View>
              
               <View style={{flexDirection:'row'}}>
                <Text style={{color:'black',marginRight:10,fontWeight:'bold'}}>Time Left : </Text>
                <View>
                    <CountDown
                        until={item.startTimeSeconds - utcSeconds}
                        onFinish={handleTimerFinish}
                        digitStyle={{backgroundColor: '#FAB913', Width: 2, Color: '#000000'}}
                        digitTxtStyle={{color: 'black'}}
                        onPress={() => Alert.alert("Kyu ungli kar ra hai","Upsolve hi kar le tab tak")}
                        // onChange = { ()=> {
                        //   if(item.status != '❗Expiring Soon' && item.status != 'Ready For Pickup' && (item.time*60 - elapsedTime)<=300 && (item.time*60 - elapsedTime)>100){
                        //     console.log(item.name)
                        //     item.status = '❗Expiring Soon'
                        //     item.statusColor = 'white'
                        //     item.color = '#db934f'
                        //     setTriggerChange(Math.random()*10)
                        //   }
                        // }}
                        size={15}
                        timeToShow={['D','H', 'M', 'S']}
                        showSeparator
                    />
                </View>
              </View> 

              <View >
                    <Text style={{color:item.statusColor? item.statusColor : 'black',alignItems:'flex-start',fontWeight:'bold'}}>Duration : {item.durationSeconds / (60*60)} Hours</Text>
              </View>
              
              
            </TouchableOpacity>
          );

        
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={{alignSelf:'center',fontSize:30,fontWeight:'bold',margin:20,marginBottom:50,color:'white'}}> Welcome !</Text>
          <FlatList
            data={finalContestsList}
            keyExtractor={(item,index) => item.id}
            renderItem={renderContests}
          />
        </ScrollView>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 10,
      },
      ContestsContainer: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        marginBottom: 10,
        bContestsRadius:20,
        height:170
      },
      ContestsName: {
        fontWeight: 'bold',
        fontSize: 18,
        color:'#000000',
        marginBottom: 5,
        marginLeft:5
      },
      ContestsTime: {
        fontSize: 14,
        marginBottom: 5,
        color:'#001123'
      },
      ContestsStatus: {
        fontSize: 14,
        color:'green'
      }
    });
    
export default HomeScreen