import { Button, Menu, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // <-- added useLocation
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdOutlineDashboard, MdOutlinePendingActions } from "react-icons/md";
import { TbLicense } from "react-icons/tb";
import { BsQrCodeScan } from "react-icons/bs";
import { LuBookUser } from "react-icons/lu";
import { BiIdCard } from "react-icons/bi";
import { TbReportAnalytics } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";
import MainHeader from "./header/MainHeader";
import LogoSmallImage from "../../assets/images/LogoSmallImage";
import { useDispatch, useSelector } from "react-redux";
import { RiPassPendingLine } from "react-icons/ri";
import { MdOutlineLibraryBooks } from "react-icons/md";
import MainButton from "../../components/baseComponents/button/MainButton";
import { CiLogout } from "react-icons/ci";
import { logOut } from "../../redux/authSlice";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [selecteKey, setSelectKey] = useState("1");
  const [containerHeight, setContainerHeight] = useState(
    window.innerHeight - 80
  );

  // 👇 Example role (you can later set this dynamically after login)
  //const [role, setRole] = useState("SuperAdmin"); // or "Admin"

  //const role = useSelector((state) => state.role.role);
  const organizationId = useSelector((state) => state.auth.organizationId);
  const roleCode = useSelector((state) => state.auth.roleCode);
  //console.log(role);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const toggleCollapsed = () => {
    if (window.innerWidth > 768) {
      setCollapsed(!collapsed);
    } else {
      setCollapsed(true);
    }
  };

  // --- item lists ---
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
      label: "User Management",
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
      label: "ID Verification",
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
    // {
    //   key: "5",
    //   label: "Reports & Analytics",
    //   icon: (
    //     <TbReportAnalytics
    //       className={`w-[32px] h-[32px] rounded-full p-1 ${
    //         selecteKey === "5" ? "bg-colorTextSelected" : "bg-transparent"
    //       }`}
    //       color={
    //         selecteKey === "5"
    //           ? "var(--color-selected)"
    //           : "var(--color-non-selected)"
    //       }
    //     />
    //   ),
    //   route: "/analytics",
    // },
    // {
    //   key: "6",
    //   label: "Settings",
    //   icon: (
    //     <FiSettings
    //       className={`w-[32px] h-[32px] rounded-full p-1 ${
    //         selecteKey === "6" ? "bg-colorTextSelected" : "bg-transparent"
    //       }`}
    //       color={
    //         selecteKey === "6"
    //           ? "var(--color-selected)"
    //           : "var(--color-non-selected)"
    //       }
    //     />
    //   ),
    //   route: "#",
    // },
    {
      key: "5",
      icon: (
        <LuBookUser
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
      label: "Organization",
      route: "/organization",
    },
    {
      key: "6",
      label: "Permission Template",
      icon: (
        <TbReportAnalytics
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
      route: "/permission",
    },
  ];

  const adminitems = [
    {
      key: "1",
      icon: (
        <LuBookUser
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
      label: "User Managment",
      route: "/organizationUser",
    },
    {
      key: "5",
      icon: (
        <MdOutlineLibraryBooks
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
      label: "Issued License",
      route: "/issuedLicenses",
    },
    {
      key: "2",
      icon: (
        <BsQrCodeScan
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
      label: "Initiate Request",
      route: "/licenseReqqust",
    },

    {
      key: "4",
      icon: (
        <RiPassPendingLine
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
      label: "Pending Reqest",
      route: "/pendingIssue",
    },
  ];

  const useritems = [
    {
      key: "4",
      icon: (
        <MdOutlineLibraryBooks
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
      label: "Issued License",
      route: "/issuedLicenses",
    },
    {
      key: "1",
      icon: (
        <BsQrCodeScan
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
      label: "Initiate Request",
      route: "/licenseReqqust",
    },

    {
      key: "3",
      icon: (
        <RiPassPendingLine
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
      label: "Pending Reqest",
      route: "/pendingIssue",
    },
  ];

  const menuItems =
    organizationId === 1 && roleCode === "ADMIN"
      ? items
      : organizationId !== 1 && roleCode === "ADMIN"
      ? adminitems
      : useritems;

  // Sidebar handling
  useEffect(() => {
    const matchedItem = menuItems
      .flatMap((item) => (item.children ? [item, ...item.children] : item))
      .find((item) => location.pathname.includes(item.route));

    if (matchedItem) {
      setSelectKey(matchedItem.key);
    } else {
      setSelectKey(null);
    }
  }, [location.pathname, menuItems]);

  const handleMenuClick = (val) => {
    setSelectKey(val.key);

    const selectedItem = menuItems.find((item) => item.key === val.key);
    if (selectedItem) {
      navigate(selectedItem.route);
    }
  };

  const handleLogout = async () => {
    dispatch(logOut());
  };

  useEffect(() => {
    const handleResize = () => {
      setContainerHeight(window.innerHeight - 80);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full max-w-screen min-h-screen h-full flex items-center justify-start overflow-hidden">
      <div
        className={`${
          collapsed ? "w-[82px]" : "w-[270px]"
        } min-h-dvh bg-colorSelected border-r-[2px] shadow-md relative transition-all duration-300 ease-in-out z-10`}
      >
        <div
          className={`flex flex-col items-center justify-center gap-1 ${
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
            className="-mr-4"
            onClick={toggleCollapsed}
          />
        </div>

        {/* 👇 show items based on role */}
        <Menu
          className="font-medium [&_.ant-menu-item-selected]:!bg-[#F1F5F9]"
          selectedKeys={[selecteKey]}
          onSelect={handleMenuClick}
          mode="inline"
          inlineCollapsed={collapsed}
          items={menuItems}
        />

        <div className="h-[30px] flex items-center justify-center absolute bottom-20 w-full">
          {/* <MainButton
            buttonText="Logout"
            height="35px"
            width="50%"
            minWidth="120px"
            type="primary"
            color="#ffffff"
            paddingY="6px"
            icon={<CiLogout size={18} />}
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
          /> */}

          <div
            className="flex items-center justify-center gap-2 cursor-pointer py-2 px-4 text-black border border-gray-300 rounded-lg absolute bottom-20"
            onClick={handleLogout}
          >
            <CiLogout size={20} />
            {collapsed ? true : <span>Logout</span>}
          </div>
        </div>
      </div>

      {/* main right side */}
      <div className="w-full min-w-0 min-h-dvh max-h-dvh bg-colorBackground flex-1 flex-col justify-start items-center">
        <MainHeader
          openPopover={openUserMenu}
          onOpenChange={() => setOpenUserMenu(!openUserMenu)}
        />

        <div
          className="w-full flex flex-col items-center justify-start px-2 pb-2 overflow-auto scroll bg-[#F1F5F9]"
          style={{ minHeight: containerHeight, maxHeight: containerHeight }}
        >
          <div className="w-full flex-col items-center justify-start sm:w-[90%] lg:w-[95%]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
