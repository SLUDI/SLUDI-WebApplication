import { Button, Input, Tooltip, Typography } from "antd";
import { useState } from "react";
import MainButton from "../../components/baseComponents/button/MainButton";
import { Edit, Eye, Trash2 } from "lucide-react";
import Create from "./features/Create";
import { useAllOrganization } from "../../hooks/organization";
const { Search } = Input;
const Text = Typography;
const posts = [
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
  {
    id: "0001",
    sector: "Security",
    type: "Government",
    email: "Personal@gmail.com",
  },
];
const Organization = () => {
  const [isLoading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: organizationData, isError, error } = useAllOrganization();

  console.log(organizationData);

  return (
    <>
      <div className="p-6 max-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Organization Management
          </h1>
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
          >
            Create Organization
          </button>
        </div>
        <div className="flex flex-row items-center ">
          <div className="w-[25%]">
            <Search
              placeholder="Search by ID or Name"
              style={{ maxWidth: "100%" }}
              size="large"
              className="mb-2 h-10"
              enterButton={
                <button className="bg-[#13A4B4] hover:bg-[#7c9ece] text-white px-4  rounded-[0px_10px_10px_0px] h-10">
                  Search
                </button>
              }
            />
          </div>
          <div>
            <div className="mt-[-8px] ml-4 text-[#000000] font-bold">
              Total Records : 3
            </div>
          </div>
        </div>
        <div className="p-6  max-h-screen">
          <div className="w-full  sm:w-full  rounded-xl py-8 px-2 ssm:px-3 sm:px-4 lg:px-8  bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between">
            {!isLoading && (
              <div className="w-full overflow-auto scroll">
                {/* header */}
                {posts?.length > 0 && (
                  <div className="w-full min-w-[700px] grid grid-cols-24 rounded-t-xl ">
                    <div className="col-span-4 flex items-center justify-start p-3 h-[40px] rounded-tl-lg">
                      <Tooltip title="Post title">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Registration No
                        </Text>
                      </Tooltip>
                    </div>
                    <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                      <Tooltip title="Type">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Sector
                        </Text>
                      </Tooltip>
                    </div>
                    <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                      <Tooltip title="Date">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Organization Type
                        </Text>
                      </Tooltip>
                    </div>
                    <div className="col-span-6  h-[40px] flex items-center justify-start p-3">
                      <Tooltip title="Status">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Email
                        </Text>
                      </Tooltip>
                    </div>

                    <div className="col-span-6 h-[40px] flex items-center justify-center p-3 rounded-tr-lg">
                      <Tooltip title="Action">
                        <Text className="t-16 font-bold pr-[1px] truncate">
                          Action
                        </Text>
                      </Tooltip>
                    </div>
                  </div>
                )}
                {/* data */}
                {posts?.length > 0 ? (
                  <div
                    className="w-full  min-w-[700px] space-y-2 mt-4"
                    //style={{ height: `${window.innerHeight - 350}px` }}
                  >
                    {posts.map((post, index) => {
                      return (
                        <div
                          key={index}
                          className="w-full grid grid-cols-24  pt-1  bg-white rounded-xl   "
                        >
                          <div className="col-span-4 flex items-center justify-start p-3 h-[40px]">
                            <Tooltip title={post?.id}>
                              <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                                {post?.id}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={post?.sector}>
                              <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                                {post?.sector}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={post?.type}>
                              <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                                {post?.type}
                              </Text>
                            </Tooltip>
                          </div>
                          <div className="col-span-6  h-[40px] flex items-center justify-start p-3">
                            <Tooltip title={post?.email}>
                              <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                                {post?.email}
                              </Text>
                            </Tooltip>
                          </div>

                          <div className="col-span-6 h-[45px] flex items-center justify-center p-3 rounded-tr-lg gap-4">
                            {/* <MainButton
                            buttonText={"Register"}
                            height={"30px"}
                            width={"20%"}
                            minWidth="63px"
                            type="primary"
                            color="#ffffff"
                            paddingY="2px"
                            htmlType={"submit"}
                            // onClick={() => {
                            //   navigate("/personalDetails");
                            // }}
                            // onClick={() => {
                            //   navigate(`/personalDetails/${post?.userId}`); // or post?.userId depending on API
                            // }}
                          />
                          <MainButton
                            buttonText={"Register"}
                            height={"30px"}
                            width={"20%"}
                            minWidth="63px"
                            type="primary"
                            color="#ffffff"
                            paddingY="2px"
                            htmlType={"submit"}
                            // onClick={() => {
                            //   navigate("/personalDetails");
                            // }}
                            // onClick={() => {
                            //   navigate(`/personalDetails/${post?.userId}`); // or post?.userId depending on API
                            // }}
                          /> */}
                            <Button
                              className="text-gray-700 hover:text-cyan-600 transition duration-200"
                              title="View"
                            >
                              <Eye size={20} />
                            </Button>
                            <Button
                              className="text-gray-700 hover:text-red-600 transition duration-200"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </Button>
                            <Button
                              className="text-gray-700 hover:text-blue-600 transition duration-200"
                              title="Edit"
                            >
                              <Edit size={20} />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full  flex flex-col flex-1 items-center justify-center">
                    <NoPostImg className="w-[50%] xl:w-[35%] mb-1 h-[300px]" />
                    <div
                      className={`flex flex-col gap-1 items-center justify-center`}
                    >
                      <Text className="font-semibold t-16">
                        No Request data
                      </Text>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {open && (
        <Create
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};
export default Organization;
