// src/pages/WarehouseDetails.tsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWarehouseDetails, bookWarehouse } from "@/lib/api";
import { ArrowLeft, MapPin, Package, Star, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useSendTransaction } from 'wagmi';
import { parseUnits } from 'viem';
import { BookingReceipt } from "@/components/BookingReceipt";
import { hederaAccountIdToEvmAddress } from "@/lib/utils"; // <-- IMPORT THE NEW FUNCTION

const WarehouseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { address } = useAccount();
  const { sendTransactionAsync, isPending: isTxPending } = useSendTransaction();

  const [showReceipt, setShowReceipt] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  const { data: warehouse, isLoading, isError, error } = useQuery({
    queryKey: ['warehouse', id],
    queryFn: () => getWarehouseDetails(id!),
    enabled: !!id,
  });
  
  const bookingMutation = useMutation({
    mutationFn: bookWarehouse,
    onSuccess: () => {
      toast({ title: "Booking Finalized!", description: "The warehouse status has been updated." });
      queryClient.invalidateQueries({ queryKey: ['warehouse', id] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      setShowReceipt(true);
    },
    onError: (e: Error) => {
       toast({ title: "Booking Finalization Failed", description: e.message, variant: "destructive" });
    }
  });

  const handleBooking = async () => {
    if (!address) {
      toast({ title: "Wallet Not Connected", description: "Please connect your wallet to book.", variant: "destructive" });
      return;
    }
    if (!warehouse?.walletAddress || !warehouse.price) {
      toast({ title: "Error", description: "Warehouse wallet or price is missing.", variant: "destructive" });
      return;
    }

    try {
      // --- CORE FIX: Convert the address before sending ---
      const evmAddress = hederaAccountIdToEvmAddress(warehouse.walletAddress);

      const txHash = await sendTransactionAsync({
        to: evmAddress, // Use the converted address
        value: parseUnits(warehouse.price.toString(), 8),
      });

      toast({ title: "Transaction Successful!", description: "Finalizing booking..." });
      setTransactionHash(txHash);
      bookingMutation.mutate(id!);

    } catch (e: any) {
      toast({ 
        title: "Transaction Failed", 
        description: e.message || "User rejected the transaction or an error occurred.", 
        variant: "destructive" 
      });
    }
  };
  
  // ... rest of the component remains the same
  // (Loading states, error states, and JSX)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Warehouse Details...</p>
      </div>
    );
  }

  if (isError || !warehouse) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Could not load warehouse</h2>
        <p className="text-muted-foreground mb-6">
          {error ? error.message : "The requested warehouse could not be found."}
        </p>
        <Button onClick={() => navigate("/listings")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Button>
      </div>
    );
  }

  return (
    <>
      {showReceipt && transactionHash && warehouse && (
        <BookingReceipt 
          warehouse={warehouse}
          transactionHash={transactionHash}
          onClose={() => setShowReceipt(false)}
        />
      )}

    <div className="min-h-screen flex flex-col bg-off-white">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/listings")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-96 bg-muted">
                    {warehouse.images?.[0] ? (
                        <img
                            src={`http://localhost:5000/${warehouse.images[0].replace(/\\/g, '/')}`}
                            alt={warehouse.warehouseName}
                            className="w-full h-full object-cover"
                        />
                    ) : <div className="flex h-full w-full items-center justify-center text-muted-foreground">No Image</div>}
                </div>
              </div>

              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {warehouse.warehouseName}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="h-4 w-4 text-sage" />
                  <span className="text-sm">{warehouse.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-off-white rounded-lg">
                  <div className="text-center">
                    <Package className="h-6 w-6 text-sage mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                    <p className="font-semibold text-sm">{warehouse.capacity} tons</p>
                  </div>
                  <div className="text-center">
                    <Star className="h-6 w-6 text-sage mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">Owner</p>
                    <p className="font-semibold text-sm">{warehouse.ownerName}</p>
                  </div>
                </div>

                {warehouse.description && (
                    <div className="border-t border-border pt-6">
                        <h3 className="font-bold text-lg mb-3">Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {warehouse.description}
                        </p>
                    </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-6 shadow-lg sticky top-24">
                 <div className="mb-6">
                  <p className="text-2xl font-bold text-secondary mb-1">
                    {warehouse.price ? `${warehouse.price.toLocaleString()}` : 'Contact for Price'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                     HBAR/ton/month
                  </p>
                </div>
                 <div className="space-y-3">
              {warehouse.isBooked ? (
                <Button size="lg" className="w-full" disabled>
                  Warehouse Booked
                </Button>
              ) : (
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleBooking}
                  disabled={isTxPending || bookingMutation.isPending}
                >
                  {(isTxPending || bookingMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isTxPending ? "Awaiting Wallet..." : bookingMutation.isPending ? "Finalizing..." : "Book Now"}
                </Button>
              )}
            </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    Owner: <span className="font-medium text-foreground">{warehouse.ownerName}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
        </>
  );
};

export default WarehouseDetails;