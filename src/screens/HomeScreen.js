import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import InfoCard from '../components/InfoCard';
import { AppContext } from '../../context/AppContext';
import { ProjectContext } from '../../context/ProjectContext';
import { getCompanyInfo, getProfileInfo } from '../services/authServices';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { getActivityList } from '../services/productServices';
import { MaterialIcons } from '@expo/vector-icons';
import InfoCards from '../components/InfoCards';

const { width } = Dimensions.get('window');

const Container = styled.View`
  background-color: #f5f5f5;
`;

const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#c2fbcd', '#ffdde1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  align-items: center;
  height: 100%;
`;

const CompanyContainer = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 10px;
  background-color: #c2fbcd;
  align-items: center;
  gap: 20px;
`;

const CompanyTextContainer = styled.View`
  display: flex;
  align-items: flex-start;
`;

const ProfileTextContainer = styled.View`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const LogoContainer = styled.View`
  width: ${width * 0.20}px;
  height: ${width * 0.20}px;
  background-color: #ffffff;
  border-radius: ${width * 0.25}px;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  margin-top: 5%;
`;

const Logo = styled.Image.attrs(() => ({
  resizeMode: 'contain',
}))`
  width: 95%;
  height: 95%;
  border-radius: ${width * 0.35}px;
`;

const CompanyName = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0;
  color: #333333;
`;

const SubHeader = styled.Text`
  font-size: 16px;
  margin-bottom: 20px;
  color: #555555;
`;

const ActivityContainer = styled.View`
  margin: 10px;
  padding: 20px;
  height: 100%;
  background-color: white;
  border-radius: 20px;
  flex: 1;
  margin-bottom: 20px;
`;

const ActivityRow = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 16px;
  background-color: #ffffff;
  margin-bottom: 5px;
  border-radius: 10px;
  elevation: 2;
  border: 1px solid #353535;
`;

const ActivityText = styled.Text`
  font-size: 14px;
  color: #333333;
`;

const StatusText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #e63946;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
`;

const TodaysActivitiesContainer = styled.View`
  width: 100%;
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
`;

const TaskCount = styled.Text`
  font-size: 14px;
  color: #555555;
  margin-bottom: 10px;
`;

const TaskCard = styled(TouchableOpacity)`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 15px;
  margin-right: 10px;
  width: 250px;
  elevation: 2;
  border: 1px solid #e0e0e0;
`;

const TaskName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 5px;
`;

const TaskDetail = styled.Text`
  font-size: 14px;
  color: #555555;
  margin-bottom: 3px;
`;

const NoTasksText = styled.Text`
  font-size: 16px;
  color: #555555;
  text-align: center;
  margin-top: 10px;
