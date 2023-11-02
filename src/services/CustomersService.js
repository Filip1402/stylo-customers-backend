const customersAPI = require("../utils/CommerceToolsApiClient");
const axios = require("axios");

const URL_GET_CUSTOMERS = `${customersAPI.apiURLBase}/${customersAPI.projectKey}/customers`;
const URL_LOGIN = `${customersAPI.apiURLBase}/${customersAPI.projectKey}/login`;

async function getAllCustomers() {
  try {
    const bearerToken = await customersAPI.getAccessToken();
    const response = await axios.get(URL_GET_CUSTOMERS, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    return response.data.results;
  } catch (err) {
    throw err;
  }
}

async function getCustomerByEmailAddress(email) {
  try {
    const bearerToken = await customersAPI.getAccessToken();
    const response = await axios.get(URL_GET_CUSTOMERS, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      params: {
        where: `email="${email}"`,
      },
    });
    return response.data.results;
  } catch (err) {
    throw err;
  }
}

async function loginCustomer(email, password) {
  try {
    const bearerToken = await customersAPI.getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const data = {
      email: email,
      password: password,
    };

    const response = await axios.post(URL_LOGIN, data, config);

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function registerCustomer(first_name, last_name, email, password, phone_number) {
  try {
    const bearerToken = await customersAPI.getAccessToken();
    const config = {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    const data = {
      email: email,
      firstName: first_name,
      lastName: last_name,
      password: password,
      custom: {
        type: {
          key: "customer-phoneNumber",
          typeId: "type"
        },
        fields: {
          phoneNumber: phone_number
        }
      }
    };

    const response = await axios.post(URL_GET_CUSTOMERS, data, config);

    return response.data;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  getAllCustomers,
  getCustomerByEmailAddress,
  loginCustomer,
  registerCustomer,
};
