import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { getProfileImageUrl } from "@/lib/imageUtils";
import { addDelivery, updateDelivery } from "@/api/delivery";
import { getAllTowns } from "@/api/store";
import type { TownDTO } from "@/api/store/types";

interface DeliveryPerson {
  id?: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  profile?: string;
  townId?: string;
  townName?: string;
  isOnline: boolean;
}

interface AddEditDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  delivery: DeliveryPerson | null;
  onSave: () => void;
}

const AddEditDeliveryDialog: React.FC<AddEditDeliveryDialogProps> = ({
  open,
  onOpenChange,
  delivery,
  onSave,
}) => {
  const [formData, setFormData] = useState<DeliveryPerson>({
    name: "",
    phone: "",
    email: "",
    password: "",
    townId: "",
    isOnline: true,
  });
  const [loading, setLoading] = useState(false);
  const [towns, setTowns] = useState<TownDTO[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [, setRemoveImage] = useState(false);

  // Fetch towns
  useEffect(() => {
    const fetchTowns = async () => {
      try {
        const response = await getAllTowns();
        if (response && response.data) {
          setTowns(response.data);
        }
      } catch (error) {
        console.error('Error fetching towns:', error);
      }
    };
    if (open) {
      fetchTowns();
    }
  }, [open]);

  useEffect(() => {
    if (delivery) {
      setFormData({...delivery, password: ""});
      if (delivery.profile) {
        const profileUrl = getProfileImageUrl(delivery.profile);
        setImagePreview(profileUrl || null);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
      setRemoveImage(false);
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        townId: "",
        isOnline: true,
      });
      setImagePreview(null);
      setImageFile(null);
      setRemoveImage(false);
    }
  }, [delivery, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setRemoveImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.townId) {
      toast.error("Please fill in all required fields including town");
      return;
    }

    setLoading(true);
    try {
      if (delivery?.id) {
        // Update existing delivery person
        const formDataToSend = new FormData();
        formDataToSend.append('DeliveryId', delivery.id);
        formDataToSend.append('DeliveryName', formData.name);
        formDataToSend.append('Email', formData.email);
        formDataToSend.append('PhNo', formData.phone);
        if (formData.password) {
          formDataToSend.append('Password', formData.password);
        }
        formDataToSend.append('TownId', formData.townId || '');
        formDataToSend.append('IsOnline', formData.isOnline.toString());
        
        // Add profile image if selected
        if (imageFile) {
          formDataToSend.append('ProfileFile', imageFile);
        }
        
        const response = await updateDelivery(formDataToSend);
        if (response.status === 0 || response.status === 200 || response.status === 201) {
          // Call onSave to refresh the table, then close dialog
          await Promise.resolve(onSave());
          toast.success(response.message || "Delivery person updated successfully!");
          onOpenChange(false);
        } else {
          toast.error(response.message || "Failed to update delivery person");
        }
      } else {
        // Add new delivery person
        const formDataToSend = new FormData();
        formDataToSend.append('DeliveryName', formData.name);
        formDataToSend.append('Password', formData.password || '123456');
        formDataToSend.append('Email', formData.email);
        formDataToSend.append('PhNo', formData.phone);
        formDataToSend.append('TownId', formData.townId || '');
        formDataToSend.append('IsOnline', formData.isOnline.toString());
        
        // Add profile image if selected (optional for new delivery person)
        if (imageFile) {
          formDataToSend.append('ProfileFile', imageFile);
        }
        
        const response = await addDelivery(formDataToSend);
        if (response.status === 0 || response.status === 200 || response.status === 201) {
          // Call onSave to refresh the table, then close dialog
          await Promise.resolve(onSave());
          toast.success(response.message || "Delivery person added successfully!");
          onOpenChange(false);
        } else {
          toast.error(response.message || "Failed to add delivery person");
        }
      }
    } catch (error: unknown) {
      console.error("Failed to save delivery:", error);
      toast.error( "Failed to save delivery person");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[90%] md:w-[85%] lg:w-[75%] max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {delivery ? "Edit Delivery Person" : "Add New Delivery Person"}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {delivery ? "Update delivery personnel information" : "Add a new delivery person to your team"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Personal Information</h3>
            
            {/* Profile Picture Upload */}
            <ImageUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              label="Profile Picture"
              description="Upload a profile picture"
              subDescription="JPG, PNG or GIF (Max 5MB)"
              shape="circle"
              size="md"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+95 9XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@delivery.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password {!delivery && "*"}</Label>
              <Input
                id="password"
                type="password"
                placeholder={delivery ? "Leave blank to keep current password" : "Enter password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!delivery}
              />
              {delivery && (
                <p className="text-xs text-muted-foreground">
                  Only fill this if you want to change the password
                </p>
              )}
            </div>
          </div>

          {/* Town Selection */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Delivery Area</h3>
            
            <div className="space-y-2">
              <Label htmlFor="townId">Town *</Label>
              <select
                id="townId"
                value={formData.townId}
                onChange={(e) => setFormData({ ...formData, townId: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select Town</option>
                {towns.map((town) => (
                  <option key={town.townId} value={town.townId}>
                    {town.townName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                All delivery personnel use bicycles for eco-friendly transportation
              </p>
            </div>
          </div>

          {/* Online Status */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Status</h3>
            
            <div className="space-y-2">
              <Label>Online Status</Label>
              <RadioGroup
                value={formData.isOnline ? "online" : "offline"}
                onValueChange={(value) => setFormData({ ...formData, isOnline: value === "online" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="online" />
                  <Label htmlFor="online" className="cursor-pointer">Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offline" id="offline" />
                  <Label htmlFor="offline" className="cursor-pointer">Offline</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                Location and device token will be updated when delivery person logs in
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gradient-primary text-sm" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : delivery ? "Update" : "Add"} Delivery Person
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDeliveryDialog;
