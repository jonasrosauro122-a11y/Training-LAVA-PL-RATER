import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { QuoteResult, AutoQuoteInput, HomeownersQuoteInput } from "./types"

// Function to load and embed the LAVA logo
async function loadLogoAsBase64(): Promise<string | null> {
  try {
    // Attempt to load the logo from the public folder
    const response = await fetch("/apple-icon.png1")
    if (!response.ok) return null
    
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function exportQuotePDF(result: QuoteResult) {
  const doc = new jsPDF()
  const sortedQuotes = [...result.quotes].sort(
    (a, b) => a.annualPremium - b.annualPremium
  )
  const bestQuote = sortedQuotes.find((q) => q.isBestValue) || sortedQuotes[0]

  // Try to load the logo
  const logoBase64 = await loadLogoAsBase64()
  
  // Header with logo
  let headerStartX = 14
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", 14, 10, 20, 20)
      headerStartX = 40
    } catch {
      // If logo fails to load, continue without it
    }
  }

  doc.setFontSize(22)
  doc.setTextColor(214, 40, 40) // lava-red
  doc.text("LAVA Training Rater", headerStartX, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Insurance Quote Comparison Report", headerStartX, 30)

  // Line separator
  doc.setDrawColor(214, 40, 40)
  doc.setLineWidth(0.5)
  doc.line(14, 36, 196, 36)

  // Quote Info
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  const quoteType = result.type === "auto" ? "Auto" : "Homeowners"
  doc.text(`Quote Type: ${quoteType} Insurance`, 14, 46)
  doc.text(`Customer: ${result.customerName}`, 14, 53)
  doc.text(`VA: ${result.vaName}`, 14, 60)
  doc.text(
    `Date: ${new Date(result.createdAt).toLocaleDateString()}`,
    14,
    67
  )
  doc.text(`Quote ID: ${result.id}`, 14, 74)
  
  // Add vehicle count for auto quotes
  if (result.type === "auto") {
    const autoInput = result.input as AutoQuoteInput
    const vehicleCount = autoInput.vehicles?.length || 1
    doc.text(`Vehicles: ${vehicleCount}`, 120, 46)
    if (autoInput.paymentPlan) {
      const planLabels: Record<string, string> = {
        "paid-in-full": "Paid in Full",
        "2-pay": "2 Pay",
        "4-pay": "4 Pay",
        "monthly": "Monthly",
      }
      doc.text(`Payment Plan: ${planLabels[autoInput.paymentPlan] || autoInput.paymentPlan}`, 120, 53)
    }
  }

  // Summary Box
  doc.setFillColor(255, 107, 53) // lava-orange
  doc.roundedRect(14, 82, 182, 22, 3, 3, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.text("Best Value", 20, 92)
  doc.setFontSize(14)
  doc.text(
    `${bestQuote.carrierName} - $${bestQuote.annualPremium.toLocaleString()}/year ($${Math.round(bestQuote.annualPremium / 12).toLocaleString()}/mo)`,
    20,
    100
  )

  // Comparison Table
  const tableData = sortedQuotes.map((q, i) => [
    `#${i + 1}`,
    q.carrierName,
    `$${q.annualPremium.toLocaleString()}`,
    `$${Math.round(q.annualPremium / 12).toLocaleString()}`,
    q.discountsApplied.join(", ") || "None",
    q.isBestValue ? "BEST" : "",
  ])

  autoTable(doc, {
    startY: 112,
    head: [["Rank", "Carrier", "Annual", "Monthly", "Discounts", ""]],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [214, 40, 40],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [40, 40, 40],
    },
    alternateRowStyles: {
      fillColor: [255, 245, 238],
    },
    columnStyles: {
      0: { cellWidth: 14, halign: "center" },
      2: { halign: "right", fontStyle: "bold" },
      3: { halign: "right" },
      5: {
        halign: "center",
        fontStyle: "bold",
        textColor: [214, 40, 40],
      },
    },
  })

  // Coverage Details table
  let finalY =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10

  if (finalY < 220) {
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Coverage Details - Best Value Carrier", 14, finalY)

    const coverageData = bestQuote.coverageDetails.map((d) => [
      d.label,
      d.value,
    ])

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Coverage", "Amount"]],
      body: coverageData,
      theme: "grid",
      headStyles: {
        fillColor: [247, 127, 0],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
    })
    
    finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  }

  // Add vehicle details for auto quotes
  if (result.type === "auto" && finalY < 240) {
    const autoInput = result.input as AutoQuoteInput
    if (autoInput.vehicles && autoInput.vehicles.length > 0) {
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text("Vehicle Information", 14, finalY)

      const vehicleData = autoInput.vehicles.map((v, i) => [
        `Vehicle ${i + 1}`,
        `${v.year} ${v.make} ${v.model}`,
        v.vin || "N/A",
        v.deductible === "none" ? "Liability Only" : `$${v.deductible}`,
        v.roadsideAssistance ? "Yes" : "No",
      ])

      autoTable(doc, {
        startY: finalY + 5,
        head: [["", "Vehicle", "VIN", "Deductible", "Roadside"]],
        body: vehicleData,
        theme: "grid",
        headStyles: {
          fillColor: [100, 100, 100],
          textColor: [255, 255, 255],
          fontSize: 9,
        },
        bodyStyles: { fontSize: 8 },
      })
    }
  }
  
  // Add property details for homeowners quotes
  if (result.type === "homeowners" && finalY < 240) {
    const homeInput = result.input as HomeownersQuoteInput
    doc.setFontSize(12)
    doc.setTextColor(40, 40, 40)
    doc.text("Property Information", 14, finalY)
    
    const roofShapeLabels: Record<string, string> = {
      hip: "Hip", gable: "Gable", flat: "Flat", shed: "Shed", other: "Other"
    }
    const roofMaterialLabels: Record<string, string> = {
      asphalt: "Asphalt Shingles", tile: "Tile", metal: "Metal", wood: "Wood", slate: "Slate"
    }
    
    const propertyData = [
      ["Policy Type", homeInput.propertyInfo.policyType || "N/A"],
      ["Year Built", homeInput.propertyInfo.yearBuilt || "N/A"],
      ["Square Footage", homeInput.propertyInfo.squareFootage ? `${homeInput.propertyInfo.squareFootage} sq ft` : "N/A"],
      ["Bedrooms/Bathrooms", `${homeInput.propertyInfo.numberOfBedrooms || "N/A"} BR / ${homeInput.propertyInfo.numberOfBathrooms || "N/A"} BA`],
      ["Roof Shape", roofShapeLabels[homeInput.propertyInfo.roofShape] || homeInput.propertyInfo.roofShape || "N/A"],
      ["Roof Material", roofMaterialLabels[homeInput.propertyInfo.roofMaterial] || homeInput.propertyInfo.roofMaterial || "N/A"],
      ["Roof Year Installed", homeInput.propertyInfo.roofYearInstalled || "N/A"],
    ]

    autoTable(doc, {
      startY: finalY + 5,
      head: [["Property Detail", "Value"]],
      body: propertyData,
      theme: "grid",
      headStyles: {
        fillColor: [100, 100, 100],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9 },
    })
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      "Generated by LAVA Training Rater - For Training Purposes Only",
      14,
      287
    )
    doc.text(`Page ${i} of ${pageCount}`, 180, 287)
  }

  // Save
  const filename = `LAVA_${quoteType}_Quote_${result.customerName.replace(/\s+/g, "_")}_${new Date(result.createdAt).toISOString().split("T")[0]}.pdf`
  doc.save(filename)
}
