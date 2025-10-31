import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Star, Shield, Camera, Clock, Grid3x3, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllWarehouses } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { IWarehouse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";


// const warehouses = [
//   {
//     id: 1,
//     name: "Green Valley Storage",
//     location: "Ghaziabad, Uttar Pradesh",
//     distance: "2.3 km",
//     capacity: "500 tons",
//     type: "Climate Controlled",
//     security: "24/7 CCTV",
//     price: 2500,
//     rating: 4.5,
//     reviews: 127,
//     available: true,
//     premium: true,
//     verified: true,
//   },
//   {
//     id: 2,
//     name: "Sunrise Agri Warehouse",
//     location: "Noida, Uttar Pradesh",
//     distance: "5.1 km",
//     capacity: "750 tons",
//     type: "Standard",
//     security: "Security Guard",
//     price: 1800,
//     rating: 4.2,
//     reviews: 89,
//     available: true,
//     premium: false,
//     verified: true,
//   },
//   {
//     id: 3,
//     name: "Golden Harvest Storage",
//     location: "Greater Noida, UP",
//     distance: "8.7 km",
//     capacity: "1000 tons",
//     type: "Climate Controlled",
//     security: "24/7 CCTV",
//     price: 3200,
//     rating: 4.8,
//     reviews: 215,
//     available: false,
//     premium: true,
//     verified: true,
//   },
// ];

const Listings = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  // FETCH REAL DATA
  const { data: warehouses, isLoading, isError } = useQuery({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses,
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load warehouses.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Dashboard Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, Farmer!</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Showing warehouses near Ghaziabad, Uttar Pradesh
          </p>
        </div>
      </div>

      <div className="flex-1 bg-off-white">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:col-span-1 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-card rounded-xl p-6 space-y-6 sticky top-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setFiltersOpen(false)} className="lg:hidden">
                    Close
                  </Button>
                </div>

                {/* Distance Filter */}
                <div className="space-y-3">
                  <Label>Distance (km)</Label>
                  <Slider defaultValue={[10]} max={50} step={1} className="[&_[role=slider]]:bg-secondary" />
                  <p className="text-xs text-muted-foreground">Within 10 km</p>
                </div>

                {/* Capacity Filter */}
                <div className="space-y-3">
                  <Label>Capacity (tons)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" className="h-9" />
                    <Input type="number" placeholder="Max" className="h-9" />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <div className="space-y-2">
                    {[4, 3, 2].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox id={`rating-${rating}`} />
                        <label htmlFor={`rating-${rating}`} className="text-sm flex items-center gap-1">
                          {rating}+ <Star className="h-3 w-3 fill-secondary text-secondary" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facilities Filter */}
                <div className="space-y-3">
                  <Label>Facilities</Label>
                  <div className="space-y-2">
                    {["Climate Controlled", "24/7 CCTV", "Loading Dock", "Insurance Available"].map((facility) => (
                      <div key={facility} className="flex items-center space-x-2">
                        <Checkbox id={facility} />
                        <label htmlFor={facility} className="text-sm">
                          {facility}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="hero" className="w-full">Apply Filters</Button>
                <Button variant="ghost" className="w-full text-secondary">Clear All</Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search & Sort Bar */}
              <div className="bg-card rounded-xl p-4 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search warehouses by name, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            {/* Results Counter */}
                  <div className="flex items-center justify-between text-sm">
                    {/* Use real data length */}
                    <p className="text-muted-foreground">Showing {warehouses?.length || 0} warehouses</p>
                     {/* ... */}
                  </div>

              {/* Warehouse Grid - MAP OVER REAL DATA */}
<div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
  {warehouses?.map((warehouse: IWarehouse) => ( // Use the IWarehouse type
     <div key={warehouse._id} className={`card-lift bg-card rounded-xl overflow-hidden border border-border shadow-sm ${warehouse.isBooked ? 'opacity-50' : ''}`}>
       <div className="relative h-48 bg-muted">
         {/* --- ADD A BOOKED OVERLAY --- */}
         {warehouse.isBooked && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-lg">BOOKED</Badge>
            </div>
         )}
         {warehouse.images && warehouse.images.length > 0 ? (
                             <img 
                               // NOTE: You might need to adjust this URL based on how your backend serves static files.
                               // If your backend is at localhost:5000, and it serves 'uploads' folder:
                               src={`http://localhost:5000/${warehouse.images[0].replace(/\\/g, '/')}`}
                               alt={warehouse.warehouseName}
                               className="w-full h-full object-cover"
                               onError={(e) => {
                                 // Fallback if image fails to load
                                 (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                               }}
                             />
                          ) : (
                             <div className="flex items-center justify-center h-full text-muted-foreground">
                               <Camera className="h-12 w-12" />
                             </div>
                          )}
                        </div>

                        <div className="p-5 space-y-3">
                           <div>
                             <h3 className="font-bold text-lg mb-1">{warehouse.warehouseName}</h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3" />
                                {/* Backend might not have all these fields yet, adjust as needed */}
                                <span>{warehouse.location}</span>
                              </div>
                           </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-border">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Capacity</p>
                          <p className="text-sm font-semibold">{warehouse.capacity}</p>
                        </div>
                        <div className="text-center border-x border-border">
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="text-sm font-semibold text-xs">{warehouse.type}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Security</p>
                          <p className="text-sm font-semibold text-xs">{warehouse.security}</p>
                        </div>
                      </div>

                      {/* Price */}
 {/* Price - THIS IS THE FIX */}
        <div>
          <p className="text-2xl font-bold text-primary">
            {/* Use optional chaining and a fallback text if price is missing */}
            {warehouse.price ? `${warehouse.price.toLocaleString()}` : 'Price not set'}
          </p>
          <p className="text-xs text-muted-foreground">HBAR/ton/month</p>
        </div>

                      {/* Availability */}
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${warehouse.available ? "bg-secondary" : "bg-destructive"}`} />
                        <span className={`text-xs font-medium ${warehouse.available ? "text-secondary" : "text-destructive"}`}>
                          {warehouse.available ? "Available Now" : "Fully Booked"}
                        </span>
                      </div>

                      {/* Action */}
                     <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/warehouse/${warehouse._id}`)}
            disabled={warehouse.isBooked} // Disable button if booked
          >
            {warehouse.isBooked ? "View Details" : "View & Book"}
          </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
