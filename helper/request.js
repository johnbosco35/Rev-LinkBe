const axios = require("axios");
const logger = require("./logger");

class CoreApiRequest {
  constructor() {
    this.url = process.env.CORE_API_URL;
    this.token = process.env.CORE_API_TOKEN;
  }

  async performHttpRequest(payload) {
    try {
      const { data } = await axios.post(this.url, payload, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      logger.error(error.message);
    }
  }

  async performHttpRequestWithFile(payload) {
    try {
      const { data } = await axios.post(this.url, payload, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    } catch (error) {
      logger.error(error.message);
    }
  }
}

module.exports = CoreApiRequest;
