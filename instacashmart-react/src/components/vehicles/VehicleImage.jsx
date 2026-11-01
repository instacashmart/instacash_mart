import { getVehicleType, vehicleTitle } from "../../data/vehicles";

export function VehicleImage({ vehicle, boxClass }) {
  if (vehicle.image) {
    return (
      <img
        src={vehicle.image}
        alt={vehicleTitle(vehicle)}
        loading="lazy"
        className={`${boxClass} object-cover`}
      />
    );
  } else {
    return (
      <span className={`${boxClass} flex items-center justify-center bg-slate-50`}>
        <img
          src={getVehicleType(vehicle.type).image}
          alt={vehicleTitle(vehicle)}
          className="w-4/5 h-4/5 object-contain"
        />
      </span>
    );
  }
}
