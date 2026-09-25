import "./ConfirmModal.css";

function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
}) {
    return (
        <div className="modal-overlay">

            <div className="confirm-modal">

                <div className="confirm-icon">
                    🚪
                </div>

                <h2>
                    {title}
                </h2>

                <p>
                    {message}
                </p>

                <div className="confirm-actions">

                    <button
                        className="cancel-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        className="confirm-button"
                        onClick={onConfirm}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ConfirmModal;