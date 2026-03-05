import User from "../types/User"
import { useState,  } from "react";
import T from "../utils/theme"
import Btn from "./Btn"
import Input from "./Input";
import Modal from "./Modal"
export const BlockModal = ({
  user,
  onConfirm,
  onClose,
}: {
  user: User;
  onConfirm: (r: string) => void;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState("");
  return (
    <Modal title={`🚫 Block ${user.name}?`} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ color: T.text, fontSize: 13 }}>
          This will prevent the user from accessing the library system. Please
          provide a reason.
        </div>
        <Input
          placeholder="Reason for blocking..."
          value={reason}
          onChange={setReason}
          style={{ width: "100%" }}
        />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              if (reason) onConfirm(reason);
            }}
            disabled={!reason}
          >
            Confirm Block
          </Btn>
        </div>
      </div>
    </Modal>
  );
};

export default BlockModal;