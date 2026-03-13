import { useState } from "react";
import T from "../utils/theme";
import Input from "./Input";
import Btn from "./Btn";
import Modal from "./Modal";

export const EmailModal = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <Modal title=" Email Report Summary" onClose={onClose}>
      {sent ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
        
          <div style={{ color: T.green, fontWeight: 600 }}>
            Report sent successfully!
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ color: T.text, fontSize: 13 }}>
            Send today's library visitor report summary to an email address.
          </div>
          <Input
            placeholder="recipient@neu.edu.ph"
            value={email}
            onChange={setEmail}
            style={{ width: "100%" }}
          />
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="ghost" onClick={onClose}>
              Cancel
            </Btn>
            <Btn
              onClick={() => {
                if (email) setSent(true);
              }}
            >
              Send Report
            </Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EmailModal;
