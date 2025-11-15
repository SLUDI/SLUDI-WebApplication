const endpoints = {
  REGISTER: "/api/did/register",
  CITIZEN_REGISTER: "/api/citizen-user/register",
  GET_ALL_PRIVACY: "/api/citizen-user/profiles",
  DATE_AVAILABILITY: "/api/appointments/availability",
  APPOINTMENTS: "/api/appointments",
  CREATE_ORGANIZATION: "/api/organization/create-organization",
  GET_ALL_ORGANIZATION: "/api/organization/",
  CREATE_TEMPLATE: "/api/permission-templates/create",
  LOGIN: "/api/organization-users/auth/login",
  CREATE_ORGANIZATION_USER: "/api/organization-users/register",
  ORGNIZATION_ROLE: "/api/organization-users/organization",
  GET_ALL_ORGANIZATION_USERS: "/api/organization-users/organization",
  ORGNIZATION_COUNT: "/api/organization-users/organization",
  ORGNIZATION_USER: "/api/organization-users",
};

export default endpoints;
