import "./Toast.css";

function Toast({ message, type = "success", onClose }) {
    return (
        <div className={`toast toast-${type}`}>
            <div className="toast-icon">
                {type === "success" ? "✓" : "✕"}
            </div>

            <div className="toast-message">
                {message}
            </div>

            <button
                className="toast-close"
                onClick={onClose}
            >
                ×
            </button>
        </div>
    );
}

export default Toast;