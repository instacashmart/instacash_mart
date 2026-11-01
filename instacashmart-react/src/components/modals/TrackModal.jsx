import { TrackForm } from "../track/TrackForm";
import { CloseButton, Modal } from "../ui/Modal";
import { useApp } from "../../context/AppContext";

export function TrackModal() {
  const { modal, closeModal, trackId } = useApp();
  return (
    <Modal
      open={modal === "track"}
      onClose={closeModal}
      className="max-w-md p-6 max-h-[95vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Track Your Order</h3>
          <p className="text-xs text-slate-500">Sell pickups (CN-…) and accessory orders (CNB-…)</p>
        </div>
        <CloseButton onClick={closeModal} />
      </div>
      <TrackForm
        initialId={trackId}
        emptyText="Enter the order ID from your confirmation to see its status."
      />
    </Modal>
  );
}
