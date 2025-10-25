import { useEffect, useMemo, useState } from 'react';

// Minimal inline types — adjust to your needs or change to `any`
type ButtonType = 'audio' | 'link';

type Item = {
  id: string;
  label: string;
  type: ButtonType;
  audioUrl?: string;
  linkTo?: string;
  rowSpan?: number;
  colSpan?: number;
  imageUrl?: string;
};

type PageRef = { id: string; title: string };

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function SettingsModal(props: {
  onClose: () => void;

  // Optional — pass these if you want the modal to actually edit your real data
  pageTitle?: string;
  rows?: number;
  cols?: number;
  items?: Item[];
  allPages?: PageRef[];

  // Optional callbacks to persist changes (if not provided, the modal uses local-only state)
  onUpdateLayout?: (rows: number, cols: number) => void;
  onAddItem?: () => void;
  onUpdateItem?: (item: Item) => void;
  onDeleteItem?: (itemId: string) => void;
  onCreatePage?: (title: string, rows: number, cols: number) => string | void;

  // Password management (optional)
  password?: string; // default '123'
  onChangePassword?: (pw: string) => void;
}) {
  const {
    onClose,
    pageTitle = 'Settings',
    rows: rowsProp = 3,
    cols: colsProp = 3,
    items: itemsProp = [],
    allPages: allPagesProp = [],
    onUpdateLayout,
    onAddItem,
    onUpdateItem,
    onDeleteItem,
    onCreatePage,
    password: passwordProp = '123',
    onChangePassword,
  } = props;

  // Auth
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [autoCloseTimer, setAutoCloseTimer] = useState<number | null>(null);

  // Local drafts (used even if no callbacks are provided)
  const [rows, setRows] = useState<number>(rowsProp);
  const [cols, setCols] = useState<number>(colsProp);
  const [items, setItems] = useState<Item[]>(itemsProp);
  const [pw, setPw] = useState<string>(passwordProp);

  // Sync local drafts when props change
  useEffect(() => setRows(rowsProp), [rowsProp]);
  useEffect(() => setCols(colsProp), [colsProp]);
  useEffect(() => setItems(itemsProp), [itemsProp]);
  useEffect(() => setPw(passwordProp), [passwordProp]);

  // Auto-close after 30s once unlocked
  useEffect(() => {
    if (!authorized) return;
    const id = window.setTimeout(onClose, 30000);
    setAutoCloseTimer(id);
    return () => window.clearTimeout(id);
  }, [authorized, onClose]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const allPages = useMemo(() => allPagesProp, [allPagesProp]);

  // Actions (local + callback if provided)
  const handleLayoutChange = (nextRows: number, nextCols: number) => {
    setRows(nextRows);
    setCols(nextCols);
    onUpdateLayout?.(nextRows, nextCols);
  };

  const handleAddItem = () => {
    if (onAddItem) {
      onAddItem();
      return;
    }
    const newItem: Item = {
      id: Math.random().toString(36).slice(2),
      label: 'New Button',
      type: 'audio',
      audioUrl: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
      rowSpan: 1,
      colSpan: 1,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (updated: Item) => {
    onUpdateItem?.(updated);
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  };

  const handleDeleteItem = (id: string) => {
    onDeleteItem?.(id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleCreatePage = (title: string, r: number, c: number) => {
    const id = onCreatePage?.(title, r, c);
    if (!onCreatePage) {
      const generated = slugify(title || 'page-' + Math.random().toString(36).slice(2));
      alert(`Page created (demo): ${title || 'Untitled'} (id: ${generated})`);
      return generated;
    }
    if (typeof id === 'string' && id) {
      alert(`Page created: ${title || 'Untitled'} (id: ${id})`);
    }
    return id;
  };

  const handleAuthorize = () => {
    if (passwordInput === (passwordProp ?? '123')) {
      setAuthorized(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleClose = () => {
    if (autoCloseTimer) window.clearTimeout(autoCloseTimer);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl shadow-xl ring-1 ring-black/10"
        style={{ backgroundColor: '#C3B1E1' }} // light purple background
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10">
          <button
            className="text-sm px-3 py-2 rounded-md bg-white/70 hover:bg-white"
            onClick={handleClose}
          >
            ✕ Close
          </button>
          <div id="settings-title" className="font-semibold text-neutral-900">
            {pageTitle}
          </div>
          <div />
        </div>

        {!authorized ? (
          <div className="p-4 flex items-center gap-2">
            <input
              type="password"
              className="border rounded px-3 py-2 w-48 bg-white"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            <button
              className="px-3 py-2 rounded bg-[#9146FF] text-white"
              onClick={handleAuthorize}
            >
              Unlock
            </button>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-neutral-900">
            {/* Layout */}
            <section className="bg-white/60 rounded p-3">
              <h2 className="font-semibold mb-2">Layout</h2>
              <div className="flex items-center gap-3">
                <label className="text-sm">Rows</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="border rounded px-2 py-1 w-20 bg-white"
                  value={rows}
                  onChange={(e) =>
                    handleLayoutChange(
                      Math.max(1, Math.min(12, Number(e.target.value))),
                      cols
                    )
                  }
                />
                <label className="text-sm">Cols</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  className="border rounded px-2 py-1 w-20 bg-white"
                  value={cols}
                  onChange={(e) =>
                    handleLayoutChange(
                      rows,
                      Math.max(1, Math.min(12, Number(e.target.value)))
                    )
                  }
                />
              </div>
              <p className="text-xs mt-2 text-neutral-700">
                Tip: Keep rows/cols modest to avoid tiny buttons.
              </p>
            </section>

            {/* Buttons */}
            <section className="bg-white/60 rounded p-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold mb-2">Buttons</h2>
                <button
                  className="px-2 py-1 rounded bg-[#9146FF] text-white"
                  onClick={handleAddItem}
                >
                  + Add
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-auto pr-2">
                {items.length === 0 && (
                  <div className="text-sm text-neutral-700">No buttons yet.</div>
                )}
                {items.map((it) => (
                  <div key={it.id} className="border rounded p-2 bg-white/80">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs">Label</label>
                        <input
                          className="border rounded w-full px-2 py-1 bg-white"
                          value={it.label}
                          onChange={(e) => handleUpdateItem({ ...it, label: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs">Type</label>
                        <select
                          className="border rounded w-full px-2 py-1 bg-white"
                          value={it.type}
                          onChange={(e) =>
                            handleUpdateItem({ ...it, type: e.target.value as ButtonType })
                          }
                        >
                          <option value="audio">Audio</option>
                          <option value="link">Link</option>
                        </select>
                      </div>

                      {it.type === 'audio' ? (
                        <div className="col-span-2">
                          <label className="text-xs">Audio URL</label>
                          <input
                            className="border rounded w-full px-2 py-1 bg-white"
                            value={it.audioUrl || ''}
                            onChange={(e) => handleUpdateItem({ ...it, audioUrl: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div className="col-span-2">
                          <label className="text-xs">Link to Page</label>
                          {allPages.length > 0 ? (
                            <select
                              className="border rounded w-full px-2 py-1 bg-white"
                              value={it.linkTo || ''}
                              onChange={(e) => handleUpdateItem({ ...it, linkTo: e.target.value })}
                            >
                              <option value="">Select page</option>
                              {allPages.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.title} ({p.id})
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="border rounded w-full px-2 py-1 bg-white"
                              placeholder="Target page id"
                              value={it.linkTo || ''}
                              onChange={(e) => handleUpdateItem({ ...it, linkTo: e.target.value })}
                            />
                          )}
                        </div>
                      )}

                      <div>
                        <label className="text-xs">Row span</label>
                        <input
                          type="number"
                          min={1}
                          className="border rounded w-full px-2 py-1 bg-white"
                          value={it.rowSpan || 1}
                          onChange={(e) =>
                            handleUpdateItem({
                              ...it,
                              rowSpan: Math.max(1, Number(e.target.value)),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs">Col span</label>
                        <input
                          type="number"
                          min={1}
                          className="border rounded w-full px-2 py-1 bg-white"
                          value={it.colSpan || 1}
                          onChange={(e) =>
                            handleUpdateItem({
                              ...it,
                              colSpan: Math.max(1, Number(e.target.value)),
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button
                        className="text-sm px-2 py-1 rounded bg-red-500 text-white"
                        onClick={() => handleDeleteItem(it.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Create Page */}
            <section className="md:col-span-2 bg-white/60 rounded p-3">
              <h2 className="font-semibold mb-2">Create Page</h2>
              <CreatePageForm
                onCreate={(title, r, c) => handleCreatePage(title, r, c)}
              />
              <p className="text-xs mt-2 text-neutral-700">
                After creating a page, set a button Type=Link and choose the new page in “Link to Page”.
              </p>
            </section>

            {/* Password */}
            <section className="md:col-span-2 bg-white/60 rounded p-3">
              <h2 className="font-semibold mb-2">Password</h2>
              <PasswordForm
                current={pw}
                onChange={(next) => {
                  setPw(next);
                  onChangePassword?.(next);
                }}
              />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function CreatePageForm({
  onCreate,
}: {
  onCreate: (title: string, rows: number, cols: number) => void | string;
}) {
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="text-xs">Title</label>
        <input
          className="border rounded px-2 py-1 bg-white"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New page title"
        />
      </div>
      <div>
        <label className="text-xs">Rows</label>
        <input
          type="number"
          min={1}
          max={12}
          className="border rounded px-2 py-1 w-20 bg-white"
          value={rows}
          onChange={(e) => setRows(Math.max(1, Math.min(12, Number(e.target.value))))}
        />
      </div>
      <div>
        <label className="text-xs">Cols</label>
        <input
          type="number"
          min={1}
          max={12}
          className="border rounded px-2 py-1 w-20 bg-white"
          value={cols}
          onChange={(e) => setCols(Math.max(1, Math.min(12, Number(e.target.value))))}
        />
      </div>
      <button
        className="px-3 py-2 rounded bg-[#9146FF] text-white"
        onClick={() => {
          onCreate(title, rows, cols);
          setTitle('');
        }}
      >
        Create
      </button>
    </div>
  );
}

function PasswordForm({
  current,
  onChange,
}: {
  current: string;
  onChange: (pw: string) => void;
}) {
  const [pw, setPw] = useState(current);
  return (
    <div className="flex items-center gap-3">
      <input
        className="border rounded px-2 py-1 bg-white"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        type="password"
        placeholder="New password"
      />
      <button
        className="px-3 py-2 rounded bg-[#9146FF] text-white"
        onClick={() => onChange(pw)}
      >
        Save Password
      </button>
    </div>
  );
}