`;

const HomePage = () => {
  const router = useRouter();
  const { userToken } = useContext(AppContext);
  const { projects, todaysTasks, loading, error, setSelectedProjectRef, setSelectedGroup } = useContext(ProjectContext);
  const [company, setCompany] = useState({});
  const [profile, setProfile] = useState([]);
  const [total, setTotal] = useState(0);
  const [review, setReview] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [isManager, setIsManager] = useState(false);


  useEffect(() => {
    fetchActivityDetails();
    getProfileInfo()
      .then((res) => {
          setProfile(res.data);
          setIsManager(res?.data.user_group?.is_manager);
      })
      .catch((error) => {
          setIsManager(false);
      });

    getCompanyInfo()
      .then((res) => {
        setCompany(res.data);
      })
      .catch(() => {});
  }, []);

  // console.log('Profile===',profile?.emp_data?.name)
      
  const fetchActivityDetails = () => {
    getActivityList()
      .then((res) => {
        const uniqueActivities = res?.data?.a_list.reduce((acc, current) => {
          const x = acc.find(item => item.ref_num === current.ref_num);
          if (!x) {
            acc.push(current);
          }
          return acc;
        }, []);
        setTotal(res?.data?.project_count);
        setReview(res?.data?.review_count);
        setCompleted(res?.data?.completed_count);
        setPending(res?.data?.pending_count);
        setOverdue(res?.data?.over_due_count);
      })
      .catch((error) => {
        console.log('Error',error);
      });
  };
  
  // Example functions for InfoCard clicks
  const handleProjectClick = () => {
    router.push({
      pathname: 'ActivityList' 
    });
  };
  // const handleReviewsClick = () => alert('Reviews Clicked');
  const handleCompletedClick = () => {
    router.push({
      pathname: 'ActivityCompleted' 
    });
  };
  const handlePendingClick = () => {
    router.push('activity');
  };
  const handleActivityClick = (id) => {
    router.push({
        pathname: 'ActivityList',
        params: { ref_num: id },
    });
  };

  const handleCardClicks = () => {
    router.push({
        pathname: 'Test',
    });
  };
  // const handleOverdueClick = () => alert('Overdue Activities Clicked');
  const handleOverdueClick = () => {
    router.push({
      pathname: 'OverDue' 
    });
  };

  const handleCaptureClick = () => {
    router.push({
      pathname: 'ProjectList',
    });
  };

  const handleTaskClick = (task) => {
    setSelectedProjectRef(task.test.project_code);
    setSelectedGroup(task.group);
    router.push({
      pathname: 'TestDetail',
      params: {
        ref_num: task.test.project_code,
        group: JSON.stringify(task.group),
        test: JSON.stringify(task.test),
      },
    });
  };

  // console.log('Activity List======',activities)

  const getSpeciesName = (species) => {
    switch(species) {
      case 'R': return 'Rat';
      case 'M': return 'Mouse'; 
      case 'P': return 'Pig';
      default: return 'Unknown';
  }
}

  const renderTaskItem = ({ item }) => (
    <TaskCard onPress={() => handleTaskClick(item)}>
      <TaskName>{item.test.name}</TaskName>
      <TaskDetail>Project: {item.projectCode}</TaskDetail>
      <TaskDetail>Group: {item.groupName}</TaskDetail>
      <TaskDetail>Species: {getSpeciesName(item.group.species_type)}</TaskDetail>
      <TaskDetail>Frequency: {item.test.test_frequency}</TaskDetail>
    </TaskCard>
  );

  return (
    <Container>
      <StatusBar style="dark" backgroundColor="#c2fbcd" />
      <GradientBackground>
        <CompanyContainer>
          <LogoContainer>
            <Logo source={{ uri: company.image || 'https://home.atomwalk.com/static/media/Atom_walk_logo-removebg-preview.21661b59140f92dd7ced.png' }} />
          </LogoContainer>
          <CompanyTextContainer>
            <CompanyName>{company.name || 'Atomwalk Technologies'}</CompanyName>
            <SubHeader>Welcome to Atomwalk Office!</SubHeader>
          </CompanyTextContainer>
        </CompanyContainer>
        <ScrollView
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <TodaysActivitiesContainer>
            <SectionTitle>Today's Activities</SectionTitle>
            <TaskCount>{todaysTasks.length} Tasks Scheduled</TaskCount>
            {loading && <Text style={styles.loading}>Loading...</Text>}
            {error && <Text style={styles.error}>{error}</Text>}
            {todaysTasks.length === 0 && !loading && (
              <NoTasksText>No tasks scheduled for today.</NoTasksText>
            )}
            <FlatList
              data={todaysTasks}
              keyExtractor={(item) => `${item.group.id}-${item.test.id}`}
              renderItem={renderTaskItem}
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{ paddingBottom: 10 }}
            />
          </TodaysActivitiesContainer>
          {projects.length > 0 ? (
            <>
              <ProfileTextContainer>
                <CompanyName>My Activities</CompanyName>
              </ProfileTextContainer>
              {/* Cards Layout */}
              <Row>
                <InfoCard number={total} label="TOTAL" iconName="beaker-outline" gradientColors={['#007bff', '#00c6ff']} onPress={handleProjectClick} />
                <InfoCard number={completed} label="DONE" iconName="check-circle" gradientColors={['#38ef7d', '#11998e']} onPress={handleCompletedClick} />
              </Row>
              <Row>
                <InfoCard number={pending} label="PENDING" iconName="format-list-checks" gradientColors={['#f09819', '#ff512f']} onPress={handlePendingClick} />
                <InfoCard number={overdue} label="OVER DUE" iconName="alert" gradientColors={['#e52d27', '#b31217']} onPress={handleOverdueClick} />
              </Row>       
              <Row>
                <InfoCards number={3} label="My Bookings" iconName="application-edit-outline" gradientColors={['#FF6F61', '#D32F2F']} onPress={() => handleCardClicks()} />
                <InfoCard number={1} label="Capture Data" iconName="beaker-outline" gradientColors={['#007bff', '#00c6ff']} onPress={handleCaptureClick} />
              </Row>
              {/* Scrollable Activity List */}
              <ActivityContainer>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#454545' }}>My Projects</Text>
                <View>
                  {[...projects].reverse().map((item) => (
                    <ActivityRow key={item.activity_id} onPress={() => handleActivityClick(item.ref_num)}>
                      <ActivityText>{item.ref_num}</ActivityText>
                      <StatusText>{item.status}</StatusText>
                    </ActivityRow>
                  ))}
                </View>
              </ActivityContainer>
            </>
          ) : (
            <View style={styles.container}>
              <MaterialIcons name="info-outline" size={48} color="#4CAF50" />
              <Text style={styles.text}>No Projects Available</Text>
            </View>
          )}
        </ScrollView>
      </GradientBackground>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 200,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4CAF50',
  },
  loading: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: '#e63946',
    marginBottom: 10,
  },
});

export default HomePage;