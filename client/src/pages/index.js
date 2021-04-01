import React, {useState, useEffect, useRef} from "react";
import {Container, Row, Col, Media, FormGroup} from "reactstrap";
import RESTCall from "../redux/actions/restApi";
import moment from "moment";
import {v4 as uuidv4} from "uuid";

import ReactPlayer from "react-player";
import "./style.css"; // Tell webpack that Button.js uses these styles
import Cards, {Card} from "react-swipe-card";
import CommentsBlock from "simple-react-comments";
import MobileViewComp from "./interview";

import {connect} from "react-redux";
import {handleQuery, generalSuccess} from "../redux/actions/keyInfoActions";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import "./info.css";

const Home = ({info, onHandleQuery}) => {
  const [height, setWindowHeight] = useState(window.innerHeight + "px");
  const [width, setWindowWidth] = useState(window.innerWidth + "px");
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    const formData4 = {
      request: "get",
      resource: "todo_table"
    };
    onHandleQuery(formData4);
  }, []);

  useEffect(() => {
    const record =
      info &&
      info["todo_list"] &&
      info["todo_list"].response &&
      info["todo_list"].response.data;

    if (record) {
      const result =
        record && record.length > 0
          ? record.sort(function(a, b) {
              return a.date > b.date ? -1 : 1;
            })
          : [];
      setTodo([...result]);
    }
  }, [info]);

  const saveTodo = e => {
    if (e["_id"]) {
      delete e._id;
    }
    e["installId"] = uuidv4();
    const todoMessage = {
      request: "insert",
      query: e,
      resource: "todo_table",
      check: ["date"]
    };
    onHandleQuery(todoMessage);

    const formData4 = {
      request: "get",
      resource: "todo_table"
    };
    onHandleQuery(formData4);
  };

  const updateTodo = e => {
    if (e["_id"]) {
      delete e._id;
    }
    const todoMessage = {
      request: "insert",
      query: e,
      resource: "todo_table",
      check: ["date", "installId"]
    };
    onHandleQuery(todoMessage);
    const formData4 = {
      request: "get",
      resource: "todo_table"
    };
    onHandleQuery(formData4);
  };

  const deleteTodo = id => {
    if (id) {
      const formData = {
        request: "delete",
        query: {},
        resource: "todo_table",
        id: id
      };
      RESTCall.axiosQuery(formData).then(response => {
        const formData4 = {
          request: "get",
          resource: "todo_table"
        };
        onHandleQuery(formData4);
      });
    } else {
      alert("Comment id not available");
    }
  };

  return (
    <React.Fragment>
      <MobileViewComp
        setTodo={setTodo}
        todo={todo}
        saveTodo={saveTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        height={height}
        width={width}
      />{" "}
    </React.Fragment>
  );
};

const styleInfo = {
  wrapPadMyText: {
    margin: 10,
    paddingTop: 60,
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  },
  wrapMyText: {
    fontSize: 10,
    color: "white",
    overflowWrap: "break-word",
    wordWrap: "break-word",
    hyphens: "auto"
  }
};

const mapStateToProps = (state, ownProps) => {
  const storeData = state;
  return {
    info: storeData.keyInfo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHandleQuery: formData => {
      dispatch(handleQuery(formData));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
