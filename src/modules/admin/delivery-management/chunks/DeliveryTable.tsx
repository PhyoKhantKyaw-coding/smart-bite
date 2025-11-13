import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Phone, Mail, Star, Package, DollarSign } from "lucide-react";

interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  isOnline: boolean;
  currentLocation: { lat: number; lng: number };
  rating: number;
  totalDeliveries: number;
  completedToday: number;
  earnings: number;
  joinedDate: string;
  avatar: string;
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
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No delivery persons found</h3>
        <p className="text-muted-foreground">Add a new delivery person to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Delivery Person</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Performance</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryPersons.map((person) => (
            <TableRow key={person.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        person.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {person.id}</p>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    <Phone className="w-3 h-3" />
                    <span>{person.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span>{person.email}</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <p className="font-medium text-sm">{person.vehicleType}</p>
                  <p className="text-xs text-muted-foreground">{person.vehicleNumber}</p>
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <Badge
                    className={
                      person.status === "Active"
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }
                  >
                    {person.status}
                  </Badge>
                  {person.isOnline && (
                    <Badge variant="outline" className="block w-fit text-xs">
                      Online
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="space-y-1">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold">{person.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <Package className="w-3 h-3" />
                    <span>{person.completedToday} today</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {person.totalDeliveries} total
                  </p>
                </div>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {(person.earnings / 1000).toFixed(0)}K
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">MMK</p>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(person)}
                    className="h-8 w-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(person.id)}
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryTable;
