import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Edit, Trash2, Phone, Mail, MapPin, Bike } from "lucide-react";
import { getProfileImageUrl } from "@/lib/imageUtils";

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  email: string;
  townId?: string;
  townName?: string;
  isOnline: boolean;
  profile?: string;
}

interface DeliveryTableProps {
  deliveryPersons: DeliveryPerson[];
  onEdit: (delivery: DeliveryPerson) => void;
  onDelete: (id: string) => void;
}

const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveryPersons,
  onEdit,
  onDelete,
}) => {
  if (deliveryPersons.length === 0) {
    return (
      <div className="text-center py-12">
        <Bike className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No delivery persons found</h3>
        <p className="text-muted-foreground">Add a new delivery person to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {deliveryPersons.map((person) => (
        <Card key={person.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={getProfileImageUrl(person.profile) || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    person.isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={person.isOnline ? "Online" : "Offline"}
                />
              </div>
              <div>
                <h3 className="font-semibold text-base">{person.name}</h3>
                <Badge
                  variant={person.isOnline ? "default" : "secondary"}
                  className={person.isOnline ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {person.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{person.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="truncate">{person.email}</span>
            </div>
            {person.townName && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{person.townName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Bike className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Bicycle Delivery</span>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(person)}
              className="flex-1"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(person.id)}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DeliveryTable;
