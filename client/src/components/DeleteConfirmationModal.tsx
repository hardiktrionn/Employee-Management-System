
import { GoTrash } from "react-icons/go";
import { IoClose } from "react-icons/io5";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeletingData: boolean
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeletingData
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <IoClose
          className="absolute top-4 right-4 text-xl cursor-pointer"
          onClick={onClose}
        />
        <div className="flex justify-center mb-4">
          <GoTrash size={60} className="text-red-500" />
        </div>
        <h2 className="text-lg font-semibold text-center text-gray-800">
          Are you sure you want to delete?
        </h2>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={isDeletingData}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer disabled:bg-red-200 disabled:cursor-no-drop disabled:animate-pulse"
          >
            {isDeletingData ? "Deleteing..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
