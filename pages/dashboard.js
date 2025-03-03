import React, {useState, useEffect} from 'react'
import { styled } from 'styled-components'
import Navbar from "@/components/Dashboard/Navbar"
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { database } from '@/backend/Firebase'
import { useStateContext } from '@/context/StateContext'


export default function Dashboard() {
  const { user } = useStateContext()
  const [roommates, setRoommates] = useState([])
  const [roommateCount, setRoommateCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetchRoommateData()
    }
  }, [user])

  const fetchRoommateData = async () => {
    try {
      // Get roommate matches document
      const matchesRef = doc(database, 'roomateMatches', user.uid)
      const matchesSnapshot = await getDoc(matchesRef)
      
      if (matchesSnapshot.exists()) {
        const matchData = matchesSnapshot.data()
        const roommateIds = matchData.roommates || []
        setRoommateCount(roommateIds.length)
        
        // Fetch actual roommate profile data
        const roommateProfiles = []
        for (const roommateId of roommateIds) {
          const profileRef = doc(database, 'userProfiles', roommateId)
          const profileSnapshot = await getDoc(profileRef)
          
          if (profileSnapshot.exists()) {
            roommateProfiles.push({
              id: roommateId,
              ...profileSnapshot.data()
            })
          }
        }
        
        setRoommates(roommateProfiles)
      }
      
      
    } catch (err) {
      console.error('Error fetching roommate data:', err)
      
    }
  }

  
  return (
    <>
      <PageContainer>
        <Navbar />
        <DashboardHeader>
          <WelcomeTitle>Welcome to <span>RoomieLife</span></WelcomeTitle>
          <WelcomeSubtitle>Manage your roommate experience all in one place</WelcomeSubtitle>
        </DashboardHeader>

        

        <DashboardContent>
          <DashboardCards>

            <DashboardCard>
              <CardIcon>🏠</CardIcon>
              <CardTitle>Roommates</CardTitle>
              <CardDescription>Find and connect with potential roommates</CardDescription>
              <CardButton href="/Roommate/roommatematching">Find Roommates</CardButton>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>👤</CardIcon>
              <CardTitle>Profile</CardTitle>
              <CardDescription>View and edit your personal information</CardDescription>
              <CardButton href="/auth/profile">Manage Profile</CardButton>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>✔️</CardIcon>
              <CardTitle>Chores</CardTitle>
              <CardDescription>Track and manage household responsibilities</CardDescription>
              <CardButton href="/chores/choresmain">Manage Chores</CardButton>
            </DashboardCard>

            <DashboardCard>
              <CardIcon>💰</CardIcon>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Track shared expenses and payments</CardDescription>
              <CardButton href="/expense.js">Manage Expenses</CardButton>
            </DashboardCard>
          </DashboardCards>

          <DashboardSummary>
            <SummaryTitle>Quick Summary</SummaryTitle>
            <SummaryBox>
              <SummaryItem>
                <SummaryLabel>Upcoming Chores</SummaryLabel>
                <SummaryValue>3</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Pending Expenses</SummaryLabel>
                <SummaryValue>$45</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Roommates</SummaryLabel>
                <SummaryValue>{roommateCount}</SummaryValue>
              </SummaryItem>
            </SummaryBox>
          </DashboardSummary>
          <RoommateSection>
            <RoommateSectionHeader>
              <RoommateTitle>Current Roommates</RoommateTitle>
              <RoommateSubtitle>Your living partners</RoommateSubtitle>
            </RoommateSectionHeader>
            
            <RoommateCards>
                {roommates.length > 0 ? (
                roommates.map(roommate => (
                  <RoommateCard key={roommate.id}>
                    {roommate.profilePicture ? (
                      <RoommateAvatar>
                        <RoommateAvatarImage src={roommate.profilePicture} alt={`${roommate.firstName}'s profile`} />
                      </RoommateAvatar>
                    ) : (
                      <RoommateAvatar>
                        {roommate.firstName?.[0]}{roommate.lastName?.[0]}
                      </RoommateAvatar>
                    )}
                    <RoommateName>{roommate.firstName} {roommate.lastName}</RoommateName>
                    <RoommateDetails>
                      {roommate.age && <RoommateDetail>Age: {roommate.age}</RoommateDetail>}
                      {roommate.university && <RoommateDetail>University: {roommate.university}</RoommateDetail>}
                      {roommate.lifestylePreferences?.cleanliness && (
                        <RoommateDetail>Cleanliness: {roommate.lifestylePreferences.cleanliness}</RoommateDetail>
                      )}
                    </RoommateDetails>
                  </RoommateCard>
                ))
              ) : (
                <NoRoommates>
                  You don't have any roommates yet
                  <RoommateButton href="/Roommate/roommatematching">Find Roommates</RoommateButton>
                </NoRoommates>
              )}
              </RoommateCards>
              </RoommateSection>
        </DashboardContent>
      </PageContainer>
    </>
  )
}

const PageContainer = styled.div`
  background-color: #121212;
  font-family: 'Gill Sans MT';
  min-height: 100vh;
  color: white;
`;

const DashboardHeader = styled.div`
  padding: 30px 20px;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 36px;
  color: white;
  margin-bottom: 10px;
  
  span {
    color: #ff6b6b;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 18px;
  color: grey;
`;

const DashboardContent = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardCards = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: 1fr;
  margin-bottom: 40px;
  
`;

const DashboardCard = styled.div`
  background-color: rgb(32, 31, 31);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const CardIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
`;

const CardDescription = styled.p`
  font-size: 16px;
  color: grey;
  margin-bottom: 20px;
`;

const CardButton = styled(Link)`
  background-color: #ff6b6b;
  color: black;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  text-decoration: none;
  margin-top: auto;
  
  &:hover {
    font-weight: bold;
  }
`;

const DashboardSummary = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 16px;
`;

const SummaryTitle = styled.h2`
  font-size: 24px;
  color: #ff6b6b;
  margin-bottom: 20px;
`;

const SummaryBox = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
  
`;

const SummaryItem = styled.div`
  background-color: rgb(32, 31, 31);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const SummaryLabel = styled.p`
  font-size: 16px;
  color: grey;
  margin-bottom: 10px;
`;

const SummaryValue = styled.p`
  font-size: 24px;
  color: white;
  font-weight: bold;
`;

const NoRoommates = styled.div`
  background-color: rgba(32, 31, 31, 0.7);
  padding: 30px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const RoommateSection = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 16px;
`;

const RoommateSectionHeader = styled.div`
  margin-bottom: 30px;
`;

const RoommateTitle = styled.h2`
  font-size: 24px;
  color: #ff6b6b;
  margin-bottom: 10px;
`;

const RoommateSubtitle = styled.p`
  font-size: 16px;
  color: grey;
`;

const RoommateCards = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
`;

const RoommateCard = styled.div`
  background-color: rgb(32, 31, 31);
  padding: 25px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const RoommateAvatar = styled.div`
  width: 80px;
  height: 80px;
  font-size: 28px;
  margin-bottom: 15px;
  background-color: rgba(255, 107, 107, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border: 3px solid #ff6b6b;
`;

const RoommateAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const RoommateName = styled.h3`
  font-size: 20px;
  color: white;
  margin-bottom: 10px;
`;

const RoommateDetails = styled.div`
  margin-bottom: 20px;
`;

const RoommateDetail = styled.p`
  font-size: 14px;
  color: grey;
  margin-bottom: 5px;
`;

const RoommateButton = styled(Link)`
  background-color: #ff6b6b;
  color: black;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  
  &:hover {
    font-weight: bold;
  }
`;