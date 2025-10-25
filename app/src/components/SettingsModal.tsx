import React from "react";
import type { PageDef, ButtonItem } from "../types";
import { useAppStore } from "../store/useAppStore";
import { addAsset, removeAsset, db } from "../store/db";

type Props = {
  page: PageDef;
  onClose: () => void;
};

export default function SettingsModal({ page, onClose }: Props) {
  const { pages, updatePage, addButton, updateButton, removeButton, addPage, setPassword, password } = useAppStore();
  const [authorized, setAuthorized] = React.useState(false);
  const [pwInput, setPwInput] = React.useState("");
  const [closeAt, setCloseAt] = React.useState<number | null>(null);
  const [draftPage, setDraftPage] = React.useState<PageDef>(page);
  const [newPageTitle, setNewPageTitle] = React.useState("");
  const [newPageSlug, setNewPageSlug] = React.useState("");
  const [newPageCols, setNewPageCols] = React.useState(2);
  const [newPageRows, setNewPageRows] = React.useState(2);
  const [newPageBg, setNewPageBg] = React.useState(page.bgColor);

  // Auto close after 30 seconds
  React.useEffect(() => {
    if (!authorized) return;
    const t = setTimeout(onClose, 30000);
    setCloseAt(Date.now() + 30000);
    return () => clearTimeout(t);
  }, [authorized, onClose]);

  const remainingMs = closeAt ? Math.max(closeAt - Date.now(), 0) : 0;

  const tryAuth = () => {
    if (pwInput === password) setAuthorized(true);
    else alert("Wrong password.");
  };

  const saveChanges = () => {
    if (!confirm("Save changes?")) return;
    updatePage(page.id, {
      title: draftPage.title,
      bgColor: draftPage.bgColor,
      grid: draftPage.grid,
      buttons: draftPage.buttons
    });
    onClose();
  };

  const addNewButton = () => {
    const btn: ButtonItem = {
      id: "btn_" + Math.random().toString(36).slice(2, 8),
      type: "audio",
      label: "New",
      colSpan: 1
    };
    setDraftPage({ ...draftPage, buttons: [...draftPage.buttons, btn] });
  };

  const createPage = () => {
    if (!newPageTitle || !newPageSlug) {
      alert("Title and slug are required");
      return;
    }
    const newPage: PageDef = {
      id: newPageSlug.replace(/^\/+/, "").replace(/\s+/g, "-"),
      slug: `/p/${newPageSlug.replace(/^\/+/, "").replace(/\s+/g, "-")}`,
      title: newPageTitle,
      bgColor: newPageBg,
      grid: { cols: newPageCols, rows: newPageRows },
      buttons: []
    };
    addPage(newPage);
    alert("Page created. You can link buttons to it now.");
  };

  const uploadAssets = async (type: "audio" | "image", files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      await addAsset(type, f);
    }
    alert("Uploaded.");
  };

  if (!authorized) {
    return (
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
          <div className="flex items-center justify-between mb-4">
            <button className="text-sm px-3 py-1 rounded-full bg-gray-100" onClick={onClose}>Close</button>
            <div className="font-poppins font-bold">Enter Password</div>
          </div>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="123"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-brand text-white rounded-lg" onClick={tryAuth}>Open Settings</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-50 m-auto bg-white w-[95%] max-w-5xl rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-3 border-b">
          <button className="text-sm px-3 py-1 rounded-full bg-gray-100" onClick={onClose}>Close</button>
          <div className="font-poppins font-bold">Settings ({Math.ceil(remainingMs / 1000)}s)</div>
          <button className="px-3 py-1 rounded-full bg-brand text-white" onClick={saveChanges}>Save</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Page settings */}
          <div className="md:col-span-1 space-y-3">
            <div>
              <div className="font-semibold mb-1">Page Title</div>
              <input
                className="w-full border rounded px-3 py-2"
                value={draftPage.title}
                onChange={(e) => setDraftPage({ ...draftPage, title: e.target.value })}
              />
            </div>
            <div>
              <div className="font-semibold mb-1">Background Color</div>
              <input
                type="color"
                className="w-16 h-10 border rounded"
                value={draftPage.bgColor}
                onChange={(e) => setDraftPage({ ...draftPage, bgColor: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="font-semibold mb-1">Columns</div>
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="w-full border rounded px-3 py-2"
                  value={draftPage.grid.cols}
                  onChange={(e) => setDraftPage({ ...draftPage, grid: { ...draftPage.grid, cols: Number(e.target.value) } })}
                />
              </div>
              <div>
                <div className="font-semibold mb-1">Rows</div>
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="w-full border rounded px-3 py-2"
                  value={draftPage.grid.rows}
                  onChange={(e) => setDraftPage({ ...draftPage, grid: { ...draftPage.grid, rows: Number(e.target.value) } })}
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="font-semibold mb-1">Change Password</div>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                placeholder="New password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Buttons list */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Buttons</div>
              <button className="px-3 py-1 bg-gray-100 rounded" onClick={addNewButton}>+ Add Button</button>
            </div>
            <div className="space-y-2 max-h-[50vh] overflow-auto">
              {draftPage.buttons.map((b, idx) => (
                <div key={b.id} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{b.label}</div>
                    <button
                      className="text-sm px-2 py-1 rounded bg-red-100"
                      onClick={() => setDraftPage({ ...draftPage, buttons: draftPage.buttons.filter(x => x.id !== b.id) })}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-xs block mb-1">Label</label>
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={b.label}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, label: e.target.value };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Type</label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={b.type}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, type: e.target.value as "audio" | "link" };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      >
                        <option value="audio">Audio</option>
                        <option value="link">Link</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Col Span</label>
                      <input
                        type="number"
                        min={1}
                        max={draftPage.grid.cols}
                        className="w-full border rounded px-2 py-1"
                        value={b.colSpan ?? 1}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, colSpan: Number(e.target.value) };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Link Page</label>
                      <select
                        className="w-full border rounded px-2 py-1"
                        value={b.linkPageId ?? ""}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          buttons[idx] = { ...b, linkPageId: e.target.value || undefined, type: "link" };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      >
                        <option value="">(none)</option>
                        {pages.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Audio Asset</label>
                      <input
                        type="number"
                        placeholder="asset id"
                        className="w-full border rounded px-2 py-1"
                        value={b.audioAssetId ?? ""}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          const v = e.target.value ? Number(e.target.value) : undefined;
                          buttons[idx] = { ...b, audioAssetId: v, type: "audio" };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs block mb-1">Image Asset</label>
                      <input
                        type="number"
                        placeholder="asset id"
                        className="w-full border rounded px-2 py-1"
                        value={b.imageAssetId ?? ""}
                        onChange={(e) => {
                          const buttons = draftPage.buttons.slice();
                          const v = e.target.value ? Number(e.target.value) : undefined;
                          buttons[idx] = { ...b, imageAssetId: v };
                          setDraftPage({ ...draftPage, buttons });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assets & New Page */}
          <div className="md:col-span-1 space-y-4">
            <div>
              <div className="font-semibold mb-2">Upload Audio</div>
              <input type="file" accept="audio/*" multiple onChange={(e) => uploadAssets("audio", e.target.files)} />
            </div>
            <div>
              <div className="font-semibold mb-2">Upload Image</div>
              <input type="file" accept="image/*" multiple onChange={(e) => uploadAssets("image", e.target.files)} />
            </div>
            <div className="border rounded-lg p-3">
              <div className="font-semibold mb-2">Create New Page</div>
              <input
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="Title"
                value={newPageTitle}
                onChange={(e) => setNewPageTitle(e.target.value)}
              />
              <input
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="slug (e.g., art-2)"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="cols"
                  value={newPageCols}
                  onChange={(e) => setNewPageCols(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-2 py-1"
                  placeholder="rows"
                  value={newPageRows}
                  onChange={(e) => setNewPageRows(Number(e.target.value))}
                />
              </div>
              <div className="mb-2">
                <label className="text-xs block mb-1">Background</label>
                <input type="color" value={newPageBg} onChange={(e) => setNewPageBg(e.target.value)} />
              </div>
              <button className="px-3 py-2 bg-gray-100 rounded" onClick={createPage}>Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}