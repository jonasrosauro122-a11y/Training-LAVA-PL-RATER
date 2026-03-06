export interface VinResult {
  year: string
  make: string
  model: string
  bodyClass: string
  vehicleType: string
  error: string | null
}

export async function decodeVin(vin: string): Promise<VinResult> {
  const cleanVin = vin.trim().toUpperCase()

  if (cleanVin.length !== 17) {
    return {
      year: "",
      make: "",
      model: "",
      bodyClass: "",
      vehicleType: "",
      error: "VIN must be exactly 17 characters",
    }
  }

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${cleanVin}?format=json`
    )

    if (!res.ok) {
      throw new Error(`NHTSA API returned status ${res.status}`)
    }

    const data = await res.json()
    const result = data.Results?.[0]

    if (!result) {
      throw new Error("No results returned from NHTSA")
    }

    // Check for decode errors
    const errorCode = result.ErrorCode
    if (errorCode && errorCode !== "0" && !errorCode.includes("0")) {
      return {
        year: result.ModelYear || "",
        make: result.Make || "",
        model: result.Model || "",
        bodyClass: result.BodyClass || "",
        vehicleType: result.VehicleType || "",
        error: `Partial decode: ${result.ErrorText || "Some fields could not be decoded"}`,
      }
    }

    return {
      year: result.ModelYear || "",
      make: result.Make || "",
      model: result.Model || "",
      bodyClass: result.BodyClass || "",
      vehicleType: result.VehicleType || "",
      error: null,
    }
  } catch (err) {
    return {
      year: "",
      make: "",
      model: "",
      bodyClass: "",
      vehicleType: "",
      error: err instanceof Error ? err.message : "Failed to decode VIN",
    }
  }
}
