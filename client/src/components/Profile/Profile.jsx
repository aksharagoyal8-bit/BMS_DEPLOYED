import { Tabs } from "antd";
import Bookings from "./Bookings";

const Profile = () => {
  const items = [
    {
      key: "1",
      label: "Bookings",
      children: <Bookings />,
    },
  ];

  return (
    <>
      <h1>Profile Page</h1>
      <Tabs defaultActiveKey="1" items={items} />
    </>
  );
};

export default Profile;