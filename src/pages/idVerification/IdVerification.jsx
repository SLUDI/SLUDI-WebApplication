// import T from "../../components/baseComponents/text/T";
import { Button, Pagination, Tooltip, Typography } from "antd";
import NoPostImg from "../../assets/images/NoPostImg";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import MainButton from "../../components/baseComponents/button/MainButton";
import { useState } from "react";
import Verify from "./features/Verify";
const Text = Typography;
const posts = [
  {
    _Id: "1a2b3c4d5e",
    Name: "Alice Johnson",
    Email: "alice.johnson@example.com",
    Phone: "+1 555-1234",
    IdType: "Passport",
    Submitted: "2025-05-01",
  },
  {
    _Id: "2b3c4d5e6f",
    Name: "Bob Smith",
    Email: "bob.smith@example.com",
    Phone: "+1 555-5678",
    IdType: "Driver License",
    Submitted: "2025-05-02",
  },
  {
    _Id: "3c4d5e6f7g",
    Name: "Carol White",
    Email: "carol.white@example.com",
    Phone: "+1 555-9101",
    IdType: "National ID",
    Submitted: "2025-05-03",
  },
  {
    _Id: "4d5e6f7g8h",
    Name: "David Lee",
    Email: "david.lee@example.com",
    Phone: "+1 555-1122",
    IdType: "Passport",
    Submitted: "2025-05-04",
  },
  {
    _Id: "5e6f7g8h9i",
    Name: "Ella Brown",
    Email: "ella.brown@example.com",
    Phone: "+1 555-3344",
    IdType: "Driver License",
    Submitted: "2025-05-05",
  },
  {
    _Id: "1a2b3c4d5e",
    Name: "Alice Johnson",
    Email: "alice.johnson@example.com",
    Phone: "+1 555-1234",
    IdType: "Passport",
    Submitted: "2025-05-01",
  },
  {
    _Id: "2b3c4d5e6f",
    Name: "Bob Smith",
    Email: "bob.smith@example.com",
    Phone: "+1 555-5678",
    IdType: "Driver License",
    Submitted: "2025-05-02",
  },
  {
    _Id: "3c4d5e6f7g",
    Name: "Carol White",
    Email: "carol.white@example.com",
    Phone: "+1 555-9101",
    IdType: "National ID",
    Submitted: "2025-05-03",
  },
  {
    _Id: "4d5e6f7g8h",
    Name: "David Lee",
    Email: "david.lee@example.com",
    Phone: "+1 555-1122",
    IdType: "Passport",
    Submitted: "2025-05-04",
  },
  {
    _Id: "5e6f7g8h9i",
    Name: "Ella Brown",
    Email: "ella.brown@example.com",
    Phone: "+1 555-3344",
    IdType: "Driver License",
    Submitted: "2025-05-05",
  },
];

