import React, {Fragment, useState, useEffect, useRef} from "react";
import {
  Row,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggl,
  Container,
  Col,
  Media,
  FormGroup,
  Progress,
  CardTitle,
  Label,
  Button
} from "reactstrap";
import {v4 as uuidv4} from "uuid";

import moment from "moment";

import "../style.css"; // Tell webpack that Button.js uses these styles
import "../info.css";
import "../../assets/css/sass/_gogo.style.scss";
import styled from "styled-components";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

import Axios from "axios";

const Home = ({todo, setTodo, saveTodo, deleteTodo, updateTodo}) => {
  const [totoMsg, setTotoMsg] = useState(null);
  const [editMode, setEditMode] = useState(-1);

  const inputField = useRef();
  const inputEditField = useRef();

  return (
    <div style={{padding: 20}}>
      <h2>My Todo List</h2>
      <div>
        <input
          placeholder={"Add todo item here"}
          ref={inputField}
          onChange={text => {
            const newTodo = {
              date: new Date().toString(),
              message: text.target.value
            };
            setTotoMsg(newTodo);
          }}
          className="form-control"
        />
        <Button
          onClick={() => {
            // setTodo([...todo, totoMsg]);
            inputField.current.value = "";
            saveTodo(totoMsg);
          }}
          style={{margin: 10, width: 100}}
        >
          Save
        </Button>
      </div>
      {todo && todo.length > 0
        ? todo.map((res, index) => {
            return (
              <div key={uuidv4()}>
                <Card style={{margin: 5, padding: 5}}>
                  <div style={{color: "blue"}}>
                    {" "}
                    {res.date ? moment(res.date).fromNow() : ""}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%"
                    }}
                  >
                    <div style={{fontWeight: "bold"}}>{`${index + 1} : `}</div>
                    {editMode == index ? (
                      <input
                        style={{
                          width: "70%"
                        }}
                        placeholder={res.message}
                        ref={inputEditField}
                        className="form-control"
                      />
                    ) : (
                      <div>{res.message}</div>
                    )}
                    {editMode == index ? (
                      <>
                        <i
                          onClick={() => {
                            // setTodo([...todo, totoMsg]);
                            updateTodo({
                              ...res,
                              message: inputEditField.current.value
                            });
                            inputEditField.current.value = "";
                            setEditMode(-1);
                          }}
                          style={styleInfo.buttonStyle}
                          className={"fa fa-save"}
                        />
                        <i
                          onClick={() => {
                            setEditMode(-1);
                          }}
                          style={styleInfo.buttonStyle}
                          className={"fa fa-window-close"}
                        />
                      </>
                    ) : (
                      <>
                        <i
                          onClick={() => {
                            setEditMode(editMode == index ? -1 : index);
                          }}
                          style={styleInfo.buttonStyle}
                          className={"fa fa-edit"}
                        />
                        <i
                          onClick={() => {
                            deleteTodo(res._id);
                          }}
                          style={styleInfo.buttonStyle}
                          className={"fa fa-trash-alt"}
                        />
                      </>
                    )}
                  </div>
                </Card>
              </div>
            );
          })
        : null}
    </div>
  );
};

const styleInfo = {
  buttonStyle: {
    marginLeft: 10
  },
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

export default Home;
