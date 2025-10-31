import { IWarehouse } from "@/lib/types";
import { Button } from "./ui/button";
import { CheckCircle, Download, Shield } from "lucide-react";

interface BookingReceiptProps {
  warehouse: IWarehouse;
  transactionHash: string;
  onClose: () => void;
}

export const BookingReceipt = ({ warehouse, transactionHash, onClose }: BookingReceiptProps) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl p-8 max-w-lg w-full relative">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
          <p className="text-muted-foreground">Your receipt has been generated.</p>
        </div>
        <div className="space-y-4 text-sm bg-off-white p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Warehouse:</span>
            <span className="font-medium">{warehouse.warehouseName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium">{warehouse.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Paid:</span>
            <span className="font-medium">{warehouse.price} HBAR</span>
          </div>
           <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction Hash:</span>
            <a href={`https://hashscan.io/testnet/transaction/${transactionHash}`} target="_blank" rel="noopener noreferrer" className="font-medium text-secondary truncate max-w-[150px] hover:underline">
              {transactionHash}
            </a>
          </div>
        </div>
        <div className="mt-6 space-y-3">
            <Button variant="hero" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                Initiate Insurance Claim
            </Button>
            <Button variant="outline" className="w-full" onClick={onClose}>
                <Download className="mr-2 h-4 w-4" />
                Close & Return
            </Button>
        </div>
      </div>
    </div>
  );
};
