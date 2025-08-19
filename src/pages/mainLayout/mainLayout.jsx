import { Button, Menu, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineDashboard, MdOutlinePendingActions } from "react-icons/md";
import { LuBookUser } from "react-icons/lu";
import { BiIdCard } from "react-icons/bi";
import { TbReportAnalytics } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import MainHeader from "./header/MainHeader";
import LogoSmallImage from "../../assets/images/LogoSmallImage";

export default function MainLayout() {
  //states
  const [collapsed, setCollapsed] = useState(true);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [selecteKey, setSelectKey] = useState("1");
  const [containerHeight, setContainerHeight] = useState(
    window.innerHeight - 80
  );

  const navigate = useNavigate();

  const toggleCollapsed = () => {
    if (window.innerWidth > 768) {
      setCollapsed(!collapsed);
    } else {
      setCollapsed(true);
    }
  };

  //item list********************************************

  const items = [
    {
      key: "1",
      icon: (
        <MdOutlineDashboard
          className={`w-[32px] h-[32px] rounded-full p-1 ${
            selecteKey === "1" ? "bg-colorTextSelected" : "bg-transparent"
          }`}
          color={
            selecteKey === "1"
              ? "var(--color-selected)"
              : "var(--color-non-selected)"
          }
        />
      ),
      label: "Dashboard",
      route: "/dashboard",
    },
    {
      key: "2",
      label: "User Mangement",
      icon: (
        <LuBookUser
          className={`w-[32px] h-[32px] rounded-full p-1 ${
            selecteKey === "2" ? "bg-colorTextSelected" : "bg-transparent"
          }`}
          color={
            selecteKey === "2"
              ? "var(--color-selected)"
              : "var(--color-non-selected)"
          }
        />
      ),
      route: "/usermangemnt",
    },
    {
      key: "3",
      icon: (
        <BiIdCard
          className={`w-[32px] h-[32px] rounded-full p-1 ${
            selecteKey === "3" ? "bg-colorTextSelected" : "bg-transparent"
          }`}
          color={
            selecteKey === "3"
              ? "var(--color-selected)"
              : "var(--color-non-selected)"
          }
        />
      ),
      label: "ID verification",
      route: "/idverification",
    },
    {
      key: "4",
      label: "Pending IDs",
      icon: (
        <MdOutlinePendingActions
          className={`w-[32px] h-[32px] rounded-full p-1 ${
            selecteKey === "4" ? "bg-colorTextSelected" : "bg-transparent"
          }`}
          color={
            selecteKey === "4"
              ? "var(--color-selected)"
              : "var(--color-non-selected)"
          }
        />
      ),
      route: "/pending",
    },
    {
      key: "5",
      label: "Reports & Analytics",
      icon: (
        <TbReportAnalytics
          className={`w-[32px] h-[32px] rounded-full p-1 ${
            selecteKey === "5" ? "bg-colorTextSelected" : "bg-transparent"
          }`}
          color={
            selecteKey === "5"
              ? "var(--color-selected)"
              : "var(--color-non-selected)"
          }
        />
      ),
      route: "/analatic",
    },
    {
      key: "6",
      label: "Settings",
      icon: (
        <FiSettings
          className={`w-[32px] h-[32px] rounded-full p-1 ${
            selecteKey === "6" ? "bg-colorTextSelected" : "bg-transparent"
          }`}
          color={
            selecteKey === "6"
              ? "var(--color-selected)"
              : "var(--color-non-selected)"
          }
        />
      ),
      route: "#",
    },
  ];

  //sidebar handling functions
  useEffect(() => {
    // Update selecteKey based on current route
    const matchedItem = items
      .flatMap((item) => (item.children ? [item, ...item.children] : item))
      .find((item) => location.pathname.includes(item.route));

    if (matchedItem) {
      setSelectKey(matchedItem.key);
    } else {
      setSelectKey(null);
    }
  }, [location.pathname]);

  //navigate to desired route
  const handleMenuClick = (val) => {
    setSelectKey(val.key);

    const selectedItem = items
      .flatMap((item) => (item.children ? [item, ...item.children] : item))
      .find((item) => item.key === val.key);
    if (selectedItem) {
      navigate(selectedItem.route);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight - 80);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`w-full max-w-screen min-h-screen h-full flex items-center justify-start overflow-hidden `}
    >
      <div
        className={`${
          collapsed ? "w-[82px]" : "w-[270px]"
        } min-h-dvh bg-colorSelected border-r-[2px] shadow-md relative transition-all duration-300 ease-in-out z-10`}
      >
        <div
          className={`flex flex-col items-center justify-center gap-1  ${
            collapsed ? "my-4" : "mt-6 mb-0"
          }`}
        >
          <LogoSmallImage
            className={`${
              collapsed ? "w-[60px]" : "w-[150px]"
            } transition-all duration-300 ease-in-out`}
          />
        </div>

        <div className="h-[30px] flex items-center justify-end">
          <Button
            shape="circle"
            icon={collapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
            className=" -mr-4"
            onClick={toggleCollapsed}
          />
        </div>

        <Menu
          className="font-medium [&_.ant-menu-item-selected]:!bg-[#F1F5F9]   "
          // defaultSelectedKeys={["1"]}
          selectedKeys={[selecteKey]}
          onSelect={handleMenuClick}
          mode="inline"
          // theme="dark"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>

      {/* home right section */}
      <div className="w-full min-w-0 min-h-dvh max-h-dvh bg-colorBackground flex-1 flex-col justify-start items-center  ">
        <MainHeader
          openPopover={openUserMenu}
          onOpenChange={() => {
            setOpenUserMenu(!openUserMenu);
          }}
        />

        <div
          className=" w-full flex flex-col items-center justify-start px-2 pb-2 overflow-auto scroll bg-[#F1F5F9] "
          style={{
            minHeight: containerHeight,
            maxHeight: containerHeight,
          }}
        >
          <div className="w-full flex-col items-center justify-start sm:w-[90%] lg:w-[95%] ">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
