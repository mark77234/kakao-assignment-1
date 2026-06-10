export default function TodoItem({
  todo,
  isEditing,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleTodo,
  onDeleteTodo,
}) {
  return (
    <li className={`todo-item ${todo.isCompleted ? "is-completed" : ""}`}>
      {isEditing ? (
        <form
          className="edit-form"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const nextText = String(formData.get("editingText") ?? "");

            onSaveEdit(todo.id, nextText);
          }}
        >
          <label htmlFor={`edit-${todo.id}`} className="sr-only">
            Todo 수정
          </label>

          <input
            id={`edit-${todo.id}`}
            name="editingText"
            className="edit-input"
            type="text"
            value={editingText}
            autoComplete="off"
            onChange={(event) => onEditingTextChange(event.target.value)}
          />

          <div className="todo-actions">
            <button type="submit" className="todo-action-button">
              저장
            </button>

            <button
              type="button"
              className="todo-action-button secondary"
              onClick={onCancelEdit}
            >
              취소
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="todo-text">{todo.text}</p>

          <div className="todo-actions">
            <button
              type="button"
              className="todo-action-button"
              onClick={() => onToggleTodo(todo.id)}
            >
              {todo.isCompleted ? "복구" : "완료"}
            </button>

            <button
              type="button"
              className="todo-action-button secondary"
              onClick={() => onStartEdit(todo)}
            >
              수정
            </button>

            <button
              type="button"
              className="todo-action-button danger"
              onClick={() => onDeleteTodo(todo.id)}
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}
