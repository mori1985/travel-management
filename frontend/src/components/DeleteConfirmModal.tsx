import React from 'react';

interface DeleteConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-red-600 text-lg mb-4">آیا مطمئن هستید که می‌خواهید این مسافر را حذف کنید؟</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            بله
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            خیر
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;