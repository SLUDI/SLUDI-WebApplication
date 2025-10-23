"use client";

import { useState } from "react";
import { Select, Button, Card, message, Spin } from "antd";
import dayjs from "dayjs";
import Sllogo from "../../assets/images/SLlogo";
import { useNavigate } from "react-router-dom";
import { useDateAvailability } from "../../hooks/idCreate";
import { useDispatch } from "react-redux";
import { setDate, setDistrict } from "../../redux/availableDateSlice";

const districts = [
  { id: 1, name: "Colombo District Office", location: "Colombo" },
  { id: 2, name: "Gampaha District Office", location: "Gampaha" },
  { id: 3, name: "Kalutara District Office", location: "Kalutara" },
  { id: 4, name: "Kandy District Office", location: "Kandy" },
  { id: 5, name: "Matale District Office", location: "Matale" },
  { id: 6, name: "Nuwara Eliya District Office", location: "Nuwara Eliya" },
  { id: 7, name: "Galle District Office", location: "Galle" },
  { id: 8, name: "Matara District Office", location: "Matara" },
  { id: 9, name: "Hambantota District Office", location: "Hambantota" },
  { id: 10, name: "Jaffna District Office", location: "Jaffna" },
  { id: 11, name: "Kilinochchi District Office", location: "Kilinochchi" },
  { id: 12, name: "Mannar District Office", location: "Mannar" },
  { id: 13, name: "Vavuniya District Office", location: "Vavuniya" },
  { id: 14, name: "Mullaitivu District Office", location: "Mullaitivu" },
  { id: 15, name: "Batticaloa District Office", location: "Batticaloa" },
  { id: 16, name: "Ampara District Office", location: "Ampara" },
  { id: 17, name: "Trincomalee District Office", location: "Trincomalee" },
  { id: 18, name: "Kurunegala District Office", location: "Kurunegala" },
  { id: 19, name: "Puttalam District Office", location: "Puttalam" },
  { id: 20, name: "Anuradhapura District Office", location: "Anuradhapura" },
  { id: 21, name: "Polonnaruwa District Office", location: "Polonnaruwa" },
  { id: 22, name: "Badulla District Office", location: "Badulla" },
  { id: 23, name: "Monaragala District Office", location: "Monaragala" },
  { id: 24, name: "Ratnapura District Office", location: "Ratnapura" },
  { id: 25, name: "Kegalle District Office", location: "Kegalle" },
];

export default function DigitalIdentityBookingPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(undefined);
  const [availableDates, setAvailableDates] = useState([]);
  const [showAppointments, setShowAppointments] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const {
    mutate: fetchDateAvailability,
    //data: availableDateData,
    isPending,
  } = useDateAvailability();

  const handleSearch = () => {
    if (!selectedDistrict) {
      message.warning("Please select a district first.");
      return;
    }

    fetchDateAvailability(
      { district: selectedDistrict, daysAhead: 30 },
      {
        onSuccess: (res) => {
          if (res?.data?.length > 0) {
            setAvailableDates(res.data);
            setShowAppointments(true);
          } else {
            message.info("No available dates found for this district.");
          }
        },
        onError: () => {
          message.error("Failed to load available dates.");
        },
      }
    );
  };

  const handleBookNow = (date) => {
    message.success(`Booking confirmed for ${selectedDistrict} on ${date}`);
    console.log(`Booking details: ${selectedDistrict}, ${date}`);

    dispatch(setDate(`${date}`));
    dispatch(setDistrict(`${selectedDistrict}`));

    navigate("/digitalIdentity/form");
  };

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Step 1: District Selection */}
        {!showAppointments && (
          <>
            {/* Title */}
            <div className="mb-12 flex flex-col items-center">
              <div className="mb-4">
                <Sllogo className="h-40 md:h-40 spin-vertical" />
              </div>
              <h1 className="text-center text-2xl font-semibold text-[#4a5568] md:text-3xl">
                Sri Lanka Digital Identity Registration
              </h1>
            </div>

            {/* Dropdown and Search */}
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-black">
                  District Name
                </label>
                <Select
                  placeholder="Select district"
                  size="large"
                  className="w-full"
                  value={selectedDistrict}
                  onChange={setSelectedDistrict}
                  options={districts.map((district) => ({
                    value: district.location,
                    label: district.location,
                  }))}
                />
              </div>

              <Button
                type="primary"
                size="large"
                onClick={handleSearch}
                loading={isPending}
                className="h-10 bg-[#6b7280] px-12 hover:bg-[#4b5563]"
              >
                Search
              </Button>
            </div>

            {/* District Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {districts.map((district) => (
                <Card
                  key={district.id}
                  className="flex flex-col shadow-sm transition-shadow hover:shadow-md"
                  bordered
                >
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-2 text-base font-semibold text-[#4a5568]">
                      {district.name}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-muted-foreground">
                      {district.location}
                    </p>
                    <Button
                      type="primary"
                      block
                      size="large"
                      loading={
                        isPending && selectedDistrict === district.location
                      }
                      onClick={() => {
                        setSelectedDistrict(district.location);
                        fetchDateAvailability(
                          { district: district.location, daysAhead: 30 },
                          {
                            onSuccess: (res) => {
                              if (res?.data?.length > 0) {
                                setAvailableDates(res.data);
                                setShowAppointments(true);
                              } else {
                                message.info(
                                  "No available dates found for this district."
                                );
                              }
                            },
                            onError: () => {
                              message.error("Failed to load available dates.");
                            },
                          }
                        );
                      }}
                      className="bg-[#007bff] hover:bg-[#0056b3]"
                    >
                      Select
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Show Available Appointment Dates */}
        {showAppointments && (
          <div className="mt-8">
            <h2 className="mb-6 text-xl font-semibold text-[#374151]">
              Available Dates for {selectedDistrict} District Office
            </h2>

            {isPending ? (
              <div className="flex justify-center py-10">
                <Spin size="large" />
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {availableDates.map((item) => {
                  const formatted = dayjs(item.date).format("dddd, MMM D");
                  const isSunday = dayjs(item.date).day() === 0;

                  const isUnavailable = item.fullyBooked || isSunday;

                  return (
                    <Card
                      key={item.date}
                      className={`flex flex-col items-center justify-center p-4 shadow-sm transition-shadow hover:shadow-md ${
                        isSunday ? "bg-gray-100" : ""
                      }`}
                      bordered
                    >
                      <p
                        className={`mb-2 text-lg font-medium ${
                          isSunday ? "text-red-500" : "text-[#374151]"
                        }`}
                      >
                        {formatted}
                      </p>

                      <p className="mb-4 text-sm text-gray-500">
                        {isSunday
                          ? "Sunday — Not Available for Booking"
                          : item.fullyBooked
                          ? "Fully Booked"
                          : `${item.availableSlots} slots available`}
                      </p>

                      <Button
                        type="primary"
                        size="large"
                        disabled={isUnavailable}
                        onClick={() => handleBookNow(item.date)}
                        className={
                          isUnavailable
                            ? "bg-gray-400 border-none"
                            : "bg-[#007bff] hover:bg-[#0056b3]"
                        }
                      >
                        {isSunday
                          ? "Unavailable"
                          : item.fullyBooked
                          ? "Unavailable"
                          : "Available"}
                      </Button>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="mt-8">
              <Button
                type="default"
                size="large"
                onClick={() => setShowAppointments(false)}
              >
                Back to Districts
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
