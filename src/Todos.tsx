import React, { useEffect, useRef, useState } from 'react';
// import './App.css';
import { Input } from 'antd';

import { Row, Col } from 'antd';
import { Divider, List, Typography } from 'antd';

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

/*
  Todos is a locked component
  Which means that there is a passcode-entry system
  
*/

function Todos() {

  /*

  The following is related to the Lock component


  */

  const [lock, setLock] = useState(Math.floor((Math.random() * 1000)));
  const [key, setKey] = useState<number | undefined>(undefined);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    if (key == lock * (lock % 10) + 12) {
      if (isLocked) {
        setIsLocked(false);
        setTimeout(() => setLock(Math.floor((Math.random() * 1000))), 100000);
      }
    }
    else {
      setIsLocked(true);
    }
  });


  /*
  
  The following is related to the TODO component 
  
  */


  const [todos, setTodos] = useState<Array<string>>([]);
  const [archivedTodos, setArchivedTodos] = useState<Array<string>>([])

  useEffect(() => {
    fetch("/todo")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTodos(data["todos"]);
        setArchivedTodos(data["archived"]);
      }
      );
  }, []);

  const [ongoingArchivedToggle, setListToggle] = useState("ongoing");

  // to archive an ongoing todo
  // OR to unarchive an archived todo
  // @param: index i.e. index in corresp. list
  const archiveUnarchive = (index: number) => {
    debugger;
    if (ongoingArchivedToggle == "ongoing") {

      const todo = todos[index];

      fetch("/todo/archive", {
        method: 'POST',
        body: JSON.stringify([todo]),
        headers: {'Content-Type': 'application/json'}
      })
      .then(response => response.json())
      .then(_ => {
        setArchivedTodos([todo, ...archivedTodos]);
        setTodos(todos.filter((_, i) => i != index));  
      })
      .catch((err) => console.log(err));


      // fetch("/todo/archive")
    }
    else {
      // ongoingArchivedToggle == "archived"
      setTodos([archivedTodos[index], ...todos]);
      setArchivedTodos(archivedTodos.filter((_, i) => i != index));

    }
  }

  // to add a new todo
  // @param: item i.e. the string that will be added
  const addTodo = (item: string) => {
    // TODO: integrate with Redux/PWA/backend-server
    // Perhaps not Redux
    fetch("/todo/add", {
      method: 'POST',
      body: JSON.stringify([item]),
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(_ => setTodos([item, ...todos]))
    .catch((err) => console.log(err));
    ;
  }

  return isLocked ? <>
    <a target="_blank"> {lock} </a>
    <Input onPressEnter={(e) => {
      const target: any = e.target;
      const value = parseInt(target.defaultValue);
      setKey(value);
    }}

    />

  </> : (
    <div style={{ textAlign: "center" }}>
      <Row>
        <Col span={24}>
          <img src="/time.png" style={{ width: "50%" }} />
        </Col>
      </Row>
      <Row style={{ marginTop: 20, marginBottom: 20 }}>
        <Col span={12}>


          <a style={{ color: ongoingArchivedToggle == "ongoing" ? "grey" : "#1890FF" }} onClick={() => setListToggle("ongoing")}> Ongoing </a>

        </Col>
        <Col span={12}>


          <a style={{ color: ongoingArchivedToggle == "archived" ? "grey" : "#1890FF" }} onClick={() => setListToggle("archived")}> Archived </a>

        </Col>
      </Row>

      <Row style={{ marginBottom: 20 }}>

        <Col span={24}>
          <Input style={{ width: "80%" }} placeholder="Create a new entry" onPressEnter={(e) => {
            const target: any = e.target;
            const value = target.defaultValue;
            addTodo(value);
          }}
          />

        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <List
            header={<div style={{ float: "right" }}>{todos.length + " todos"}</div>}
            dataSource={ongoingArchivedToggle == "ongoing" ? todos : archivedTodos}
            renderItem={(item, index) => (
              <List.Item actions={[<a key="list-loadmore-edit" onClick={() => archiveUnarchive(index)}>{ongoingArchivedToggle == "ongoing" ? "Archive" : "Unarchive"} </a>]}>
                {/* TODO: mark those > 1 week */}
                <Typography.Text mark>Delayed</Typography.Text> &nbsp;
                {item}
              </List.Item>
            )}
          />
        </Col>
      </Row>

    </div>
  );
}

export default Todos;
