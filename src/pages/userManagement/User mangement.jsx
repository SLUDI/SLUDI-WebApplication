import React, { useState } from "react";
import { Card, Col, Image, Input  } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space } from 'antd';



const { Search } = Input;

export default function UserMangement() {
  const [selectedLabel, setSelectedLabel] = useState('User State'); 

  const items = [
    {
      key: '1',
      icon: <UserOutlined  />,
      label: <span >All Users</span>,
    },
    {
      key: '2',
      icon: <UserOutlined style={{ color: 'green' }} />,
      label: <span style={{ color: 'green' }}>Active Users</span>,
    },
    {
      key: '3',
      icon: <UserOutlined style={{ color: 'orange' }} />,
      label: <span style={{ color: 'orange' }}>Pending Users</span>,
    },
    {
      key: '4',
      icon: <UserOutlined style={{ color: 'red' }} />,
      label: <span style={{ color: 'red' }}>Inactive Users</span>,
    },

  ];

  const handleMenuClick = (e) => {
    const selectedItem = items.find((item) => item.key === e.key);
    if (selectedItem) {
      setSelectedLabel(selectedItem.label);
      message.info(`Selected: ${selectedItem.label}`);
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <div className="p-6 max-h-screen">
      <h1 className="text-3xl font-bold text-[#000000] mb-6">User Management</h1>
      <div className="flex flex-row items-center ">
        <div className="w-[25%]">
            <Search placeholder="Search by ID or Name" style={{ maxWidth: '100%' }}  size="large" className="mb-2 h-10"
              enterButton={
                <button className="bg-[#13A4B4] hover:bg-[#7c9ece] text-white px-4  rounded-[0px_10px_10px_0px] h-10">
                  Search
                </button>
              }
            />
        </div>
        <Dropdown menu={menuProps} className="mt-[-8px] ml-4">
          <Button size="large">
            <Space>
              {selectedLabel}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown> 
        <div>
        <div className="mt-[-8px] ml-4 text-[#000000] font-bold">
          Total Records : 452
        </div>
        </div>
      </div>

      <Col span={24} >
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 mb-4">

            {/* ID */}
            <div className="w-full sm:w-[15%] ml-4">
              <p className="text-lg font-bold text-[#000000]" >CARD ID</p>
            </div>

            {/* Name & Role */}
            <div className="w-full sm:w-[20%]">
              <p className="text-lg font-bold text-[#000000]" >FRONT FIELD</p>
            </div>

            {/* Image */}
            <div className="w-full sm:w-[15%] ">
              <p className="text-lg font-bold text-[#000000]" >ID PHOTO</p>
            </div>

            {/* Status */}
            <div className="w-full sm:w-[15%]">
              <p className="text-lg font-bold text-[#000000]" >STATUS</p>
            </div>

            {/* Date & Time */}
            <div className="w-full sm:w-[15%]">
              <p className="text-lg font-bold text-[#000000]" >ISSUED DATE</p>
            </div>

          </div>
        <Card variant="borderless" bodyStyle={{ padding: '10px', marginBottom: '10px' }} >
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">

            {/* ID */}
            <div className="w-full sm:w-[15%] ml-4">
              <p className="text-lg font-bold">996751789 V</p>
            </div>

            {/* Name & Role */}
            <div className="w-full sm:w-[20%]">
              <p className="text-lg font-bold">Prabath Malinda</p>
              <p className="text-gray-600 text-sm mt-1">Teacher</p>
            </div>

            {/* Image */}
            <div className="w-full sm:w-[15%] ">
              <Image
                width={50}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>

            {/* Status */}
            <div className="w-full sm:w-[15%]">
              <p className="text-sm mt-2 bg-green-600 text-white p-2 text-center rounded w-[50%]">Active</p>
            </div>

            {/* Date & Time */}
            <div className="w-full sm:w-[15%]">
              <p className="text-lg font-semibold">Jan 27, 2026</p>
              <p className="text-lg mt-1 font-semibold">12.00 AM</p>
            </div>

          </div>
        </Card>
        <Card variant="borderless" bodyStyle={{ padding: '10px', marginBottom: '10px' }} >
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4">

            {/* ID */}
            <div className="w-full sm:w-[15%] ml-4 ">
              <p className="text-lg font-bold">996751789 V</p>
            </div>

            {/* Name & Role */}
            <div className="w-full sm:w-[20%]">
              <p className="text-lg font-bold">Prabath Malinda</p>
              <p className="text-gray-600 text-sm mt-1">Teacher</p>
            </div>

            {/* Image */}
            <div className="w-full sm:w-[15%] ">
              <Image
                width={50}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>

            {/* Status */}
            <div className="w-full sm:w-[15%]">
              <p className="text-sm mt-2 bg-green-600 text-white p-2 text-center rounded w-[50%]">Active</p>
            </div>

            {/* Date & Time */}
            <div className="w-full sm:w-[15%]">
              <p className="text-lg font-semibold">Jan 27, 2026</p>
              <p className="text-lg mt-1 font-semibold">12.00 AM</p>
            </div>

          </div>
        </Card>
      </Col>
    </div>
  );
}
