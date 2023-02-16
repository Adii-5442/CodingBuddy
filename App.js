import axios from 'axios';
import {View, Text} from 'react-native'
import React, { useEffect, useState } from 'react';

const App = () => {
  const [contests, setContests] = useState([]);
  const [isLoader, setisLoader] = useState(false)
  const API_KEY = 'd255f866afc74f08176dc80448a0bcae3127a86c';
  const API_URL = 'https://codeforces.com/api/contest.list';

const getUpcomingContests = async () => {
  setisLoader(true)
  try {

    const response = await axios.get(API_URL, {
      params: {
        apiKey: 'd255f866afc74f08176dc80448a0bcae3127a86c',
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
  console.log(contests)
}, [contests])



  useEffect(() => {

    getUpcomingContests().then((upcomingContests) => {
      setContests(upcomingContests);
    });
  }, []);

  return (
    <View>
      <Text>
        Hello
      </Text>
    </View>
  );
};

export default App;
