import React, { useState } from 'react';
import './Grid.scss';

function Grid({
  rows,
  columns,
  filters = {},
  onFilterChange,
  onSaveRow,
  onDeleteRow,
  onApplyRow,
  showEditActions = false,
  showApplyAction = false,
  appliedJobIds,
  onViewApplicants,
}) {
  const [editingId, setEditingId] = useState(null);
  const [updatedRow, setUpdatedRow] = useState({});

  const filtered = rows.filter((row) =>
    columns.every((col) =>
      String(row[col.key] || '')
        .toLowerCase()
        .includes((filters[col.key] || '').toLowerCase())
    )
  );

  const startEdit = (row) => {
    setEditingId(row.id);
    setUpdatedRow({ ...row, skills: (row.skills || []).join(', ') });
  };

  const saveEdit = () => {
    const payload = {
      ...updatedRow,
      skills: updatedRow.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    onSaveRow(editingId, payload);
    setEditingId(null);
  };

  return (
    <table className="grid">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>
              {col.label}
              <input
                className="col-filter"
                placeholder="Filter..."
                value={filters[col.key] || ''}
                onChange={(e) => onFilterChange(col.key, e.target.value)}
              />
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filtered.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {editingId === row.id && col.editable ? (
                  <input
                    value={updatedRow[col.key] || ''}
                    onChange={(e) =>
                      setUpdatedRow((prev) => ({
                        ...prev,
                        [col.key]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
            <td>
              {showEditActions && editingId !== row.id && (
                <button onClick={() => startEdit(row)}>Edit</button>
              )}
              {showEditActions && editingId === row.id && (
                <>
                  <button onClick={saveEdit}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              )}
              {showEditActions && (
                <button onClick={() => onDeleteRow(row.id)}>Delete</button>
              )}
              {showApplyAction &&
                (appliedJobIds?.has(row.id) ? (
                  <button disabled>Applied</button>
                ) : (
                  <button onClick={() => onApplyRow(row)}>Apply</button>
                ))}
              {onViewApplicants && (
                <button onClick={() => onViewApplicants(row)}>
                  View Applications
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Grid;
