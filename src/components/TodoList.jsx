export default function TodoFilter() {
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
              onEditingTextChange={setEditingText}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
