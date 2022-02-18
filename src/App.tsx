import classNames from "classnames";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import styles from "./styles.module.scss";

enum STATUS {
  OPEN = 0,
  COMPLETED = 1,
}

function App() {
  const [todos, setTodos] = useState([
    { id: 1, name: 'Say: "Hello world!"', status: STATUS.OPEN },
    { id: 2, name: "Have a nice day!", status: STATUS.COMPLETED },
  ]);

  const getStatus = () => {
    return todos.every((item) => item.status === STATUS.COMPLETED);
  };
  const [checkedAll, setCheckedAll] = useState(getStatus());
  const [status, setStatus] = useState<STATUS | undefined>();

  const handleCheckedItem = (e: ChangeEvent<HTMLInputElement>, id: number) => {
    const item = todos.find((el) => el.id === id);
    if (item) {
      item.status = Number(e.target.checked);
      setTodos([...todos]);
    }
    setCheckedAll(getStatus());
  };

  const handleCheckedAll = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setTodos(todos.map((item) => ({ ...item, status: Number(isChecked) })));
    setCheckedAll(isChecked);
  };

  const removeItem = (id: number) => () => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const addItem = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const name = e.currentTarget.value.trim();
      if (!name) return;
      setTodos([...todos, { id: Date.now(), name: name, status: STATUS.OPEN }]);
      e.currentTarget.value = "";
    }
  };

  const getTodos = (status?: STATUS) => {
    if (status === STATUS.OPEN)
      return todos.filter((item) => item.status === STATUS.OPEN);
    if (status === STATUS.COMPLETED)
      return todos.filter((item) => item.status === STATUS.COMPLETED);
    return todos;
  };

  return (
    <div className={styles.TodoWrapper}>
      <div className={styles.TodoApp}>
        <header className={styles.Header}>Todos</header>
        <section className={styles.Main}>
          <div className={styles.NewTodo}>
            <div className="TextBoxWrapper">
              <input
                type="checkbox"
                checked={checkedAll}
                onChange={handleCheckedAll}
              />
            </div>
            <input
              type="text"
              className={styles.NewTodoInput}
              placeholder="What needs to be done?"
              onKeyDown={(e) => addItem(e)}
            />
          </div>

          <ul className={styles.TodoList}>
            {getTodos(status).map((item) => (
              <li className={styles.ToDoItem} key={item.id}>
                <div
                  className={classNames(
                    styles.ToDoItemContainer,
                    item.status ? styles.LineThrough : ""
                  )}
                >
                  <div className={styles.TextBoxWrapper}>
                    <input
                      type="checkbox"
                      name={String(item.id)}
                      checked={Boolean(item.status)}
                      onChange={(e) => {
                        handleCheckedItem(e, item.id);
                      }}
                    />
                  </div>
                  <div className={item.status ? styles.ToDoItemCompleted : ""}>
                    {item.name}
                  </div>
                </div>
                <div
                  className={styles.DestroyItem}
                  onClick={removeItem(item.id)}
                >
                  X
                </div>
              </li>
            ))}
          </ul>
          {!!todos.length && (
            <footer className={styles.Footer}>
              <div className={styles.TodoCount}>
                {getTodos(STATUS.OPEN).length > 1
                  ? getTodos(STATUS.OPEN).length + " items left"
                  : getTodos(STATUS.OPEN).length + " item left"}
              </div>
              <ul className={styles.Filter}>
                <li
                  className={classNames(
                    styles.FilterAll,
                    status === undefined ? styles.Active : ""
                  )}
                  onClick={() => setStatus(undefined)}
                >
                  All
                </li>
                <li
                  className={classNames(
                    styles.FilterOPEN,
                    status === STATUS.OPEN ? styles.Active : ""
                  )}
                  onClick={() => setStatus(STATUS.OPEN)}
                >
                  Open
                </li>
                <li
                  className={classNames(
                    styles.FilterCompleted,
                    status === STATUS.COMPLETED ? styles.Active : ""
                  )}
                  onClick={() => setStatus(STATUS.COMPLETED)}
                >
                  Completed
                </li>
              </ul>
            </footer>
          )}
        </section>
      </div>

      <footer>
        <div>Simple todo app </div>
        <div>
          <a >Github repo</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