export default function IdVerification() {
  const [verify, setOpenVerify] = useState(false);
  //pagination
  const itemRender = (_, type, originalElement) => {
    if (type === "prev") {
      return (
        <a className="pr-2 t-13 flex items-center justify-center gap-2 text-colorDarkDarkGray">
          <span>
            <MdKeyboardArrowLeft className="text-[16px] " />
          </span>
          Previous
          <span>|</span>
        </a>
      );
    }
    if (type === "next") {
      return (
        <a className="pl-2 t-13 flex items-center justify-center gap-2 text-colorDarkDarkGray">
          <span>|</span>
          Next
          <span>
            <MdKeyboardArrowRight className="text-[16px] font-light" />
          </span>
        </a>
      );
    }
    return originalElement;
  };

  return (
    <>
      <div className="p-6  max-h-screen">
        <Text className="font-semibold min-w-fit t-36 ">Id verification</Text>
        <div className="w-full  sm:w-full  rounded-xl py-8 px-2 ssm:px-3 sm:px-4 lg:px-8 mt-4 bg-colorSelected gap-4 flex flex-col flex-1 items-center justify-between bg-[#CCCCCC]">
          <div className="w-full flex items-center gap-4">
            <Text className="t-23 font-bold text-black">
              Pending Verification Requests
            </Text>
          </div>

          <div className="w-full overflow-auto scroll">
            {/* header */}
            {posts?.length > 0 && (
              <div className="w-full min-w-[700px] grid grid-cols-24 rounded-t-xl bg-[#13A4B4]">
                <div className="col-span-5 xl:col-span-6 flex items-center justify-start p-3 h-[40px] rounded-tl-lg">
                  <Tooltip title="Post title">
                    <Text className="t-13 font-bold pr-[1px] truncate">
                      Name
                    </Text>
                  </Tooltip>
                </div>
                <div className="col-span-5 h-[40px] flex items-center justify-start p-3">
                  <Tooltip title="Type">
                    <Text className="t-13 font-bold pr-[1px] truncate">
                      Email
                    </Text>
                  </Tooltip>
                </div>
                <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                  <Tooltip title="Date">
                    <Text className="t-13 font-bold pr-[1px] truncate">
                      Phone
                    </Text>
                  </Tooltip>
                </div>
                <div className="col-span-4 xl:col-span-3 h-[40px] flex items-center justify-start p-3">
                  <Tooltip title="Status">
                    <Text className="t-13 font-bold pr-[1px] truncate">
                      ID Type
                    </Text>
                  </Tooltip>
                </div>

                <div className="col-span-4 h-[40px] flex items-center justify-center p-3">
                  <Tooltip title="Total reached">
                    <Text className="t-13 font-bold pr-[1px] truncate">
                      Submitted
                    </Text>
                  </Tooltip>
                </div>
                <div className="col-span-2 h-[40px] flex items-center justify-center p-3 rounded-tr-lg">
                  <Tooltip title="Action">
                    <Text className="t-13 font-bold pr-[1px] truncate">
                      Action
                    </Text>
                  </Tooltip>
                </div>
              </div>
            )}

            {/* data */}
            {posts?.length > 0 ? (
              <div
                className="w-full  min-w-[700px]"
                //style={{ height: `${window.innerHeight - 350}px` }}
              >
                {posts.map((post, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full grid grid-cols-24  pt-1  hover:bg-[#DFEFFF]  "
                    >
                      <div className="col-span-5 xl:col-span-6 flex items-center justify-start p-3 h-[40px]">
                        <Tooltip title={post?.Name}>
                          <Text className="t-13 font-bold pr-[1px] truncate text-colorDarkDarkGray">
                            {post?.Name}
                          </Text>
                        </Tooltip>
                      </div>
                      <div className="col-span-5 h-[40px] flex items-center justify-start p-3">
                        <Tooltip title={post?.Email}>
                          <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                            {post?.Email}
                          </Text>
                        </Tooltip>
                      </div>
                      <div className="col-span-4 h-[40px] flex items-center justify-start p-3">
                        <Tooltip title={post?.Phone}>
                          <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                            {post?.Phone}
                          </Text>
                        </Tooltip>
                      </div>
                      <div className="col-span-4 xl:col-span-3 h-[40px] flex items-center justify-start p-3">
                        <Tooltip title={post?.IdType}>
                          <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                            {post?.IdType}
                          </Text>
                        </Tooltip>
                      </div>

                      <div className="col-span-4 h-[40px] flex items-center justify-center p-3">
                        <Tooltip title={post?.Submitted}>
                          <Text className="t-13 font-bold pr-[1px] truncate  text-colorDarkDarkGray">
                            {post?.Submitted}
                          </Text>
                        </Tooltip>
                      </div>
                      <div className="col-span-2 h-[45px] flex items-center justify-center p-3 rounded-tr-lg">
                        <MainButton
                          buttonText={"Check"}
                          height={"30px"}
                          width={"20%"}
                          minWidth="63px"
                          type="primary"
                          color="#ffffff"
                          paddingY="2px"
                          htmlType={"submit"}
                          onClick={() => {
                            setOpenVerify(true);
                          }}
                        />
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
                  <Text className="font-semibold t-16">No Request data</Text>
                </div>
              </div>
            )}
          </div>
          {posts?.length > 0 && (
            <Pagination
              current={Number(1)}
              total={Number(5) * 10 || 0}
              pageSize={10}
              itemRender={itemRender}
              align="center"
              size="small"
              // onChange={(page) => {
              //   setNewFilters({
              //     page: page,
              //   });
              //   setPosts([]); // Clear posts for the new page
              //   setMoreLoading(true);
              // }}
            />
          )}
        </div>
      </div>
      {verify && (
        <Verify
          open={verify}
          onCancel={() => {
            setOpenVerify(false);
          }}
        />
      )}
    </>
  );
}
