export default function TodoInput({
  todoInput,
  message,
  onTodoInputChange,
  onAddTodo,
  onTodoInputKeyDown,
}) {
  return (
    <section className="input-section" aria-label="Todo 추가">
      <form className="input-row" onSubmit={onAddTodo}>
        <label htmlFor="todo-input" className="sr-only">
          할 일 입력
        </label>
        <input
          id="todo-input"
          name="todoText"
          type="text"
          value={todoInput}
          placeholder="할 일을 입력하세요"
          autoComplete="off"
          onChange={(event) => onTodoInputChange(event.target.value)}
          onKeyDown={onTodoInputKeyDown}
        />
        <button type="submit" className="primary-button">
          추가
        </button>
      </form>
      <p className="input-message" role="alert" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
