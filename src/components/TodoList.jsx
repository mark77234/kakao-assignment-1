import TodoItem from "./TodoItem";

export default function TodoList({
  visibleTodos,
  emptyStateMessage,
  editingTodoId,
  editingText,
  onEditingTextChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onToggleTodo,
  onDeleteTodo,
}) {
  return (
    <section className="list-section" aria-label="Todo 목록">
      {visibleTodos.length === 0 ? (
        <p className="empty-state">{emptyStateMessage}</p>
      ) : (
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingTodoId === todo.id}
              editingText={editingText}
              onEditingTextChange={onEditingTextChange}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveEdit={onSaveEdit}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
