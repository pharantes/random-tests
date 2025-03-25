// import { faClose, faLocationDot, faLocationPinLock, faMapPin, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useRouter } from "next/router";
import Link from "next/link";
import { Fragment, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
// import SearchBar from "../SearchBar/SearchBar";
// import FollowButton from "../FollowButton/FollowButton";
// import FriendButton from "../FriendButton/FriendButton";
// import InviteButton from "../InviteButton/InviteButton";
// import { useSession } from "next-auth/react";
// import ProfileImage from "../ProfileImage/ProfileImage";

export default function LostConnectionsList({ id, setVisible, event }) {
    const [search, setSearch] = useState('')
    const { data, isLoading, error } = useSWR(event ? `/api/event/${event}/lostConnections` : null)
    if (isLoading) return <p>Loading...</p>
    if (error || !data) return <p>Error loading Data</p>

    console.log(data);

    const connections = data?.filter(item => item.recipient.username.toLowerCase().includes(search.toLowerCase()))

    // const connections = filtered?.filter(friend => friend.following.toLowerCase().includes(search.toLowerCase()))
    return (
        <Container>
            {/* <Title>Invite your connections</Title> */}
            <ListHeader>
                {/* <SearchBar setSearch={setSearch} /> */}
                <CreateButton onClick={() => setVisible(false)}>
                    Close
                    {/* <FontAwesomeIcon icon={faClose} height={20} /> */}
                </CreateButton>
            </ListHeader>
            <CardContainer>
                {connections.map((save, index) => (
                    <Fragment key={save.recipient._id != id ? save.recipient._id : save.requester._id}>
                        <Divider />
                        <Card>
                            <CardLink href={`/user/${save.recipient._id != id ? save.recipient._id : save.requester._id}`}>
                                {/* <ProfileImage src={save.recipient._id != id ? save.recipient.imageSource : save.requester.imageSource} /> */}
                                <Wrapper>

                                    <CardTitle>{save.recipient._id != id ? save.recipient.name : save.requester.name}</CardTitle>
                                    <SubTitle>{save.recipient._id != id ? save.recipient.username : save.requester.username}</SubTitle>
                                </Wrapper>
                                {/* <SubTitle>{event.startTime}</SubTitle> */}
                            </CardLink>
                            {/* <InviteButton entityId={save.recipient._id != id ? save.recipient._id : save.requester._id} event={event} /> */}
                        </Card>
                        {index + 1 === connections.length && <Divider />}
                    </Fragment>
                ))}
            </CardContainer>
        </Container>
    );
};

const Wrapper = styled.div`
`

const ListHeader = styled.div`
display: flex;
justify-content: flex-end;
gap: 10px;
height: 37px;

`

const Image = styled.img`
width: 40px;
height: 40px;
object-fit: cover;
border-radius: 30px
`

const CreateButton = styled.button`
color: var(--background-color);
background-color: var(--text-color);
display: flex;
gap: 10px;
align-items: center;
justify-content: center;
width: 100px;
text-decoration: none;
// height: 30px;
border-radius: var(--border-radius);
border: 1px solid var(--line-color);
padding: 0px 20px;

&:hover {
background-color: var(--line-color)}
`;

const Divider = styled.span`
  border-bottom: 1px solid var(--line-color);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const CardTitle = styled.h3`
  text-decoration: none;
  margin: 0;
  font-size: 1rem;
`;

const SubTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 300;
  color: grey;
`;

const CardLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--text-color);
`;

const Card = styled.div`
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // flex-direction: column;
  color: var(--text-color);
  gap: 10px;
`;

const CardContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;