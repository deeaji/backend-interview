import axios from "axios";

export default {
  axiosQuery: async myRequest => {
    const {request, resource, id, keyName, check, query} = myRequest;

    // console.log('myRequest',myRequest)
    var getURL = window.location.href;
    var baseURL =
      getURL && getURL.includes("http://localhost")
        ? "http://localhost:3000"
        : "http://testapp-env.eba-24qbyybp.us-east-2.elasticbeanstalk.com";
    var orderBy = "asc";
    var url = "";
    var data = {};
    var timestamp = `${new Date().getTime()}`;
    var method = "post";
    var route = "";

    if (request == "read" || request == "get") {
      url = `${baseURL}${"/myapp/findall?doc="}${resource}`;
      data = {};
      method = "GET";
    } else if (request == "search") {
      url = `${baseURL}/myapp/search`;
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    } else if (request == "insert") {
      //insert
      url = `${baseURL}/myapp/update`;
      // url = 'http://localhost:5000/myapp/update'
      data = {
        key: check, //where user_id and item_id values does not exist
        doc: resource,
        data: [query ? query : {}]
      };
      // console.log('ZZxxxx',data)
      method = "POST";
    } else if (request == "patch") {
      //edit
      url = `${baseURL}/myapp/update`;
      data = {
        key: check,
        doc: resource,
        data: [query ? query : {}]
      };
      method = "post";
    } else if (request == "delete") {
      url = `${baseURL}${"/myapp/delete?id="}${id}&doc=${resource}`;
      data = {};
      method = "DELETE";
    } else if (request == "upload") {
      url = `${baseURL}/myapp/upload`;
      data = {
        doc: resource,
        data: [query ? query : {}]
      };
      method = "POST";
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions =
      method != "GET"
        ? {
            method: method,
            headers: myHeaders,
            body: raw,
            redirect: "follow"
          }
        : {
            method: method,
            headers: myHeaders,
            redirect: "follow"
          };

    var headers = {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Access-Control-Allow-Origin": "*"
    };
    if (method && method.toUpperCase() == "GET") {
      return axios.get(url, {headers: {"Access-Control-Allow-Origin": "*"}});
    } else {
      var instance = axios.create({});
      return instance({
        method: method.toUpperCase(),
        url: url,
        data: JSON.stringify(data),
        headers
      }).then(res => {
        // console.log('cccc',res)
        return res && res.data ? res.data : "";
      });
    }
  }
};

// export { axiosQuery };
