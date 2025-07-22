import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import {
  collection,
  addDoc,
  serverTimestamp,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import type { CommentModel } from '@model/Passenger';

export default function CommentsSection({
  comments,
  commentType,
  onCommentAdded,
  onCommentDeleted,
  onCommentUpdated,
}: {
  comments: CommentModel[];
  commentType: string;
  onCommentAdded: (newComment: CommentModel) => void;
  onCommentDeleted: (id: string) => void;
  onCommentUpdated: (updatedComment: CommentModel) => void;
}) {
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const commentListRef = useRef<HTMLUListElement>(null);

  const db = getFirestore();

  async function handleAddComment() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const createdAt = serverTimestamp();
      const docRef = await addDoc(collection(db, "comments"), {
        text: trimmed,
        type: commentType,
        createdAt,
      });

      onCommentAdded({ id: docRef.id, text: trimmed, type: commentType, createdAt });
      setInput("");
    } catch (error) {
      console.error("Error adding comment: ", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteComment(id: string) {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "คุณต้องการลบความคิดเห็นนี้หรือไม่?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "comments", id));
        onCommentDeleted(id);
        Swal.fire('ลบสำเร็จ', 'ความคิดเห็นถูกลบเรียบร้อยแล้ว.', 'success');
      } catch (error) {
        Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบความคิดเห็นได้', 'error');
      }
    }
  }

  async function handleEditSave(id: string) {
    const trimmed = editText.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const commentRef = doc(db, "comments", id);
      await updateDoc(commentRef, { text: trimmed });
      onCommentUpdated({ id, text: trimmed, type: commentType });
      setEditId(null);
      setEditText("");
    } catch (error) {
      Swal.fire('เกิดข้อผิดพลาด', `ไม่สามารถบันทึกความคิดเห็นได้ ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  }

  function startEditing(comment: CommentModel) {
    setEditId(comment.id);
    setEditText(comment.text);
  }

  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className="mt-6">
      {comments.length > 0 && (
        <>
          <h3 className="font-semibold mb-2 text-gray-700">ความคิดเห็น</h3>
          <ul
            ref={commentListRef}
            className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm"
          >
            {comments.map((c) => (
              <li
                key={c.id}
                className="flex justify-between items-center bg-white hover:bg-gray-100 transition rounded-lg px-3 py-2 border border-gray-200"
              >
                {editId === c.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border rounded p-1 flex-grow mr-2"
                      disabled={loading}
                    />
                    <button
                      onClick={() => handleEditSave(c.id)}
                      disabled={loading || !editText.trim()}
                      className="text-green-600 hover:underline"
                      title="บันทึก"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button
                      onClick={() => {
                        setEditId(null);
                        setEditText("");
                      }}
                      disabled={loading}
                      className="text-red-600 hover:underline ml-2"
                      title="ยกเลิก"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-800">{c.text}</span>
                    <div className="flex space-x-2 text-sm">
                      <button
                        onClick={() => startEditing(c)}
                        className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                        title="แก้ไข"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="text-red-600 hover:text-red-800 transition cursor-pointer"
                        title="ลบ"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex mt-3 space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="เพิ่มความคิดเห็น"
          className="border rounded-lg p-2 flex-grow shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={loading}
        />
        <button
          onClick={handleAddComment}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          เพิ่ม
        </button>
      </div>
    </div>
  );
}
