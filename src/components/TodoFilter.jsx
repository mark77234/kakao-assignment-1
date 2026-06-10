export default function TodoFilter({ currentFilter, onFilterChange }) {
  return (
    <section className="filter-section" aria-label="상태 필터">
      <div className="filter-tabs" role="tablist">
        {FILTER_OPTIONS.map((filterOption) => {
          const isActive = currentFilter === filterOption.value;

          return (
            <button
              key={filterOption.value}
              type="button"
              className={`filter-tab ${isActive ? "is-active" : ""}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentFilter(filterOption.value)}
            >
              {filterOption.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
